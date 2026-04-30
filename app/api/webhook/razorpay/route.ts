import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { verifyWebhookSignature } from '@/lib/razorpay'
import { finalizePaidOrder } from '@/lib/order-fulfillment'

interface RazorpayWebhookEvent {
  event: string
  payload: {
    payment?: {
      entity?: {
        order_id?: string
        id?: string
        status?: string
        error_description?: string
      }
    }
  }
}

export async function POST(req: NextRequest) {
  // Read body first — we need the raw bytes for signature verification.
  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''

  // Distinguish "we are misconfigured" from "this request is forged".
  // 503 prompts Razorpay to retry; 400 tells it not to bother.
  if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
    console.error('[webhook] RAZORPAY_WEBHOOK_SECRET not set — rejecting event')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }
  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: RazorpayWebhookEvent
  try {
    event = JSON.parse(rawBody) as RazorpayWebhookEvent
  } catch {
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 })
  }

  const rpOrderId = event.payload?.payment?.entity?.order_id
  if (!rpOrderId) {
    // Acknowledge events we don't care about so Razorpay stops retrying.
    return NextResponse.json({ ok: true })
  }

  try {
    await connectDB()
    if (event.event === 'payment.captured') {
      // Pre-update doc; if it shows the order was not yet PAID, *we* did the
      // transition and own the side-effect run (stock, coupon use, email).
      const before = await Order.findOneAndUpdate(
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
        { new: false },
      )
      if (before && before.paymentStatus !== 'PAID') {
        const after = await Order.findById(before._id)
        if (after) await finalizePaidOrder(after)
      }
    } else if (event.event === 'payment.failed') {
      await Order.findOneAndUpdate(
        { razorpayOrderId: rpOrderId, paymentStatus: { $ne: 'PAID' } },
        {
          paymentStatus: 'FAILED',
          $push: {
            statusHistory: {
              status: 'PENDING',
              timestamp: new Date(),
              note: `Webhook: payment failed${
                event.payload.payment?.entity?.error_description
                  ? ` — ${event.payload.payment.entity.error_description}`
                  : ''
              }`,
            },
          },
        },
      )
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    // Returning 5xx so Razorpay retries — transient DB errors should not lose events.
    console.error('[webhook] processing error for event', event.event, err)
    return NextResponse.json({ error: 'Processing error' }, { status: 500 })
  }
}
