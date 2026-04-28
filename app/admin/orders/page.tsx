'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [status, setStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (status !== 'ALL') params.set('status', status)
    fetch(`/api/orders?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [status])

  return (
    <>
      <AdminHeader title="Orders" />
      <div className="p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-semibold transition',
                status === s
                  ? 'border-forest bg-forest text-cream'
                  : 'border-warmgray/30 bg-cream text-charcoal hover:bg-parchment',
              )}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-cream shadow-warm">
          <table className="w-full text-sm">
            <thead className="border-b border-forest/10 bg-parchment/40 text-left text-xs uppercase text-warmgray">
              <tr>
                <th className="py-3 pl-4 pr-2">Order</th>
                <th className="py-3 pr-2">Customer</th>
                <th className="py-3 pr-2">Items</th>
                <th className="py-3 pr-2">Total</th>
                <th className="py-3 pr-2">Status</th>
                <th className="py-3 pr-2">Payment</th>
                <th className="py-3 pr-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-warmgray">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-warmgray">No orders</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b border-forest/5">
                    <td className="py-3 pl-4 pr-2">
                      <Link href={`/admin/orders/${o._id}`} className="font-semibold text-forest hover:underline">
                        {o.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="font-semibold text-charcoal">{o.shippingAddress?.name}</div>
                      <div className="text-xs text-warmgray">{o.shippingAddress?.email}</div>
                    </td>
                    <td className="py-3 pr-2 text-warmgray">{o.items.length}</td>
                    <td className="py-3 pr-2 font-semibold">{formatPrice(o.total)}</td>
                    <td className="py-3 pr-2"><OrderStatusBadge status={o.status} /></td>
                    <td className="py-3 pr-2"><PaymentStatusBadge status={o.paymentStatus} /></td>
                    <td className="py-3 pr-4 text-warmgray">{formatDate(o.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
