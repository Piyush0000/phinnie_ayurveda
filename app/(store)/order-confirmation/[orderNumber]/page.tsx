import { notFound } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, MapPin, ArrowRight } from 'lucide-react'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Order from '@/models/Order'
import { formatPrice, formatDateTime } from '@/lib/utils'

export const dynamic = 'force-dynamic'

async function getOrder(orderNumber: string) {
  if (!isDatabaseConfigured()) return null
  await connectDB()
  const order = await Order.findOne({ orderNumber }).lean()
  return order ? (JSON.parse(JSON.stringify(order)) as any) : null
}

export default async function OrderConfirmationPage({
  params,
}: {
  params: { orderNumber: string }
}) {
  const order = await getOrder(params.orderNumber)
  if (!order) notFound()

  return (
    <div className="container-narrow py-12 md:py-16">
      <div className="mx-auto max-w-2xl rounded-3xl border border-forest/10 bg-cream p-8 shadow-warm-lg md:p-12">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-forest/10 text-forest">
            <CheckCircle2 size={40} />
          </div>
          <h1 className="mt-6 font-display text-4xl text-forest">Thank you!</h1>
          <p className="mt-2 font-accent text-xl text-warmgray">
            Your order has been placed successfully.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-parchment px-4 py-1.5 text-sm">
            Order ID: <strong className="text-forest">{order.orderNumber}</strong>
          </div>
          <p className="mt-2 text-xs text-warmgray">{formatDateTime(order.createdAt)}</p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-forest/10 bg-parchment/40 p-5">
            <h3 className="flex items-center gap-2 font-display text-lg text-forest">
              <MapPin size={16} /> Shipping Address
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-charcoal">
              <strong>{order.shippingAddress.name}</strong><br />
              {order.shippingAddress.line1}<br />
              {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              <span className="text-warmgray">{order.shippingAddress.phone}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-forest/10 bg-parchment/40 p-5">
            <h3 className="flex items-center gap-2 font-display text-lg text-forest">
              <Package size={16} /> Status
            </h3>
            <p className="mt-3 text-sm text-charcoal">
              <strong className="capitalize">{order.status.toLowerCase()}</strong>
              <br />
              Payment:{' '}
              <span
                className={
                  order.paymentStatus === 'PAID' ? 'text-forest' : 'text-terracotta'
                }
              >
                {order.paymentStatus}
              </span>
            </p>
            <p className="mt-3 text-xs text-warmgray">
              We'll email you tracking info as soon as your order ships.
            </p>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="font-display text-xl text-forest">Items Ordered</h3>
          <ul className="mt-3 divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-parchment/40">
            {order.items.map((item: any, i: number) => (
              <li key={i} className="flex justify-between p-4 text-sm">
                <span className="text-charcoal">
                  {item.name} <span className="text-warmgray">× {item.quantity}</span>
                </span>
                <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-1.5 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
            {order.discount > 0 && <div className="flex justify-between text-terracotta"><dt>Discount</dt><dd>-{formatPrice(order.discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{order.shippingCharge === 0 ? 'Free' : formatPrice(order.shippingCharge)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{formatPrice(order.tax)}</dd></div>
            <div className="mt-3 flex justify-between border-t border-forest/10 pt-3 text-lg font-bold text-forest">
              <dt>Total Paid</dt><dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/orders" className="flex h-12 flex-1 items-center justify-center rounded-lg border-2 border-forest font-semibold text-forest hover:bg-forest hover:text-cream">
            View All Orders
          </Link>
          <Link href="/shop" className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-forest font-semibold text-cream shadow-warm hover:bg-forest-600">
            Continue Shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
