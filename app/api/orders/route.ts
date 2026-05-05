import { NextRequest, NextResponse } from 'next/server'
import type { FilterQuery } from 'mongoose'
import { auth } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Order, { type IOrder } from '@/models/Order'
import Product from '@/models/Product'
import Coupon from '@/models/Coupon'
import SiteSettings from '@/models/SiteSettings'
import { handleApiError, requireAdmin } from '@/lib/api-helpers'
import { checkoutSchema } from '@/lib/validations'
import { generateOrderNumber } from '@/lib/order-number'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    await connectDB()
    const sp = req.nextUrl.searchParams
    const status = sp.get('status')
    const paymentStatusParam = sp.get('paymentStatus')
    const page = Math.max(1, Number(sp.get('page')) || 1)
    const limit = Math.min(50, Number(sp.get('limit')) || 20)

    const query: FilterQuery<IOrder> = {}
    if (status) query.status = status
    const isAdmin = session?.user?.role === 'ADMIN'
    if (!isAdmin) {
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      query.userId = session.user.id
    } else {
      // Admin default: hide failed-payment orders so they don't get fulfilled by
      // mistake. They remain queryable via ?paymentStatus=FAILED for reconciliation.
      if (paymentStatusParam) {
        query.paymentStatus = paymentStatusParam
      } else {
        query.paymentStatus = { $ne: 'FAILED' }
      }
    }

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ])
    return NextResponse.json({
      orders,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    })
  } catch (err) {
    return handleApiError(err)
  }
}

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit(req, { limit: 15, windowMs: 60_000, key: 'order-create' })
    if (!limited.ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    const session = await auth()
    await connectDB()
    const body = await req.json()
    const parsed = checkoutSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
        { status: 400 },
      )
    }

    const productIds = parsed.data.items.map((i) => i.productId)
    const products = await Product.find({ _id: { $in: productIds }, isActive: true }).lean()
    if (products.length !== parsed.data.items.length) {
      return NextResponse.json({ error: 'Some products are unavailable' }, { status: 400 })
    }

    const items = parsed.data.items.map((i) => {
      const p = products.find((pp) => String(pp._id) === i.productId)!
      if (p.stock < i.quantity) {
        throw new Error(`Insufficient stock for ${p.name}`)
      }
      return {
        productId: p._id,
        name: p.name,
        price: p.price,
        quantity: i.quantity,
        image: p.images[0],
        slug: p.slug,
      }
    })

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

    let discount = 0
    let appliedCoupon: { code: string } | null = null
    if (parsed.data.couponCode) {
      const c = await Coupon.findOne({
        code: parsed.data.couponCode.toUpperCase(),
        isActive: true,
      })
      if (c && (!c.expiresAt || c.expiresAt > new Date())) {
        if (!c.minOrder || subtotal >= c.minOrder) {
          if (!c.maxUses || c.usedCount < c.maxUses) {
            discount =
              c.type === 'PERCENT'
                ? Math.round((subtotal * c.value) / 100)
                : Math.min(c.value, subtotal)
            appliedCoupon = { code: c.code }
          }
        }
      }
    }

    const settings = (await SiteSettings.findOne().lean()) ?? {
      freeShippingMin: 0,
      shippingCharge: 0,
    }
    const afterDiscount = subtotal - discount
    const shippingCharge = afterDiscount >= settings.freeShippingMin ? 0 : settings.shippingCharge
    const tax = 0
    const total = Math.max(0, afterDiscount + shippingCharge)

    const orderNumber = generateOrderNumber()
    const order = await Order.create({
      orderNumber,
      userId: session?.user?.id,
      guestEmail: !session?.user ? parsed.data.shippingAddress.email : undefined,
      guestPhone: !session?.user ? parsed.data.shippingAddress.phone : undefined,
      items,
      shippingAddress: parsed.data.shippingAddress,
      subtotal,
      discount,
      couponCode: appliedCoupon?.code,
      shippingCharge,
      tax,
      total,
      notes: parsed.data.notes,
      statusHistory: [{ status: 'PENDING', timestamp: new Date(), note: 'Order placed' }],
    })

    return NextResponse.json({
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      total: order.total,
    })
  } catch (err) {
    return handleApiError(err)
  }
}

// Admin endpoint placeholder — protected list lives at /api/orders for admin
export async function PUT(req: NextRequest) {
  const { error } = await requireAdmin()
  if (error) return error
  return NextResponse.json({ ok: true })
}
