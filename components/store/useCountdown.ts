'use client'

import { useEffect, useState } from 'react'

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function endOfToday(): number {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

function split(ms: number): CountdownParts {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

/**
 * Live countdown to `endsAt`. Without an end date it counts down to midnight
 * (a rolling "today only" timer). Returns null until mounted to avoid SSR mismatch.
 */
export function useCountdown(endsAt?: string | null): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(null)

  useEffect(() => {
    const target = () => (endsAt ? new Date(endsAt).getTime() : endOfToday())
    const tick = () => setParts(split(target() - Date.now()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [endsAt])

  return parts
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
