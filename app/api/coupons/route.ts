import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Coupon from '@/models/Coupon'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { couponSchema } from '@/lib/validations'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json({ coupons })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { error } = await requireAdmin()
    if (error) return error
    await connectDB()
    const parsed = couponSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }
    const code = parsed.data.code.toUpperCase()
    const exists = await Coupon.findOne({ code })
    if (exists) return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 })
    const expiresAt =
      parsed.data.expiresAt && parsed.data.expiresAt !== '' ? new Date(parsed.data.expiresAt) : undefined
    const coupon = await Coupon.create({ ...parsed.data, code, expiresAt })
    return NextResponse.json(coupon)
  } catch (err) {
    return handleApiError(err)
  }
}
