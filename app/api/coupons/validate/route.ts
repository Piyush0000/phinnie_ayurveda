import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Coupon from '@/models/Coupon'
import { handleApiError } from '@/lib/api-helpers'
import { rateLimit } from '@/lib/rate-limit'
import { computeCouponDiscount } from '@/lib/coupon'

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().nonnegative(),
  items: z
    .array(z.object({ price: z.number().nonnegative(), quantity: z.number().int().positive() }))
    .optional(),
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
    if (c.type === 'BOGO' && (!parsed.data.items || parsed.data.items.length === 0)) {
      return NextResponse.json({ error: 'Add items to your cart to use this offer' }, { status: 400 })
    }
    const discountAmount = computeCouponDiscount(c, parsed.data.items ?? [], parsed.data.subtotal)
    if (c.type === 'BOGO' && discountAmount === 0) {
      const needed = (c.buyQty ?? 1) + (c.getQty ?? 1)
      return NextResponse.json(
        { error: `Add at least ${needed} items to unlock this offer` },
        { status: 400 },
      )
    }
    return NextResponse.json({
      code: c.code,
      type: c.type,
      value: c.value,
      buyQty: c.buyQty,
      getQty: c.getQty,
      discountAmount,
    })
  } catch (err) {
    return handleApiError(err)
  }
}
