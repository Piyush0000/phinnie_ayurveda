import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { handleApiError } from '@/lib/api-helpers'
import { registerSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    await connectDB()
    const exists = await User.findOne({ email: parsed.data.email.toLowerCase() })
    if (exists) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    const hash = await bcrypt.hash(parsed.data.password, 10)
    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      password: hash,
      role: 'CUSTOMER',
    })
    return NextResponse.json({
      id: String(user._id),
      email: user.email,
      name: user.name,
    })
  } catch (err) {
    return handleApiError(err)
  }
}
