'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Plus,
  Trash2,
  Edit,
  Save,
  Star,
  Check,
  Ban,
  Clock,
  Quote,
  Upload,
  X,
} from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import Modal from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn, formatDate } from '@/lib/utils'

type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

interface Review {
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

export default function AdminReviewsPage() {
  const [items, setItems] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [statusFilter, setStatusFilter] = useState<'ALL' | ApprovalStatus>('ALL')
  const fileRef = useRef<HTMLInputElement | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/testimonials')
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not load reviews')
        setItems([])
        return
      }
      setItems(data.testimonials ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (r: Review) => {
    setEditingId(r._id)
    setForm({
      name: r.name,
      rating: r.rating,
      comment: r.comment,
      avatar: r.avatar ?? '',
      location: r.location ?? '',
      isActive: r.isActive,
      approvalStatus: r.approvalStatus,
    })
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving || uploading) return
    setModalOpen(false)
    setEditingId(null)
    setForm(EMPTY)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file')
      return
    }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Upload failed')
        return
      }
      setForm((f) => ({ ...f, avatar: data.url }))
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return
    const name = form.name.trim()
    const comment = form.comment.trim()
    if (name.length < 2) {
      toast.error('Customer name is required')
      return
    }
    if (comment.length < 5) {
      toast.error('Please add a review description')
      return
    }
    setSaving(true)
    try {
      const payload = {
        name,
        rating: Number(form.rating),
        comment,
        avatar: form.avatar.trim(),
        location: form.location.trim(),
        isActive: form.isActive,
        approvalStatus: form.approvalStatus,
      }
      const url = editingId ? `/api/admin/testimonials/${editingId}` : '/api/admin/testimonials'
      const method = editingId ? 'PATCH' : 'POST'
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
      toast.success(editingId ? 'Review updated' : 'Review added')
      setModalOpen(false)
      setEditingId(null)
      setForm(EMPTY)
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return
    const res = await fetch(`/api/admin/testimonials/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Review deleted')
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
      <AdminHeader title="Reviews" />
      <div className="p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-warmgray">
            Manage customer reviews shown on the storefront.
            {pendingCount > 0 && (
              <span className="ml-2 font-semibold text-turmeric-700">
                {pendingCount} pending review
              </span>
            )}
          </p>
          <Button onClick={openNew}>
            <Plus size={16} /> Add New Review
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

        {loading ? (
          <p className="text-warmgray">Loading…</p>
        ) : visible.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-warmgray/30 bg-parchment/50 p-12 text-center">
            <Quote size={32} className="mx-auto text-warmgray/50" />
            <p className="mt-3 text-warmgray">
              {items.length === 0
                ? 'No reviews yet. Click "Add New Review" to add your first one.'
                : 'No reviews match this filter.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {visible.map((t) => (
              <li
                key={t._id}
                className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm md:flex-row md:items-start"
              >
                {t.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="h-12 w-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-forest font-display text-lg text-cream">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                )}
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
                    {t.location && (
                      <span className="ml-2 text-xs text-warmgray">· {t.location}</span>
                    )}
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
                    onClick={() => openEdit(t)}
                    className="rounded-lg border border-warmgray/30 p-2 hover:bg-parchment"
                    aria-label="Edit"
                    title="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="rounded-lg border border-warmgray/30 p-2 text-terracotta hover:bg-terracotta-50"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Review' : 'Add New Review'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <Input
            label="Customer Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Priya Sharma"
            required
          />
          <Input
            label="Location (optional)"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Mumbai"
          />
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">
              Star Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setForm({ ...form, rating: n })}
                  aria-label={`${n} star${n === 1 ? '' : 's'}`}
                  className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-turmeric"
                >
                  <Star
                    size={28}
                    className={cn(
                      n <= form.rating ? 'fill-turmeric text-turmeric' : 'text-warmgray/30',
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm font-semibold text-charcoal">
                {form.rating} / 5
              </span>
            </div>
          </div>
          <Textarea
            label="Review Description"
            rows={4}
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="What did the customer love about Thinnie Ayurveda?"
            required
            className="md:col-span-2"
          />
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">
              Customer Image (optional)
            </label>
            <div className="flex items-center gap-3">
              {form.avatar ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-warmgray/30">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.avatar}
                    alt="Customer"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, avatar: '' })}
                    className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal/70 text-cream"
                    aria-label="Remove image"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-warmgray/30 bg-parchment/30 text-warmgray">
                  <Upload size={18} />
                </div>
              )}
              <div className="flex-1">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileRef.current?.click()}
                  loading={uploading}
                  disabled={uploading}
                >
                  <Upload size={14} /> {form.avatar ? 'Replace photo' : 'Upload photo'}
                </Button>
                <p className="mt-1 text-xs text-warmgray">JPG or PNG, uploaded to Cloudinary.</p>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-charcoal">Status</label>
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
          <div className="flex items-center justify-end gap-2 md:col-span-2">
            <Button type="button" variant="outline" onClick={closeModal} disabled={saving}>
              Cancel
            </Button>
            <Button type="submit" loading={saving} disabled={saving || uploading}>
              <Save size={14} /> {editingId ? 'Save changes' : 'Add Review'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}
