import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Coupon from '@/models/Coupon'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { couponUpdateSchema } from '@/lib/validations'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = couponUpdateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const update: Record<string, unknown> = { ...parsed.data }
    if (parsed.data.code) update.code = parsed.data.code.toUpperCase()
    if (parsed.data.expiresAt !== undefined) {
      update.expiresAt = parsed.data.expiresAt && parsed.data.expiresAt !== '' ? new Date(parsed.data.expiresAt) : null
    }
    const coupon = await Coupon.findByIdAndUpdate(params.id, update, { new: true })
    if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(coupon)
  } catch (err) {
    return handleApiError(err)
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const coupon = await Coupon.findByIdAndDelete(params.id)
    if (!coupon) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (err) {
    return handleApiError(err)
  }
}
