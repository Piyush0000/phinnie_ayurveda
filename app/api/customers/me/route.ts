import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { handleApiError, requireUser } from '@/lib/api-helpers'

const updateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
})

export async function PATCH(req: NextRequest) {
  try {
    const { error, session } = await requireUser()
    if (error || !session) return error!
    await connectDB()
    const parsed = updateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    const update: Record<string, unknown> = {}
    if (parsed.data.name !== undefined) update.name = parsed.data.name
    if (parsed.data.phone !== undefined) update.phone = parsed.data.phone

    if (parsed.data.newPassword) {
      const user = await User.findById(session.user.id)
      if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
      if (!user.password) {
        return NextResponse.json(
          { error: 'Cannot set password — account uses social sign-in' },
          { status: 400 },
        )
      }
      if (!parsed.data.currentPassword) {
        return NextResponse.json({ error: 'Current password required' }, { status: 400 })
      }
      const ok = await bcrypt.compare(parsed.data.currentPassword, user.password)
      if (!ok) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
      update.password = await bcrypt.hash(parsed.data.newPassword, 10)
    }

    const updated = await User.findByIdAndUpdate(session.user.id, update, { new: true })
      .select('-password')
      .lean()

    return NextResponse.json(updated)
  } catch (err) {
    return handleApiError(err)
  }
}
