'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, ShoppingBag, Users, Package, AlertTriangle } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import StatsCard from '@/components/admin/StatsCard'
import RevenueChart from '@/components/admin/RevenueChart'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/admin/OrderStatusBadge'
import { formatPrice, formatDate } from '@/lib/utils'

interface Stats {
  revenue: { thisMonth: number; lastMonth: number; changePct: number; lifetime: number }
  orders: {
    thisMonth: number
    lastMonth: number
    changePct: number
    total: number
    byStatus: Record<string, number>
  }
  customers: { newThisMonth: number; total: number }
  products: { total: number; lowStock: { _id: string; name: string; stock: number; slug: string }[] }
  recentOrders: any[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(async (r) => {
        if (!r.ok) {
          const d = await r.json()
          throw new Error(d.error || `Error ${r.status}`)
        }
        return r.json()
      })
      .then(setStats)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load stats'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <AdminHeader title="Dashboard" />
      <div className="p-6 lg:p-8">
        {error && (
          <div className="mb-6 rounded-2xl border-2 border-dashed border-turmeric bg-turmeric-50 p-5 text-sm">
            <strong className="text-turmeric-800">Heads up:</strong> {error}
            <p className="mt-1 text-warmgray">
              Add MONGODB_URI to .env.local and run <code>npm run seed</code> to populate sample data.
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-parchment" />
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Revenue (this month)"
                value={formatPrice(stats.revenue.thisMonth)}
                changePct={stats.revenue.changePct}
                icon={TrendingUp}
                iconColor="text-forest"
              />
              <StatsCard
                title="Orders (this month)"
                value={String(stats.orders.thisMonth)}
                changePct={stats.orders.changePct}
                icon={ShoppingBag}
                iconColor="text-turmeric"
              />
              <StatsCard
                title="New Customers"
                value={String(stats.customers.newThisMonth)}
                icon={Users}
                iconColor="text-terracotta"
              />
              <StatsCard
                title="Active Products"
                value={String(stats.products.total)}
                icon={Package}
                iconColor="text-forest"
              />
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl text-forest">Revenue (last 30 days)</h2>
                </div>
                <div className="mt-4">
                  <RevenueChart type="line" period="30days" metric="revenue" />
                </div>
              </div>
              <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm">
                <h2 className="font-display text-xl text-forest">Orders (last 7 days)</h2>
                <div className="mt-4">
                  <RevenueChart type="bar" period="7days" metric="orders" height={250} />
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm lg:col-span-2">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl text-forest">Recent Orders</h2>
                  <Link href="/admin/orders" className="text-sm font-semibold text-forest hover:underline">
                    View all
                  </Link>
                </div>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-forest/10 text-left text-xs uppercase text-warmgray">
                      <tr>
                        <th className="py-2 pr-3">Order</th>
                        <th className="py-2 pr-3">Customer</th>
                        <th className="py-2 pr-3">Total</th>
                        <th className="py-2 pr-3">Status</th>
                        <th className="py-2 pr-3">Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentOrders.length === 0 ? (
                        <tr><td colSpan={5} className="py-6 text-center text-warmgray">No orders yet</td></tr>
                      ) : (
                        stats.recentOrders.map((o) => (
                          <tr key={o._id} className="border-b border-forest/5">
                            <td className="py-3 pr-3">
                              <Link href={`/admin/orders/${o._id}`} className="font-semibold text-forest hover:underline">
                                {o.orderNumber}
                              </Link>
                              <div className="text-xs text-warmgray">{formatDate(o.createdAt)}</div>
                            </td>
                            <td className="py-3 pr-3">
                              <div>{o.shippingAddress?.name}</div>
                              <div className="text-xs text-warmgray">{o.shippingAddress?.email}</div>
                            </td>
                            <td className="py-3 pr-3 font-semibold">{formatPrice(o.total)}</td>
                            <td className="py-3 pr-3"><OrderStatusBadge status={o.status} /></td>
                            <td className="py-3 pr-3"><PaymentStatusBadge status={o.paymentStatus} /></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm">
                <h2 className="flex items-center gap-2 font-display text-xl text-terracotta">
                  <AlertTriangle size={18} /> Low Stock
                </h2>
                {stats.products.lowStock.length === 0 ? (
                  <p className="mt-3 text-sm text-warmgray">All products well stocked.</p>
                ) : (
                  <ul className="mt-3 space-y-2">
                    {stats.products.lowStock.map((p) => (
                      <li key={p._id} className="flex items-center justify-between rounded-lg bg-terracotta-50 px-3 py-2 text-sm">
                        <Link href={`/admin/products/${p._id}/edit`} className="line-clamp-1 hover:text-terracotta">
                          {p.name}
                        </Link>
                        <span className="font-bold text-terracotta">{p.stock}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  )
}
