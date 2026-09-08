'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Edit, Save, X, Upload, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type Placement = 'HERO' | 'STRIP'

interface Promotion {
  _id: string
  placement: Placement
  badgeText?: string
  title: string
  subtitle?: string
  highlight1?: string
  highlight2?: string
  description?: string
  imageBadge?: string
  imageUrl?: string
  publicId?: string
  ctaText: string
  ctaLink: string
  footnote?: string
  isActive: boolean
  sortOrder: number
}

interface FormState {
  placement: Placement
  badgeText: string
  title: string
  subtitle: string
  highlight1: string
  highlight2: string
  description: string
  imageBadge: string
  imageUrl: string
  publicId: string
  ctaText: string
  ctaLink: string
  footnote: string
  isActive: boolean
  sortOrder: number
}

const EMPTY: FormState = {
  placement: 'HERO',
  badgeText: '',
  title: '',
  subtitle: '',
  highlight1: '',
  highlight2: '',
  description: '',
  imageBadge: '',
  imageUrl: '',
  publicId: '',
  ctaText: 'Shop Now',
  ctaLink: '/shop',
  footnote: '',
  isActive: true,
  sortOrder: 0,
}

export default function AdminPromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/promotions')
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not load promotions')
        setPromotions([])
        return
      }
      setPromotions(data.promotions ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const startNew = (placement: Placement) => {
    setEditingId('new')
    setForm({ ...EMPTY, placement })
  }

  const startEdit = (p: Promotion) => {
    setEditingId(p._id)
    setForm({
      placement: p.placement,
      badgeText: p.badgeText ?? '',
      title: p.title,
      subtitle: p.subtitle ?? '',
      highlight1: p.highlight1 ?? '',
      highlight2: p.highlight2 ?? '',
      description: p.description ?? '',
      imageBadge: p.imageBadge ?? '',
      imageUrl: p.imageUrl ?? '',
      publicId: p.publicId ?? '',
      ctaText: p.ctaText,
      ctaLink: p.ctaLink,
      footnote: p.footnote ?? '',
      isActive: p.isActive,
      sortOrder: p.sortOrder,
    })
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/promotions/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Upload failed')
        return
      }
      setForm((f) => ({ ...f, imageUrl: data.url, publicId: data.publicId }))
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
    const payload = { ...form }
    const url = editingId === 'new' ? '/api/admin/promotions' : `/api/admin/promotions/${editingId}`
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
    toast.success(editingId === 'new' ? 'Promotion created' : 'Promotion updated')
    setEditingId(null)
    void load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this promotion?')) return
    const res = await fetch(`/api/admin/promotions/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Promotion deleted')
    void load()
  }

  const toggleActive = async (p: Promotion) => {
    const res = await fetch(`/api/admin/promotions/${p._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !p.isActive }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not update')
      return
    }
    toast.success(p.isActive ? 'Hidden from storefront' : 'Now live on storefront')
    void load()
  }

  const heroPromos = promotions.filter((p) => p.placement === 'HERO')
  const stripPromos = promotions.filter((p) => p.placement === 'STRIP')

  return (
    <>
      <AdminHeader title="Promotions" />
      <div className="p-6 lg:p-8">
        <p className="mb-5 text-sm text-warmgray">
          Manage the homepage ad banner (image + headline) and the scrolling offer strip. The most
          recent active item for each placement shows on the storefront — no code changes needed.
        </p>

        {editingId && (
          <form
            onSubmit={handleSubmit}
            className="mb-6 space-y-4 rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-forest">
                {editingId === 'new' ? 'New Promotion' : 'Edit Promotion'}
              </h3>
              <button type="button" onClick={() => setEditingId(null)} className="text-warmgray hover:text-charcoal">
                <X size={20} />
              </button>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold">Placement</label>
              <select
                value={form.placement}
                onChange={(e) => setForm({ ...form, placement: e.target.value as Placement })}
                className="w-full max-w-xs rounded-lg border border-warmgray/30 bg-white px-4 py-2.5 outline-none focus:border-forest"
              >
                <option value="HERO">Hero ad banner (image + headline)</option>
                <option value="STRIP">Scrolling top strip (looping headline)</option>
              </select>
            </div>

            {form.placement === 'HERO' && (
              <div className="rounded-xl border border-dashed border-warmgray/30 p-4">
                <label className="mb-2 block text-sm font-semibold">Banner image</label>
                <div className="flex items-center gap-4">
                  {form.imageUrl && (
                    <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-warmgray/20">
                      <Image src={form.imageUrl} alt="Preview" fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                  <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} loading={uploading} disabled={uploading}>
                    <Upload size={14} /> {uploading ? 'Uploading…' : form.imageUrl ? 'Replace image' : 'Upload image'}
                  </Button>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label={form.placement === 'STRIP' ? 'Headline (this loops across the strip)' : 'Badge / eyebrow text'}
                value={form.placement === 'STRIP' ? form.title : form.badgeText}
                onChange={(e) =>
                  form.placement === 'STRIP'
                    ? setForm({ ...form, title: e.target.value })
                    : setForm({ ...form, badgeText: e.target.value })
                }
                placeholder={form.placement === 'STRIP' ? 'This Raksha Bandhan — Buy 3 Get 1 Free' : 'Raksha Bandhan Offer'}
                required={form.placement === 'STRIP'}
              />
              {form.placement === 'HERO' && (
                <Input
                  label="Title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="This Raksha Bandhan"
                  required
                />
              )}
            </div>

            {form.placement === 'HERO' && (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <Input
                    label="Subtitle"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Gift Good Health"
                  />
                  <Input
                    label="Image badge (small pill on the image)"
                    value={form.imageBadge}
                    onChange={(e) => setForm({ ...form, imageBadge: e.target.value })}
                    placeholder="BUY 3 GET 1 FREE"
                  />
                  <Input
                    label="Highlight line 1"
                    value={form.highlight1}
                    onChange={(e) => setForm({ ...form, highlight1: e.target.value })}
                    placeholder="Buy 3 Get 1 Free"
                  />
                  <Input
                    label="Highlight line 2"
                    value={form.highlight2}
                    onChange={(e) => setForm({ ...form, highlight2: e.target.value })}
                    placeholder="Worth ₹500"
                  />
                </div>
                <Textarea
                  label="Description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Because their wellness matters the most — gift your sibling a bond of lifelong health"
                  rows={2}
                />
                <Input
                  label="Footnote (small print)"
                  value={form.footnote}
                  onChange={(e) => setForm({ ...form, footnote: e.target.value })}
                  placeholder="*Valid on Raksha Bandhan special purchases. T&C apply."
                />
              </>
            )}

            <div className="grid gap-4 md:grid-cols-3">
              <Input
                label="Button text"
                value={form.ctaText}
                onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                placeholder="Shop Now"
              />
              <Input
                label="Button link"
                value={form.ctaLink}
                onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                placeholder="/shop"
              />
              <Input
                label="Sort order"
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
              />
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              />
              <span className="font-semibold">Active (visible on storefront)</span>
            </label>

            <div className="flex gap-2">
              <Button type="submit">
                <Save size={14} /> {editingId === 'new' ? 'Create' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {(['HERO', 'STRIP'] as Placement[]).map((placement) => {
          const list = placement === 'HERO' ? heroPromos : stripPromos
          return (
            <div key={placement} className="mb-8">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-display text-lg text-forest">
                  {placement === 'HERO' ? 'Hero Ad Banner' : 'Scrolling Top Strip'}
                </h3>
                <Button size="sm" onClick={() => startNew(placement)}>
                  <Plus size={14} /> New
                </Button>
              </div>
              {loading ? (
                <p className="text-warmgray">Loading…</p>
              ) : list.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-warmgray/30 bg-parchment/50 p-8 text-center text-warmgray">
                  No {placement === 'HERO' ? 'ad banners' : 'strip headlines'} yet. The storefront shows its default copy until you add one.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((p) => (
                    <article
                      key={p._id}
                      className={cn(
                        'flex flex-col overflow-hidden rounded-2xl border bg-cream shadow-warm',
                        p.isActive ? 'border-forest/10' : 'border-warmgray/30 opacity-70',
                      )}
                    >
                      {p.placement === 'HERO' && p.imageUrl && (
                        <div className="relative h-36 bg-parchment">
                          <Image src={p.imageUrl} alt={p.title} fill className="object-cover" unoptimized />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-1 p-4">
                        <div className="flex items-center gap-2">
                          {!p.isActive && <Badge variant="warning">Hidden</Badge>}
                          {p.isActive && <Badge variant="success">Live</Badge>}
                        </div>
                        <p className="font-display text-base text-charcoal">{p.title}</p>
                        {p.subtitle && <p className="text-sm text-warmgray">{p.subtitle}</p>}
                        <div className="mt-3 flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleActive(p)}
                            className="rounded-lg border border-warmgray/30 p-1.5 hover:bg-parchment"
                            aria-label={p.isActive ? 'Hide' : 'Show'}
                            title={p.isActive ? 'Hide from storefront' : 'Show on storefront'}
                          >
                            {p.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(p)}
                            className="rounded-lg border border-warmgray/30 p-1.5 hover:bg-parchment"
                            aria-label="Edit"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(p._id)}
                            className="rounded-lg border border-warmgray/30 p-1.5 text-terracotta hover:bg-terracotta-50"
                            aria-label="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
