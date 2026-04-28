import { notFound } from 'next/navigation'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Order from '@/models/Order'
import AdminHeader from '@/components/admin/AdminHeader'
import OrderStatusUpdater from './OrderStatusUpdater'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge'
import { formatPrice, formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  if (!isDatabaseConfigured()) return notFound()
  await connectDB()
  const order = await Order.findById(params.id).lean()
  if (!order) return notFound()
  const o = JSON.parse(JSON.stringify(order)) as any

  return (
    <>
      <AdminHeader title={`Order ${o.orderNumber}`} />
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <OrderStatusBadge status={o.status} />
          <PaymentStatusBadge status={o.paymentStatus} />
          <span className="text-sm text-warmgray">{formatDateTime(o.createdAt)}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm lg:col-span-2">
            <h2 className="font-display text-xl text-forest">Items</h2>
            <ul className="mt-4 divide-y divide-forest/10">
              {o.items.map((item: any, i: number) => (
                <li key={i} className="flex justify-between py-3">
                  <div>
                    <div className="font-semibold text-charcoal">{item.name}</div>
                    <div className="text-xs text-warmgray">Qty {item.quantity} × {formatPrice(item.price)}</div>
                  </div>
                  <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-1.5 border-t border-forest/10 pt-4 text-sm">
              <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(o.subtotal)}</dd></div>
              {o.discount > 0 && (
                <div className="flex justify-between text-terracotta">
                  <dt>Discount {o.couponCode && `(${o.couponCode})`}</dt><dd>-{formatPrice(o.discount)}</dd>
                </div>
              )}
              <div className="flex justify-between"><dt>Shipping</dt><dd>{o.shippingCharge === 0 ? 'Free' : formatPrice(o.shippingCharge)}</dd></div>
              <div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(o.tax)}</dd></div>
              <div className="mt-3 flex justify-between border-t border-forest/10 pt-3 text-lg font-bold text-forest">
                <dt>Total</dt><dd>{formatPrice(o.total)}</dd>
              </div>
            </dl>
            {o.notes && (
              <div className="mt-5 rounded-lg bg-parchment/60 p-3 text-sm">
                <strong>Customer note:</strong> {o.notes}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <OrderStatusUpdater orderId={params.id} currentStatus={o.status} />

            <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm">
              <h3 className="font-display text-lg text-forest">Shipping Address</h3>
              <p className="mt-3 text-sm leading-relaxed">
                <strong>{o.shippingAddress.name}</strong><br />
                {o.shippingAddress.line1}<br />
                {o.shippingAddress.line2 && <>{o.shippingAddress.line2}<br /></>}
                {o.shippingAddress.city}, {o.shippingAddress.state} - {o.shippingAddress.pincode}<br />
                <span className="text-warmgray">{o.shippingAddress.phone}</span><br />
                <span className="text-warmgray">{o.shippingAddress.email}</span>
              </p>
            </div>

            <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm">
              <h3 className="font-display text-lg text-forest">Payment</h3>
              <dl className="mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><dt className="text-warmgray">Method</dt><dd>{o.paymentMethod ?? '—'}</dd></div>
                {o.razorpayPaymentId && (
                  <div className="flex justify-between"><dt className="text-warmgray">Payment ID</dt><dd className="font-mono text-xs">{o.razorpayPaymentId}</dd></div>
                )}
                {o.razorpayOrderId && (
                  <div className="flex justify-between"><dt className="text-warmgray">RP Order ID</dt><dd className="font-mono text-xs">{o.razorpayOrderId}</dd></div>
                )}
              </dl>
            </div>

            <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm">
              <h3 className="font-display text-lg text-forest">Timeline</h3>
              <ul className="mt-3 space-y-3">
                {[...(o.statusHistory ?? [])].reverse().map((h: any, i: number) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-forest" />
                    <div>
                      <div className="font-semibold">{h.status}</div>
                      <div className="text-xs text-warmgray">{formatDateTime(h.timestamp)}</div>
                      {h.note && <div className="text-xs text-charcoal/70">{h.note}</div>}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
