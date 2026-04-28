import { redirect } from 'next/navigation'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Order from '@/models/Order'
import { formatPrice, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

const statusVariant: Record<string, 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PROCESSING: 'info',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'danger',
  REFUNDED: 'neutral',
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect('/login?from=/orders')
  if (!isDatabaseConfigured()) {
    return <div className="container-wide py-12 text-warmgray">Database not configured.</div>
  }
  await connectDB()
  const orders = await Order.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean()
  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="font-display text-4xl text-charcoal md:text-5xl">My Orders</h1>
      {orders.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-warmgray/30 bg-parchment/50 p-12 text-center">
          <p className="font-display text-xl">No orders yet</p>
          <Link href="/shop" className="mt-4 inline-block rounded-lg bg-forest px-6 py-2 font-semibold text-cream">
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((o) => (
            <li key={String(o._id)} className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link
                    href={`/order-confirmation/${o.orderNumber}`}
                    className="font-display text-xl text-forest hover:underline"
                  >
                    Order {o.orderNumber}
                  </Link>
                  <p className="text-xs text-warmgray">{formatDate(o.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant[o.status]}>{o.status}</Badge>
                  <Badge variant={o.paymentStatus === 'PAID' ? 'success' : 'warning'}>
                    {o.paymentStatus}
                  </Badge>
                </div>
              </div>
              <p className="mt-3 line-clamp-1 text-sm text-charcoal">
                {o.items.map((i) => `${i.name} × ${i.quantity}`).join(', ')}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-warmgray">{o.items.length} items</span>
                <span className="font-bold text-forest">{formatPrice(o.total)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
