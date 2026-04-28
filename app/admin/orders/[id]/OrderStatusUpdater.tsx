'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'
import type { OrderStatus } from '@/models/Order'

const STATUSES: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
]

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: OrderStatus
}) {
  const router = useRouter()
  const [status, setStatus] = useState<OrderStatus>(currentStatus)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const update = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, note }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not update')
        return
      }
      toast.success('Status updated')
      setNote('')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm">
      <h3 className="font-display text-lg text-forest">Update Status</h3>
      <div className="mt-3 space-y-3">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full rounded-lg border border-warmgray/30 bg-white px-3 py-2 text-sm outline-none focus:border-forest"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Internal note (optional)"
          rows={2}
          className="w-full rounded-lg border border-warmgray/30 bg-white px-3 py-2 text-sm outline-none focus:border-forest"
        />
        <Button onClick={update} loading={saving} disabled={status === currentStatus && !note} className="w-full">
          Update
        </Button>
      </div>
    </div>
  )
}
