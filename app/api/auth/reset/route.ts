import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import {
  verifyPasswordResetToken,
  passwordFingerprint,
} from '@/lib/password-reset-token'
import { rateLimit } from '@/lib/rate-limit'
import { resetPasswordSchema } from '@/lib/validations'
import { handleApiError } from '@/lib/api-helpers'

const INVALID = 'This reset link is invalid or has expired. Please request a new one.'

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit(req, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
      key: 'reset-password',
    })
    if (!limited.ok) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 },
      )
    }

    const parsed = resetPasswordSchema.safeParse(await req.json().catch(() => ({})))
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    const claims = await verifyPasswordResetToken(parsed.data.token)
    if (!claims) {
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    await connectDB()
    const user = await User.findById(claims.userId)
    if (!user || !user.password) {
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    // Pwh claim mismatch means: the token was already used (password changed
    // by an earlier reset) OR the user changed their password through /profile
    // since the token was issued. Either way the token is no longer valid.
    if (claims.pwh !== passwordFingerprint(user.password)) {
      return NextResponse.json({ error: INVALID }, { status: 400 })
    }

    user.password = await bcrypt.hash(parsed.data.password, 12)
    await user.save()

    return NextResponse.json({ ok: true })
  } catch (err) {
    return handleApiError(err)
  }
}
