'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Download, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { OrderStatus, PaymentStatus } from '@/models/Order'

interface AdminOrderRow {
  _id: string
  orderNumber: string
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  shippingAddress?: { name?: string; email?: string }
  items: { quantity: number }[]
}

const STATUSES = ['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([])
  const [status, setStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100' })
    if (status !== 'ALL') params.set('status', status)
    fetch(`/api/orders?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status])

  const handleDelete = async (id: string, orderNumber: string) => {
    if (!confirm(`Delete order ${orderNumber}? This cannot be undone.`)) return
    const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Order deleted')
    load()
  }

  const exportCSV = () => {
    const headers = ['Order', 'Customer', 'Email', 'Items', 'Total', 'Status', 'Payment', 'Date']
    const rows = orders.map((o) => [
      o.orderNumber,
      o.shippingAddress?.name ?? '',
      o.shippingAddress?.email ?? '',
      o.items.length,
      o.total,
      o.status,
      o.paymentStatus,
      formatDate(o.createdAt),
    ])
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <AdminHeader title="Orders" />
      <div className="p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
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
          <button
            onClick={exportCSV}
            className="inline-flex h-10 items-center gap-2 rounded-lg border-2 border-forest px-5 font-semibold text-forest hover:bg-forest hover:text-cream"
          >
            <Download size={14} /> Export CSV
          </button>
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
                <th className="py-3 pr-2">Date</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="py-12 text-center text-warmgray">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="py-12 text-center text-warmgray">No orders</td></tr>
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
                    <td className="py-3 pr-2 text-warmgray">{formatDate(o.createdAt)}</td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleDelete(o._id, o.orderNumber)}
                          className="rounded-lg border border-warmgray/30 p-2 text-terracotta hover:bg-terracotta-50"
                          title="Delete order"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
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
