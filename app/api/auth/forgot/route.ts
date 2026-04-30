import { NextRequest, NextResponse } from 'next/server'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import User from '@/models/User'
import { sendPasswordReset } from '@/lib/email'
import { issuePasswordResetToken } from '@/lib/password-reset-token'
import { rateLimit } from '@/lib/rate-limit'
import { forgotPasswordSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/api-helpers'

/**
 * Forgot-password endpoint. Always returns 200 with `{ ok: true }`, regardless
 * of whether the email exists or the request was rate-limited — leaking that
 * information would let an attacker enumerate registered emails.
 */
export async function POST(req: NextRequest) {
  try {
    // Strict per-IP cap so an attacker can't spam the inbox of a known user
    // or fan out across many emails. 3 / hour is generous for legitimate use.
    const limited = await rateLimit(req, {
      limit: 3,
      windowMs: 60 * 60 * 1000,
      key: 'forgot-password',
    })
    if (!limited.ok) {
      return NextResponse.json({ ok: true })
    }

    const parsed = forgotPasswordSchema.safeParse(await req.json().catch(() => ({})))
    if (!parsed.success) {
      // Same response shape as the success path — don't reveal validation failures
      // to potential enumeration attempts. Only an honest user lands here typically,
      // and they'll see the "check your email" UI either way.
      return NextResponse.json({ ok: true })
    }

    if (!isDatabaseConfigured()) {
      return NextResponse.json({ ok: true })
    }

    await connectDB()
    const email = parsed.data.email.toLowerCase().trim()
    const user = await User.findOne({ email })

    // Only emit a token for users with a password (skip social-only accounts).
    if (user && user.password) {
      const token = await issuePasswordResetToken({
        userId: String(user._id),
        passwordHash: user.password,
      })
      const appUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'http://localhost:3000'
      const resetUrl = `${appUrl}/reset-password?token=${encodeURIComponent(token)}`
      void sendPasswordReset({
        email: user.email,
        name: user.name ?? user.email,
        resetUrl,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return handleApiError(err)
  }
}
