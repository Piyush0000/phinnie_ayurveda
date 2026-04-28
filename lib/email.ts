import { Resend } from 'resend'
import type { IOrder } from '@/models/Order'
import { formatPrice } from './utils'

let resend: Resend | null = null

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

function getResend(): Resend | null {
  if (!isEmailConfigured()) return null
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY!)
  return resend
}

export async function sendOrderConfirmation(order: IOrder): Promise<void> {
  const client = getResend()
  if (!client) {
    console.warn('[email] Resend not configured — skipping order confirmation')
    return
  }
  const itemsHtml = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee">${i.name}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.price * i.quantity)}</td>
      </tr>`,
    )
    .join('')
  const html = `
    <div style="font-family:Lato,sans-serif;max-width:640px;margin:0 auto;background:#FDF8F0;padding:32px">
      <h1 style="font-family:'Playfair Display',serif;color:#2D5016">Thank you for your order!</h1>
      <p>Hi ${order.shippingAddress.name},</p>
      <p>We've received your order <strong>${order.orderNumber}</strong>. We'll send another email when it ships.</p>
      <table style="width:100%;border-collapse:collapse;margin-top:24px">
        <thead><tr style="background:#F5EDD8">
          <th style="padding:12px;text-align:left">Item</th>
          <th style="padding:12px;text-align:center">Qty</th>
          <th style="padding:12px;text-align:right">Total</th>
        </tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p style="margin-top:24px;text-align:right">Subtotal: ${formatPrice(order.subtotal)}</p>
      ${order.discount > 0 ? `<p style="text-align:right">Discount: -${formatPrice(order.discount)}</p>` : ''}
      <p style="text-align:right">Shipping: ${order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}</p>
      <p style="text-align:right">Tax: ${formatPrice(order.tax)}</p>
      <p style="text-align:right;font-size:18px;font-weight:bold;color:#2D5016">Total: ${formatPrice(order.total)}</p>
      <hr style="border:0;border-top:1px solid #ddd;margin:32px 0"/>
      <p style="color:#8B7355;font-size:13px">Phinnie Aurvadic — Authentic Ayurveda since the ancient days.</p>
    </div>`
  try {
    await client.emails.send({
      from: process.env.EMAIL_FROM || 'Phinnie Aurvadic <orders@phinnieaurvadic.com>',
      to: order.shippingAddress.email,
      subject: `Order Confirmed — ${order.orderNumber}`,
      html,
    })
  } catch (err) {
    console.error('[email] failed to send order confirmation:', err)
  }
}
