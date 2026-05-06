'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Save, X, Download } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { formatDate, formatPrice } from '@/lib/utils'

interface Coupon {
  _id: string
  code: string
  type: 'PERCENT' | 'FIXED'
  value: number
  minOrder?: number
  maxUses?: number
  usedCount: number
  isActive: boolean
  expiresAt?: string
  createdAt: string
}

interface FormState {
  code: string
  type: 'PERCENT' | 'FIXED'
  value: number
  minOrder: number | ''
  maxUses: number | ''
  isActive: boolean
  expiresAt: string
}

const EMPTY: FormState = {
  code: '',
  type: 'PERCENT',
  value: 10,
  minOrder: '',
  maxUses: '',
  isActive: true,
  expiresAt: '',
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/coupons')
    const data = await res.json()
    setCoupons(data.coupons ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const startNew = () => {
    setEditingId('new')
    setForm(EMPTY)
  }

  const startEdit = (c: Coupon) => {
    setEditingId(c._id)
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      minOrder: c.minOrder ?? '',
      maxUses: c.maxUses ?? '',
      isActive: c.isActive,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toISOString().slice(0, 16) : '',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      code: form.code.trim(),
      type: form.type,
      value: Number(form.value),
      minOrder: form.minOrder === '' ? undefined : Number(form.minOrder),
      maxUses: form.maxUses === '' ? undefined : Number(form.maxUses),
      isActive: form.isActive,
      expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : '',
    }
    const url = editingId === 'new' ? '/api/coupons' : `/api/coupons/${editingId}`
    const method = editingId === 'new' ? 'POST' : 'PATCH'
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error || 'Could not save')
      return
    }
    toast.success(editingId === 'new' ? 'Coupon created' : 'Coupon updated')
    setEditingId(null)
    void load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return
    const res = await fetch(`/api/coupons/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Coupon deleted')
    void load()
  }

  const exportCSV = () => {
    const headers = ['Code', 'Type', 'Value', 'Min Order', 'Max Uses', 'Used', 'Active', 'Expires', 'Created']
    const rows = coupons.map((c) => [
      c.code,
      c.type,
      c.value,
      c.minOrder ?? '',
      c.maxUses ?? '',
      c.usedCount,
      c.isActive ? 'Yes' : 'No',
      c.expiresAt ? formatDate(c.expiresAt) : '',
      formatDate(c.createdAt),
    ])
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `coupons-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <AdminHeader title="Coupons" />
      <div className="p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-warmgray">Promotional discount codes for the storefront.</p>
          <div className="flex items-center gap-2">
            <button
              onClick={exportCSV}
              className="inline-flex h-10 items-center gap-2 rounded-lg border-2 border-forest px-5 font-semibold text-forest hover:bg-forest hover:text-cream"
            >
              <Download size={14} /> Export CSV
            </button>
            <Button onClick={startNew}>
              <Plus size={14} /> New Coupon
            </Button>
          </div>
        </div>

        {editingId && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid gap-4 rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm md:grid-cols-2 lg:grid-cols-3"
          >
            <Input
              label="Code"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              placeholder="WELCOME15"
              required
            />
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'PERCENT' | 'FIXED' })}
                className="w-full rounded-lg border border-warmgray/30 bg-white px-4 py-2.5 outline-none focus:border-forest"
              >
                <option value="PERCENT">Percentage off</option>
                <option value="FIXED">Fixed amount off</option>
              </select>
            </div>
            <Input
              label={form.type === 'PERCENT' ? 'Value (%)' : 'Value (₹)'}
              type="number"
              min="1"
              value={form.value}
              onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
              required
            />
            <Input
              label="Min Order (₹)"
              type="number"
              min="0"
              value={form.minOrder}
              onChange={(e) => setForm({ ...form, minOrder: e.target.value === '' ? '' : Number(e.target.value) })}
            />
            <Input
              label="Max Uses"
              type="number"
              min="1"
              value={form.maxUses}
              onChange={(e) => setForm({ ...form, maxUses: e.target.value === '' ? '' : Number(e.target.value) })}
            />
            <Input
              label="Expires At"
              type="datetime-local"
              value={form.expiresAt}
              onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
            />
            <label className="flex items-center gap-2 self-end pb-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="font-semibold">Active</span>
            </label>
            <div className="flex items-end gap-2 lg:col-span-3">
              <Button type="submit">
                <Save size={14} /> {editingId === 'new' ? 'Create' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-cream shadow-warm">
          <table className="w-full text-sm">
            <thead className="border-b border-forest/10 bg-parchment/40 text-left text-xs uppercase text-warmgray">
              <tr>
                <th className="py-3 pl-4 pr-2">Code</th>
                <th className="py-3 pr-2">Discount</th>
                <th className="py-3 pr-2">Min Order</th>
                <th className="py-3 pr-2">Used / Max</th>
                <th className="py-3 pr-2">Expires</th>
                <th className="py-3 pr-2">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-warmgray">Loading…</td></tr>
              ) : coupons.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-warmgray">No coupons yet</td></tr>
              ) : (
                coupons.map((c) => {
                  const expired = c.expiresAt && new Date(c.expiresAt) < new Date()
                  return (
                    <tr key={c._id} className="border-b border-forest/5">
                      <td className="py-3 pl-4 pr-2 font-mono font-semibold text-forest">{c.code}</td>
                      <td className="py-3 pr-2">
                        {c.type === 'PERCENT' ? `${c.value}% off` : `${formatPrice(c.value)} off`}
                      </td>
                      <td className="py-3 pr-2">{c.minOrder ? formatPrice(c.minOrder) : '—'}</td>
                      <td className="py-3 pr-2">{c.usedCount} / {c.maxUses ?? '∞'}</td>
                      <td className="py-3 pr-2 text-warmgray">
                        {c.expiresAt ? formatDate(c.expiresAt) : 'Never'}
                      </td>
                      <td className="py-3 pr-2">
                        {expired ? (
                          <Badge variant="neutral">Expired</Badge>
                        ) : c.isActive ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="neutral">Disabled</Badge>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(c)}
                            className="rounded-lg border border-warmgray/30 p-2 hover:bg-parchment"
                            aria-label="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id)}
                            className="rounded-lg border border-warmgray/30 p-2 text-terracotta hover:bg-terracotta-50"
                            aria-label="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
