import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyWebhookSignature } from '@/lib/razorpay'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-razorpay-signature') ?? ''
    if (!verifyWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }
    const event = JSON.parse(rawBody) as {
      event: string
      payload: { payment?: { entity?: { order_id?: string; id?: string; status?: string } } }
    }
    await connectDB()
    const rpOrderId = event.payload?.payment?.entity?.order_id
    if (!rpOrderId) return NextResponse.json({ ok: true })

    if (event.event === 'payment.captured') {
      await Order.findOneAndUpdate(
        { razorpayOrderId: rpOrderId, paymentStatus: { $ne: 'PAID' } },
        {
          paymentStatus: 'PAID',
          status: 'CONFIRMED',
          razorpayPaymentId: event.payload.payment?.entity?.id,
          $push: {
            statusHistory: {
              status: 'CONFIRMED',
              timestamp: new Date(),
              note: 'Webhook: payment captured',
            },
          },
        },
      )
    } else if (event.event === 'payment.failed') {
      await Order.findOneAndUpdate(
        { razorpayOrderId: rpOrderId },
        {
          paymentStatus: 'FAILED',
          $push: {
            statusHistory: {
              status: 'PENDING',
              timestamp: new Date(),
              note: 'Webhook: payment failed',
            },
          },
        },
      )
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[webhook]', err)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
