import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { getRazorpay, isRazorpayConfigured } from '@/lib/razorpay'
import { handleApiError } from '@/lib/api-helpers'

const schema = z.object({ orderId: z.string() })

export async function POST(req: NextRequest) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' },
        { status: 503 },
      )
    }
    await connectDB()
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const order = await Order.findById(parsed.data.orderId)
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    if (order.paymentStatus === 'PAID') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 400 })
    }

    const rp = getRazorpay()
    const rpOrder = await rp.orders.create({
      amount: Math.round(order.total * 100),
      currency: 'INR',
      receipt: order.orderNumber,
      notes: { orderNumber: order.orderNumber, mongoId: String(order._id) },
    })

    order.razorpayOrderId = rpOrder.id
    await order.save()

    return NextResponse.json({
      razorpayOrderId: rpOrder.id,
      amount: rpOrder.amount,
      currency: rpOrder.currency,
      orderNumber: order.orderNumber,
      keyId: process.env.RAZORPAY_KEY_ID,
      customer: {
        name: order.shippingAddress.name,
        email: order.shippingAddress.email,
        contact: order.shippingAddress.phone,
      },
    })
  } catch (err) {
    return handleApiError(err)
  }
}
