import { Resend } from 'resend'
import type { IOrder } from '@/models/Order'
import { formatPrice } from './utils'

let resend: Resend | null = null

const STORE_NAME = 'Thinnie Aurvadic'
const PRIMARY = '#2D5016'
const ACCENT = '#C8860A'
const BG = '#FDF8F0'

export function isEmailConfigured(): boolean {
  return !!process.env.RESEND_API_KEY
}

function getResend(): Resend | null {
  if (!isEmailConfigured()) return null
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY!)
  return resend
}

function getFrom(): string {
  // TODO: Verify the sending domain (thinnieaurvadic.com) in the Resend dashboard
  // before going to production. Until then, Resend will reject sends to addresses
  // outside the test allowlist. Fall back to onboarding@resend.dev for local dev.
  return (
    process.env.EMAIL_FROM ||
    `${STORE_NAME} <onboarding@resend.dev>`
  )
}

function shell(title: string, body: string): string {
  return `
    <div style="font-family:Lato,Arial,sans-serif;max-width:640px;margin:0 auto;background:${BG};padding:32px;color:#1C1C1C">
      <h1 style="font-family:Georgia,serif;color:${PRIMARY};margin:0 0 16px">${title}</h1>
      ${body}
      <hr style="border:0;border-top:1px solid #ddd;margin:32px 0"/>
      <p style="color:#8B7355;font-size:13px;margin:0">${STORE_NAME} — Authentic Ayurveda since the ancient days.</p>
    </div>`
}

async function send(to: string, subject: string, html: string): Promise<void> {
  const client = getResend()
  if (!client) {
    console.warn('[email] Resend not configured — skipping', subject)
    return
  }
  try {
    await client.emails.send({ from: getFrom(), to, subject, html })
  } catch (err) {
    console.error('[email] failed to send:', subject, err)
  }
}

function itemsTable(order: IOrder): string {
  const rows = order.items
    .map(
      (i) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee">${i.name}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;text-align:right">${formatPrice(i.price * i.quantity)}</td>
      </tr>`,
    )
    .join('')
  return `
    <table style="width:100%;border-collapse:collapse;margin-top:24px">
      <thead><tr style="background:#F5EDD8">
        <th style="padding:12px;text-align:left">Item</th>
        <th style="padding:12px;text-align:center">Qty</th>
        <th style="padding:12px;text-align:right">Total</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`
}

function orderTotals(order: IOrder): string {
  return `
    <p style="margin-top:24px;text-align:right">Subtotal: ${formatPrice(order.subtotal)}</p>
    ${order.discount > 0 ? `<p style="text-align:right">Discount: -${formatPrice(order.discount)}</p>` : ''}
    <p style="text-align:right">Shipping: ${order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}</p>
    <p style="text-align:right">Tax: ${formatPrice(order.tax)}</p>
    <p style="text-align:right;font-size:18px;font-weight:bold;color:${PRIMARY}">Total: ${formatPrice(order.total)}</p>`
}

export async function sendWelcomeEmail({ name, email }: { name: string; email: string }): Promise<void> {
  const html = shell(
    `Welcome to ${STORE_NAME}`,
    `<p>Hi ${name},</p>
     <p>Thank you for joining the ${STORE_NAME} family. Your wellness journey starts here.</p>
     <p>Use code <strong style="color:${ACCENT}">WELCOME15</strong> for 15% off your first order.</p>
     <p style="margin-top:24px">
       <a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/shop" style="display:inline-block;background:${PRIMARY};color:${BG};padding:12px 24px;border-radius:8px;text-decoration:none">Browse the shop</a>
     </p>`,
  )
  await send(email, `Welcome to ${STORE_NAME}`, html)
}

export async function sendOrderConfirmation(order: IOrder): Promise<void> {
  const html = shell(
    'Thank you for your order!',
    `<p>Hi ${order.shippingAddress.name},</p>
     <p>We've received your order <strong>${order.orderNumber}</strong>. We'll send another email when it ships.</p>
     ${itemsTable(order)}
     ${orderTotals(order)}`,
  )
  await send(order.shippingAddress.email, `Order Confirmed — ${order.orderNumber}`, html)
}

export async function sendShippingNotification(order: IOrder): Promise<void> {
  const tracking =
    order.notes?.match(/track(?:ing)?[:\s]+([\w-]+)/i)?.[1] ?? order.razorpayPaymentId ?? '—'
  const html = shell(
    'Your order is on its way!',
    `<p>Hi ${order.shippingAddress.name},</p>
     <p>Order <strong>${order.orderNumber}</strong> has just shipped. You can expect it within 3–5 business days.</p>
     <p style="background:#F5EDD8;padding:12px;border-radius:8px">
       <strong>Tracking reference:</strong> ${tracking}
     </p>
     <p>Shipping to:<br/>
       <strong>${order.shippingAddress.name}</strong><br/>
       ${order.shippingAddress.line1}, ${order.shippingAddress.city}<br/>
       ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
     </p>`,
  )
  await send(order.shippingAddress.email, `Shipped — ${order.orderNumber}`, html)
}

export async function sendDeliveryConfirmation(order: IOrder): Promise<void> {
  const html = shell(
    'Your order has been delivered',
    `<p>Hi ${order.shippingAddress.name},</p>
     <p>Order <strong>${order.orderNumber}</strong> has been delivered. We hope you love it.</p>
     <p>If anything is amiss, just reply to this email and we'll make it right.</p>
     <p style="margin-top:24px">
       <a href="${process.env.NEXT_PUBLIC_APP_URL || ''}/orders" style="display:inline-block;background:${PRIMARY};color:${BG};padding:12px 24px;border-radius:8px;text-decoration:none">Leave a review</a>
     </p>`,
  )
  await send(order.shippingAddress.email, `Delivered — ${order.orderNumber}`, html)
}

export async function sendPasswordReset({
  email,
  name,
  resetUrl,
}: {
  email: string
  name: string
  resetUrl: string
}): Promise<void> {
  const html = shell(
    'Reset your password',
    `<p>Hi ${name},</p>
     <p>We received a request to reset your ${STORE_NAME} password. Use the button below to choose a new one.</p>
     <p style="margin-top:24px">
       <a href="${resetUrl}" style="display:inline-block;background:${PRIMARY};color:${BG};padding:12px 24px;border-radius:8px;text-decoration:none">Reset password</a>
     </p>
     <p style="font-size:12px;color:#8B7355">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>`,
  )
  await send(email, `Reset your ${STORE_NAME} password`, html)
}
