'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, Download } from 'lucide-react'
import AdminHeader from '@/components/admin/AdminHeader'
import { formatPrice, formatDate } from '@/lib/utils'

interface Customer {
  _id: string
  name?: string
  email: string
  phone?: string
  createdAt: string
  ordersCount: number
  totalSpent: number
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => {
      setLoading(true)
      const params = new URLSearchParams({ limit: '100' })
      if (search) params.set('search', search)
      fetch(`/api/customers?${params.toString()}`)
        .then((r) => r.json())
        .then((d) => setCustomers(d.customers ?? []))
        .catch(() => setCustomers([]))
        .finally(() => setLoading(false))
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Orders', 'Total Spent', 'Joined']
    const rows = customers.map((c) => [
      c.name ?? '',
      c.email,
      c.phone ?? '',
      c.ordersCount,
      c.totalSpent,
      formatDate(c.createdAt),
    ])
    const csv = [headers, ...rows].map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `customers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <AdminHeader title="Customers" />
      <div className="p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="h-10 w-full rounded-lg border border-warmgray/30 bg-cream pl-10 pr-3 outline-none focus:border-forest"
            />
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
                <th className="py-3 pl-4 pr-2">Customer</th>
                <th className="py-3 pr-2">Email</th>
                <th className="py-3 pr-2">Orders</th>
                <th className="py-3 pr-2">Total Spent</th>
                <th className="py-3 pr-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-warmgray">Loading…</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-warmgray">No customers yet</td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="border-b border-forest/5">
                    <td className="py-3 pl-4 pr-2">
                      <Link href={`/admin/customers/${c._id}`} className="font-semibold text-charcoal hover:text-forest">
                        {c.name ?? '—'}
                      </Link>
                    </td>
                    <td className="py-3 pr-2 text-charcoal">{c.email}</td>
                    <td className="py-3 pr-2">{c.ordersCount}</td>
                    <td className="py-3 pr-2 font-semibold text-forest">{formatPrice(c.totalSpent)}</td>
                    <td className="py-3 pr-4 text-warmgray">{formatDate(c.createdAt)}</td>
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
