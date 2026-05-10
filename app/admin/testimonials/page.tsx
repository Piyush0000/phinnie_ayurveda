'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit, Save, Star, Check, Ban, Clock, Quote } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn, formatDate } from '@/lib/utils'

type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Testimonial {
  _id: string
  name: string
  rating: number
  comment: string
  avatar?: string
  location?: string
  isActive: boolean
  approvalStatus: ApprovalStatus
  source: 'ADMIN' | 'CUSTOMER'
  createdAt: string
}

interface FormState {
  name: string
  rating: number
  comment: string
  avatar: string
  location: string
  isActive: boolean
  approvalStatus: ApprovalStatus
}

const EMPTY: FormState = {
  name: '',
  rating: 5,
  comment: '',
  avatar: '',
  location: '',
  isActive: true,
  approvalStatus: 'APPROVED',
}

const STATUS_FILTERS: { label: string; value: 'ALL' | ApprovalStatus }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
]

function StatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === 'APPROVED') return <Badge variant="success">Approved</Badge>
  if (status === 'REJECTED') return <Badge variant="danger">Rejected</Badge>
  return <Badge variant="warning">Pending</Badge>
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApprovalStatus>('ALL')

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/admin/testimonials')
    const data = await res.json()
    setItems(data.testimonials ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void load()
  }, [])

  const startNew = () => {
    setEditingId('new')
    setForm(EMPTY)
  }

  const startEdit = (t: Testimonial) => {
    setEditingId(t._id)
    setForm({
      name: t.name,
      rating: t.rating,
      comment: t.comment,
      avatar: t.avatar ?? '',
      location: t.location ?? '',
      isActive: t.isActive,
      approvalStatus: t.approvalStatus,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name: form.name.trim(),
      rating: Number(form.rating),
      comment: form.comment.trim(),
      avatar: form.avatar.trim(),
      location: form.location.trim(),
      isActive: form.isActive,
      approvalStatus: form.approvalStatus,
    }
    const url = editingId === 'new' ? '/api/admin/testimonials' : `/api/admin/testimonials/${editingId}`
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
    toast.success(editingId === 'new' ? 'Testimonial created' : 'Testimonial updated')
    setEditingId(null)
    void load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Testimonial deleted')
    void load()
  }

  const moderate = async (id: string, approvalStatus: ApprovalStatus) => {
    const res = await fetch(`/api/admin/testimonials/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approvalStatus }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not update')
      return
    }
    toast.success(`Marked ${approvalStatus.toLowerCase()}`)
    void load()
  }

  const visible = statusFilter === 'ALL' ? items : items.filter((t) => t.approvalStatus === statusFilter)
  const pendingCount = items.filter((t) => t.approvalStatus === 'PENDING').length

  return (
    <>
      <AdminHeader title="Testimonials" />
      <div className="p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-warmgray">
            Manage customer testimonials shown on the storefront.
            {pendingCount > 0 && (
              <span className="ml-2 font-semibold text-turmeric-700">
                {pendingCount} pending review
              </span>
            )}
          </p>
          <Button onClick={startNew}>
            <Plus size={14} /> New Testimonial
          </Button>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={cn(
                'rounded-full border px-4 py-1.5 text-xs font-semibold transition',
                statusFilter === f.value
                  ? 'border-forest bg-forest text-cream'
                  : 'border-warmgray/30 bg-cream text-charcoal hover:bg-parchment',
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {editingId && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 grid gap-4 rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm md:grid-cols-2"
          >
            <Input
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Priya Sharma"
              required
            />
            <Input
              label="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Mumbai"
            />
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm({ ...form, rating: n })}
                    aria-label={`${n} star${n === 1 ? '' : 's'}`}
                  >
                    <Star
                      size={22}
                      className={cn(
                        n <= form.rating ? 'fill-turmeric text-turmeric' : 'text-warmgray/30',
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Avatar URL (optional)"
              type="url"
              value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })}
              placeholder="https://…"
            />
            <Textarea
              label="Comment"
              rows={4}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="What did the customer love?"
              required
              className="md:col-span-2"
            />
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Status</label>
              <select
                value={form.approvalStatus}
                onChange={(e) =>
                  setForm({ ...form, approvalStatus: e.target.value as ApprovalStatus })
                }
                className="w-full rounded-lg border border-warmgray/30 bg-white px-4 py-2.5 outline-none focus:border-forest"
              >
                <option value="APPROVED">Approved (visible)</option>
                <option value="PENDING">Pending review</option>
                <option value="REJECTED">Rejected (hidden)</option>
              </select>
            </div>
            <label className="flex items-center gap-2 self-end pb-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="font-semibold">Active</span>
            </label>
            <div className="flex items-end gap-2 md:col-span-2">
              <Button type="submit">
                <Save size={14} /> {editingId === 'new' ? 'Create' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-warmgray">Loading…</p>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-warmgray/30 bg-parchment/50 p-12 text-center">
            <Quote size={32} className="mx-auto text-warmgray/50" />
            <p className="mt-3 text-warmgray">No testimonials match these filters</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((t) => (
              <li
                key={t._id}
                className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm md:flex-row md:items-start"
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-charcoal">{t.name}</strong>
                    <StatusBadge status={t.approvalStatus} />
                    {!t.isActive && <Badge variant="neutral">Inactive</Badge>}
                    {t.source === 'CUSTOMER' && <Badge variant="info">Customer submission</Badge>}
                    <span className="text-xs text-warmgray">{formatDate(t.createdAt)}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        size={14}
                        className={cn(
                          n <= t.rating ? 'fill-turmeric text-turmeric' : 'text-warmgray/30',
                        )}
                      />
                    ))}
                    {t.location && <span className="ml-2 text-xs text-warmgray">· {t.location}</span>}
                  </div>
                  <p className="mt-2 text-sm text-charcoal/80">{t.comment}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => moderate(t._id, 'APPROVED')}
                    disabled={t.approvalStatus === 'APPROVED'}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-forest/30 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-forest"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={() => moderate(t._id, 'REJECTED')}
                    disabled={t.approvalStatus === 'REJECTED'}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-terracotta/40 px-3 py-1.5 text-xs font-semibold text-terracotta hover:bg-terracotta-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <Ban size={14} /> Reject
                  </button>
                  <button
                    onClick={() => moderate(t._id, 'PENDING')}
                    disabled={t.approvalStatus === 'PENDING'}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-warmgray/30 px-3 py-1.5 text-xs font-semibold hover:bg-parchment disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                  >
                    <Clock size={14} /> Pending
                  </button>
                  <button
                    onClick={() => startEdit(t)}
                    className="rounded-lg border border-warmgray/30 p-2 hover:bg-parchment"
                    aria-label="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="rounded-lg border border-warmgray/30 p-2 text-terracotta hover:bg-terracotta-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
