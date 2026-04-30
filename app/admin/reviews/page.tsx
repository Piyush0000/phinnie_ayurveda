'use client'

import { useEffect, useState } from 'react'
import { Trash2, ShieldCheck, Shield, Check, Ban, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import StarRating from '@/components/store/StarRating'
import { formatDateTime, cn } from '@/lib/utils'
import type { ReviewModerationStatus } from '@/models/Review'

interface Review {
  _id: string
  userId: string
  userName: string
  productId: string
  rating: number
  title?: string
  body?: string
  isVerified: boolean
  moderationStatus: ReviewModerationStatus
  createdAt: string
}

type StatusFilter = 'ALL' | ReviewModerationStatus
type RatingFilter = 'ALL' | '1' | '2' | '3' | '4' | '5'

const STATUS_FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
]

function ModerationBadge({ status }: { status: ReviewModerationStatus }) {
  if (status === 'APPROVED') return <Badge variant="success">Approved</Badge>
  if (status === 'REJECTED') return <Badge variant="danger">Rejected</Badge>
  return <Badge variant="warning">Pending</Badge>
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>('ALL')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '200' })
    if (ratingFilter !== 'ALL') params.set('rating', ratingFilter)
    const res = await fetch(`/api/reviews?${params.toString()}`)
    const data = await res.json()
    setReviews(data.reviews ?? [])
    setSelected(new Set())
    setLoading(false)
  }

  useEffect(() => {
    void load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratingFilter])

  const visible =
    statusFilter === 'ALL'
      ? reviews
      : reviews.filter((r) => r.moderationStatus === statusFilter)

  const toggleOne = (id: string) =>
    setSelected((s) => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const toggleAllVisible = () =>
    setSelected((s) =>
      s.size === visible.length && visible.every((r) => s.has(r._id))
        ? new Set()
        : new Set(visible.map((r) => r._id)),
    )

  const moderate = async (review: Review, moderationStatus: ReviewModerationStatus) => {
    const res = await fetch(`/api/reviews/${review._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ moderationStatus }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not update')
      return
    }
    toast.success(`Marked ${moderationStatus.toLowerCase()}`)
    void load()
  }

  const toggleVerified = async (review: Review) => {
    const res = await fetch(`/api/reviews/${review._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVerified: !review.isVerified }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not update')
      return
    }
    toast.success(review.isVerified ? 'Marked unverified' : 'Marked verified')
    void load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review? This cannot be undone.')) return
    const res = await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Review deleted')
    void load()
  }

  const handleBulkDelete = async () => {
    if (selected.size === 0) return
    if (!confirm(`Delete ${selected.size} review${selected.size === 1 ? '' : 's'}? This cannot be undone.`)) return
    const ids = Array.from(selected)
    const results = await Promise.all(
      ids.map((id) => fetch(`/api/reviews/${id}`, { method: 'DELETE' }).then((r) => r.ok)),
    )
    const okCount = results.filter(Boolean).length
    const failCount = results.length - okCount
    if (okCount > 0) toast.success(`Deleted ${okCount} review${okCount === 1 ? '' : 's'}`)
    if (failCount > 0) toast.error(`${failCount} could not be deleted`)
    void load()
  }

  const allVisibleSelected =
    visible.length > 0 && visible.every((r) => selected.has(r._id))

  return (
    <>
      <AdminHeader title="Reviews" />
      <div className="p-6 lg:p-8">
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
          <span className="mx-1 text-warmgray">·</span>
          {(['ALL', '5', '4', '3', '2', '1'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setRatingFilter(f)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-xs font-semibold transition',
                ratingFilter === f
                  ? 'border-turmeric bg-turmeric text-charcoal'
                  : 'border-warmgray/30 bg-cream text-charcoal hover:bg-parchment',
              )}
            >
              {f === 'ALL' ? 'All ratings' : `${f} ★`}
            </button>
          ))}
        </div>

        {selected.size > 0 && (
          <div className="mb-4 flex items-center justify-between rounded-2xl border border-forest/10 bg-parchment/60 px-5 py-3 text-sm">
            <span className="font-semibold">
              {selected.size} selected
            </span>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
              <button
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-terracotta px-3 py-1.5 text-xs font-semibold text-terracotta hover:bg-terracotta-50"
              >
                <Trash2 size={14} /> Delete selected
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <p className="text-warmgray">Loading…</p>
        ) : visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-warmgray/30 bg-parchment/50 p-12 text-center text-warmgray">
            No reviews match these filters
          </p>
        ) : (
          <>
            <label className="mb-3 flex items-center gap-2 text-xs text-warmgray">
              <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={toggleAllVisible}
              />
              Select all {visible.length} visible
            </label>
            <ul className="space-y-3">
              {visible.map((r) => (
                <li
                  key={r._id}
                  className="flex flex-col gap-3 rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm md:flex-row md:items-start"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(r._id)}
                    onChange={() => toggleOne(r._id)}
                    className="mt-1.5 shrink-0"
                    aria-label={`Select review by ${r.userName}`}
                  />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <strong className="text-charcoal">{r.userName}</strong>
                      <ModerationBadge status={r.moderationStatus} />
                      {r.isVerified && <Badge variant="success">Verified buyer</Badge>}
                      <span className="text-xs text-warmgray">{formatDateTime(r.createdAt)}</span>
                    </div>
                    <StarRating value={r.rating} size={14} className="mt-1" />
                    {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
                    {r.body && <p className="mt-1 text-sm text-charcoal/80">{r.body}</p>}
                    <p className="mt-2 text-xs text-warmgray">Product ID: {r.productId}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => moderate(r, 'APPROVED')}
                      disabled={r.moderationStatus === 'APPROVED'}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-forest/30 px-3 py-1.5 text-xs font-semibold text-forest hover:bg-forest hover:text-cream disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-forest"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      onClick={() => moderate(r, 'REJECTED')}
                      disabled={r.moderationStatus === 'REJECTED'}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-terracotta/40 px-3 py-1.5 text-xs font-semibold text-terracotta hover:bg-terracotta-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <Ban size={14} /> Reject
                    </button>
                    <button
                      onClick={() => moderate(r, 'PENDING')}
                      disabled={r.moderationStatus === 'PENDING'}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-warmgray/30 px-3 py-1.5 text-xs font-semibold hover:bg-parchment disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <Clock size={14} /> Pending
                    </button>
                    <button
                      onClick={() => toggleVerified(r)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-warmgray/30 px-3 py-1.5 text-xs font-semibold hover:bg-parchment"
                      title={r.isVerified ? 'Mark unverified' : 'Mark verified'}
                    >
                      {r.isVerified ? <Shield size={14} /> : <ShieldCheck size={14} />}
                    </button>
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-warmgray/30 px-3 py-1.5 text-xs font-semibold text-terracotta hover:bg-terracotta-50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  )
}
