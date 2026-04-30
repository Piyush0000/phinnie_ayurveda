import type { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

interface Options {
  limit: number
  windowMs: number
  /** Stable key for this limiter (e.g. 'login', 'order-create'). */
  key: string
}

interface Result {
  ok: boolean
  remaining: number
}

// ---------------------------------------------------------------------------
// Mode selection
//
// When UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN are set we use
// @upstash/ratelimit so quotas are enforced consistently across all Vercel
// serverless instances. Otherwise we fall back to a per-instance in-memory
// Map — fine for local dev and acceptable for very low-traffic deployments,
// but does NOT enforce a global quota in production.
// ---------------------------------------------------------------------------

const upstashConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN

let upstashRedis: Redis | null = null
const upstashLimiters = new Map<string, Ratelimit>()

function getUpstashLimiter(opts: Options): Ratelimit {
  // Cache one Ratelimit instance per (key, limit, window) tuple so repeated
  // calls to rateLimit() don't allocate a new limiter on every request.
  const cacheKey = `${opts.key}:${opts.limit}:${opts.windowMs}`
  let limiter = upstashLimiters.get(cacheKey)
  if (!limiter) {
    if (!upstashRedis) {
      upstashRedis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      })
    }
    limiter = new Ratelimit({
      redis: upstashRedis,
      limiter: Ratelimit.slidingWindow(opts.limit, `${opts.windowMs} ms`),
      prefix: `rl:${opts.key}`,
      analytics: false,
    })
    upstashLimiters.set(cacheKey, limiter)
  }
  return limiter
}

// ---------------------------------------------------------------------------
// In-memory fallback
// ---------------------------------------------------------------------------

interface Bucket {
  count: number
  resetAt: number
}

const memoryBuckets = new Map<string, Bucket>()

function memoryLimit(opts: Options, ip: string): Result {
  const bucketKey = `${opts.key}:${ip}`
  const now = Date.now()
  const existing = memoryBuckets.get(bucketKey)
  if (!existing || existing.resetAt < now) {
    memoryBuckets.set(bucketKey, { count: 1, resetAt: now + opts.windowMs })
    return { ok: true, remaining: opts.limit - 1 }
  }
  if (existing.count >= opts.limit) return { ok: false, remaining: 0 }
  existing.count += 1
  return { ok: true, remaining: opts.limit - existing.count }
}

// Periodic cleanup so the in-memory map can't grow unboundedly during a long
// dev session. No-op when Upstash is in use (memoryBuckets stays empty).
if (
  typeof globalThis !== 'undefined' &&
  !(globalThis as unknown as { __rlCleanup?: boolean }).__rlCleanup
) {
  ;(globalThis as unknown as { __rlCleanup?: boolean }).__rlCleanup = true
  setInterval(() => {
    const now = Date.now()
    for (const [k, v] of memoryBuckets) if (v.resetAt < now) memoryBuckets.delete(k)
  }, 60_000).unref?.()
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

function clientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function rateLimit(req: NextRequest, opts: Options): Promise<Result> {
  const ip = clientIp(req)
  if (upstashConfigured) {
    const limiter = getUpstashLimiter(opts)
    const result = await limiter.limit(ip)
    return { ok: result.success, remaining: result.remaining }
  }
  return memoryLimit(opts, ip)
}
