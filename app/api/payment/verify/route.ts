import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { handleApiError } from '@/lib/api-helpers'
import { rateLimit } from '@/lib/rate-limit'
import { finalizePaidOrder } from '@/lib/order-fulfillment'

const schema = z.object({
  orderId: z.string(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const limited = await rateLimit(req, { limit: 20, windowMs: 60_000, key: 'payment-verify' })
    if (!limited.ok) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }
    await connectDB()
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const valid = verifyRazorpaySignature(
      parsed.data.razorpay_order_id,
      parsed.data.razorpay_payment_id,
      parsed.data.razorpay_signature,
    )
    if (!valid) {
      await Order.findByIdAndUpdate(parsed.data.orderId, {
        paymentStatus: 'FAILED',
        $push: {
          statusHistory: {
            status: 'PENDING',
            timestamp: new Date(),
            note: 'Signature verification failed',
          },
        },
      })
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const order = await Order.findById(parsed.data.orderId)
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ success: true, orderNumber: order.orderNumber })
    }

    order.paymentStatus = 'PAID'
    order.status = 'CONFIRMED'
    order.paymentMethod = 'razorpay'
    order.razorpayOrderId = parsed.data.razorpay_order_id
    order.razorpayPaymentId = parsed.data.razorpay_payment_id
    order.razorpaySignature = parsed.data.razorpay_signature
    order.statusHistory.push({
      status: 'CONFIRMED',
      timestamp: new Date(),
      note: 'Payment successful',
    })
    await order.save()

    await finalizePaidOrder(order)

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: String(order._id),
    })
  } catch (err) {
    return handleApiError(err)
  }
}
