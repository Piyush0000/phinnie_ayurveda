import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Coupon from '@/models/Coupon'
import { handleApiError } from '@/lib/api-helpers'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
})

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit(req, { limit: 20, windowMs: 60_000, key: 'coupon-validate' })
    if (!limited.ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    await connectDB()
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const c = await Coupon.findOne({ code: parsed.data.code.toUpperCase(), isActive: true })
    if (!c) return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    if (c.expiresAt && c.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Coupon expired' }, { status: 400 })
    }
    if (c.minOrder && parsed.data.subtotal < c.minOrder) {
      return NextResponse.json(
        { error: `Minimum order of ₹${c.minOrder} required` },
        { status: 400 },
      )
    }
    if (c.maxUses && c.usedCount >= c.maxUses) {
      return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 })
    }
    const discountAmount =
      c.type === 'PERCENT'
        ? Math.round((parsed.data.subtotal * c.value) / 100)
        : Math.min(c.value, parsed.data.subtotal)
    return NextResponse.json({
      code: c.code,
      type: c.type,
      value: c.value,
      discountAmount,
    })
  } catch (err) {
    return handleApiError(err)
  }
}
