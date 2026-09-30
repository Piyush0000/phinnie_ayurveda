'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Plus, Trash2, Edit, Save, X, Upload, Eye, EyeOff, Gift, Wand2 } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { cn, formatPrice } from '@/lib/utils'
import { isOfferLive, tierLabel, COUNTDOWN_THEMES, type CountdownTheme, type OfferTier } from '@/lib/bundle-offer'
import { COUNTDOWN_PALETTES } from '@/lib/countdown-palettes'
import OfferCountdownBar from '@/components/store/OfferCountdownBar'

interface Offer {
  _id: string
  title: string
  subtitle?: string
  countdownLabel?: string
  footnote?: string
  ctaText: string
  ctaLink: string
  imageUrl?: string
  publicId?: string
  tiers: OfferTier[]
  productIds: string[]
  combineWithCoupons: boolean
  showCountdownBar: boolean
  countdownTheme?: CountdownTheme
  isActive: boolean
  startsAt?: string | null
  endsAt?: string | null
  updatedAt: string
}

interface ProductOption {
  _id: string
  name: string
  price: number
  images?: string[]
}

interface FormState {
  title: string
  subtitle: string
  countdownLabel: string
  footnote: string
  ctaText: string
  ctaLink: string
  imageUrl: string
  publicId: string
  tiers: { quantity: string; price: string }[]
  productIds: string[]
  combineWithCoupons: boolean
  showCountdownBar: boolean
  countdownTheme: CountdownTheme
  isActive: boolean
  startsAt: string
  endsAt: string
}

const PRESET: FormState = {
  title: 'Thinnie Festive Dhamaka',
  subtitle: 'Your Health · Your Festive Glow · Our Special Offer',
  countdownLabel: 'Festive Dhamaka Offer Ends In',
  footnote: '*Mix & match any products. Offer price applied automatically at checkout.',
  ctaText: 'Shop the Offer',
  ctaLink: '/shop',
  imageUrl: '/offers/festive-dhamaka.webp',
  publicId: '',
  tiers: [
    { quantity: '2', price: '999' },
    { quantity: '3', price: '1499' },
    { quantity: '4', price: '1999' },
  ],
  productIds: [],
  combineWithCoupons: false,
  showCountdownBar: true,
  countdownTheme: 'purple',
  isActive: true,
  startsAt: '',
  endsAt: '',
}

const EMPTY: FormState = {
  ...PRESET,
  title: '',
  subtitle: '',
  countdownLabel: '',
  footnote: '',
  imageUrl: '',
  tiers: [{ quantity: '2', price: '' }],
}

/** ISO → value for <input type="datetime-local"> in the admin's local time. */
function toLocalInput(iso?: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  const off = d.getTimezoneOffset() * 60_000
  return new Date(d.getTime() - off).toISOString().slice(0, 16)
}

function fmtDate(iso?: string | null) {
  return iso ? new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : null
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY)
  const fileRef = useRef<HTMLInputElement | null>(null)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/offers')
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not load offers')
        return
      }
      setOffers(data.offers ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
    fetch('/api/products?limit=60&includeInactive=true&sort=newest')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setProducts(d?.products ?? []))
      .catch(() => setProducts([]))
  }, [])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const startNew = (preset?: boolean) => {
    setEditingId('new')
    setForm(preset ? PRESET : EMPTY)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const startEdit = (o: Offer) => {
    setEditingId(o._id)
    setForm({
      title: o.title,
      subtitle: o.subtitle ?? '',
      countdownLabel: o.countdownLabel ?? '',
      footnote: o.footnote ?? '',
      ctaText: o.ctaText,
      ctaLink: o.ctaLink,
      imageUrl: o.imageUrl ?? '',
      publicId: o.publicId ?? '',
      tiers: o.tiers.map((t) => ({ quantity: String(t.quantity), price: String(t.price) })),
      productIds: o.productIds.map(String),
      combineWithCoupons: o.combineWithCoupons,
      showCountdownBar: o.showCountdownBar,
      countdownTheme: o.countdownTheme ?? 'purple',
      isActive: o.isActive,
      startsAt: toLocalInput(o.startsAt),
      endsAt: toLocalInput(o.endsAt),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
    const tiers = form.tiers.map((t) => ({ quantity: Number(t.quantity), price: Number(t.price) }))
    if (tiers.some((t) => !t.quantity || !t.price)) {
      toast.error('Fill in quantity and price for every tier')
      return
    }
    const payload = {
      ...form,
      tiers,
      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : '',
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : '',
    }
    setSaving(true)
    try {
      const isNew = editingId === 'new'
      const res = await fetch(isNew ? '/api/admin/offers' : `/api/admin/offers/${editingId}`, {
        method: isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not save')
        return
      }
      toast.success(isNew ? 'Offer created' : 'Offer updated')
      setEditingId(null)
      void load()
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer? Customers will no longer get this price.')) return
    const res = await fetch(`/api/admin/offers/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Offer deleted')
    void load()
  }

  const toggleActive = async (o: Offer) => {
    const res = await fetch(`/api/admin/offers/${o._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !o.isActive }),
    })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not update')
      return
    }
    toast.success(o.isActive ? 'Offer paused' : 'Offer is live')
    void load()
  }

  // The storefront runs the most recently updated live offer.
  const runningId = offers.find((o) => o.isActive && isOfferLive(o))?._id

  const toggleProduct = (id: string) =>
    set(
      'productIds',
      form.productIds.includes(id) ? form.productIds.filter((p) => p !== id) : [...form.productIds, id],
    )

  return (
    <>
      <AdminHeader title="Festive Offers" />
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="max-w-2xl text-sm text-warmgray">
            Bundle offers like <strong>Buy 2 @ ₹999 · Buy 3 @ ₹1499 · Buy 4 @ ₹1999</strong>. The live
            offer shows as the homepage banner and countdown bar, and its price is applied automatically at
            checkout, so customers don’t need a coupon. If several offers are live, the most recently
            updated one runs.
          </p>
          {!editingId && (
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => startNew(true)}>
                <Wand2 size={14} /> Festive preset
              </Button>
              <Button onClick={() => startNew(false)}>
                <Plus size={14} /> New offer
              </Button>
            </div>
          )}
        </div>

        {editingId && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 space-y-6 rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl text-forest">
                {editingId === 'new' ? 'New Offer' : 'Edit Offer'}
              </h3>
              <button type="button" onClick={() => setEditingId(null)} className="text-warmgray hover:text-charcoal" aria-label="Close">
                <X size={20} />
              </button>
            </div>

            {/* Tiers */}
            <section className="rounded-xl border border-[#e0a100]/40 bg-[#fff8e1] p-4">
              <h4 className="font-semibold text-charcoal">Offer tiers</h4>
              <p className="mb-3 text-xs text-warmgray">
                Customers pay the bundle price for that many products. Bigger carts combine tiers (e.g. 6 items = Buy 4 + Buy 2).
                A tier only applies when it’s cheaper than the regular price.
              </p>
              <div className="space-y-2">
                {form.tiers.map((t, i) => (
                  <div key={i} className="flex items-end gap-2">
                    <Input
                      label={i === 0 ? 'Buy (qty)' : undefined}
                      type="number"
                      min={2}
                      value={t.quantity}
                      onChange={(e) =>
                        set('tiers', form.tiers.map((x, j) => (j === i ? { ...x, quantity: e.target.value } : x)))
                      }
                      className="w-28"
                      required
                    />
                    <span className="pb-3 font-bold text-warmgray">@ ₹</span>
                    <Input
                      label={i === 0 ? 'Bundle price' : undefined}
                      type="number"
                      min={1}
                      value={t.price}
                      onChange={(e) =>
                        set('tiers', form.tiers.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))
                      }
                      className="w-36"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => set('tiers', form.tiers.filter((_, j) => j !== i))}
                      disabled={form.tiers.length === 1}
                      className="mb-1 rounded-lg border border-warmgray/30 p-2 text-terracotta hover:bg-terracotta-50 disabled:opacity-40"
                      aria-label="Remove tier"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => {
                  const maxQty = Math.max(1, ...form.tiers.map((t) => Number(t.quantity) || 0))
                  set('tiers', [...form.tiers, { quantity: String(maxQty + 1), price: '' }])
                }}
              >
                <Plus size={14} /> Add tier
              </Button>
            </section>

            {/* Content */}
            <section className="grid gap-4 md:grid-cols-2">
              <Input label="Offer title" value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Thinnie Festive Dhamaka" hint="Last word goes on the red ribbon, e.g. “Dhamaka”" required />
              <Input label="Taglines" value={form.subtitle} onChange={(e) => set('subtitle', e.target.value)} placeholder="Your Health · Your Festive Glow · Our Special Offer" hint="Separate with ·" />
              <Input label="Countdown bar text" value={form.countdownLabel} onChange={(e) => set('countdownLabel', e.target.value)} placeholder="Festive Dhamaka Offer Ends In" />
              <Input label="Small print" value={form.footnote} onChange={(e) => set('footnote', e.target.value)} placeholder="*T&C apply" />
              <Input label="Button text" value={form.ctaText} onChange={(e) => set('ctaText', e.target.value)} placeholder="Shop the Offer" />
              <Input label="Button link" value={form.ctaLink} onChange={(e) => set('ctaLink', e.target.value)} placeholder="/shop" />
            </section>

            {/* Image */}
            <section className="rounded-xl border border-dashed border-warmgray/30 p-4">
              <label className="mb-2 block text-sm font-semibold">Banner poster (portrait works best)</label>
              <div className="flex flex-wrap items-center gap-4">
                {form.imageUrl && (
                  <div className="relative h-36 w-24 overflow-hidden rounded-lg border border-warmgray/20 bg-parchment">
                    <Image src={form.imageUrl} alt="Preview" fill className="object-cover" unoptimized />
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
                <Button type="button" variant="outline" onClick={() => fileRef.current?.click()} loading={uploading} disabled={uploading}>
                  <Upload size={14} /> {uploading ? 'Uploading…' : form.imageUrl ? 'Replace image' : 'Upload image'}
                </Button>
                {form.imageUrl && (
                  <button type="button" className="text-xs text-terracotta hover:underline" onClick={() => setForm((f) => ({ ...f, imageUrl: '', publicId: '' }))}>
                    Remove image
                  </button>
                )}
              </div>
            </section>

            {/* Countdown bar */}
            <section className="rounded-xl border border-warmgray/20 bg-white p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="font-semibold text-charcoal">Countdown bar (top of every page)</h4>
                  <p className="text-xs text-warmgray">Text comes from “Countdown bar text”; time counts down to the end date.</p>
                </div>
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={form.showCountdownBar} onChange={(e) => set('showCountdownBar', e.target.checked)} />
                  Show countdown bar
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {COUNTDOWN_THEMES.map((theme) => (
                  <button
                    key={theme}
                    type="button"
                    onClick={() => set('countdownTheme', theme)}
                    className={cn(
                      'flex items-center gap-2 rounded-full border-2 py-1 pl-1 pr-3 text-xs font-semibold transition',
                      form.countdownTheme === theme ? 'border-charcoal' : 'border-transparent bg-parchment/60 hover:border-warmgray/40',
                    )}
                  >
                    <span className="h-6 w-6 rounded-full" style={{ background: COUNTDOWN_PALETTES[theme].bg }} />
                    {COUNTDOWN_PALETTES[theme].label}
                  </button>
                ))}
              </div>
              {form.showCountdownBar && (
                <div className="pointer-events-none mt-3 overflow-hidden rounded-lg">
                  <OfferCountdownBar
                    offer={{
                      _id: 'preview',
                      title: form.title || 'Offer',
                      countdownLabel: form.countdownLabel,
                      ctaText: form.ctaText,
                      ctaLink: '#',
                      tiers: [],
                      productIds: [],
                      combineWithCoupons: false,
                      showCountdownBar: true,
                      countdownTheme: form.countdownTheme,
                      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
                      startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
                      phase: form.startsAt && new Date(form.startsAt) > new Date() ? 'upcoming' : 'live',
                    }}
                  />
                </div>
              )}
            </section>

            {/* Schedule */}
            <section className="grid gap-4 md:grid-cols-2">
              <Input label="Starts (optional)" type="datetime-local" value={form.startsAt} onChange={(e) => set('startsAt', e.target.value)} hint="Leave empty to start now. Before this time the site shows a “Starts In” countdown; prices apply from this moment." />
              <Input label="Ends (optional)" type="datetime-local" value={form.endsAt} onChange={(e) => set('endsAt', e.target.value)} hint="Leave empty for no end (runs until you pause it); the timer then counts down to midnight each day" />
            </section>

            {/* Products */}
            <section>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold">Eligible products</label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.productIds.length === 0} onChange={(e) => e.target.checked && set('productIds', [])} />
                  All products
                </label>
              </div>
              <div className="grid max-h-64 gap-1.5 overflow-y-auto rounded-xl border border-warmgray/20 bg-white p-2 sm:grid-cols-2 lg:grid-cols-3">
                {products.length === 0 && <p className="p-2 text-sm text-warmgray">No products found.</p>}
                {products.map((p) => (
                  <label
                    key={p._id}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-parchment',
                      form.productIds.includes(p._id) && 'bg-forest-50',
                    )}
                  >
                    <input type="checkbox" checked={form.productIds.includes(p._id)} onChange={() => toggleProduct(p._id)} />
                    <span className="line-clamp-1 flex-1">{p.name}</span>
                    <span className="text-xs text-warmgray">{formatPrice(p.price)}</span>
                  </label>
                ))}
              </div>
              <p className="mt-1 text-xs text-warmgray">
                {form.productIds.length === 0
                  ? 'Every product counts towards the bundle.'
                  : `${form.productIds.length} product(s) selected. Only these count towards the bundle.`}
              </p>
            </section>

            {/* Switches */}
            <section className="grid gap-3 sm:grid-cols-2">
              <Toggle checked={form.isActive} onChange={(v) => set('isActive', v)} title="Active" desc="Live on the storefront & checkout" />
              <Toggle checked={form.combineWithCoupons} onChange={(v) => set('combineWithCoupons', v)} title="Stack with coupons" desc="Off: the better of offer or coupon is applied" />
            </section>

            <div className="flex gap-2">
              <Button type="submit" loading={saving}>
                <Save size={14} /> {editingId === 'new' ? 'Create offer' : 'Save changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => setEditingId(null)}>
                Cancel
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-warmgray">Loading…</p>
        ) : offers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-warmgray/30 bg-parchment/50 p-10 text-center">
            <Gift className="mx-auto mb-3 text-turmeric" size={32} />
            <p className="text-warmgray">No offers yet.</p>
            <Button className="mt-4" onClick={() => startNew(true)}>
              <Wand2 size={14} /> Start with the Festive Dhamaka preset
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {offers.map((o) => {
              const running = o._id === runningId
              const scheduled = o.isActive && !isOfferLive(o)
              return (
                <article
                  key={o._id}
                  className={cn(
                    'flex overflow-hidden rounded-2xl border bg-cream shadow-warm',
                    running ? 'border-forest ring-2 ring-forest/30' : 'border-forest/10',
                    !o.isActive && 'opacity-70',
                  )}
                >
                  {o.imageUrl && (
                    <div className="relative w-28 shrink-0 bg-parchment">
                      <Image src={o.imageUrl} alt={o.title} fill className="object-cover" unoptimized />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {running && <Badge variant="success">Running now</Badge>}
                      {scheduled && <Badge variant="warning">{o.startsAt && new Date(o.startsAt) > new Date() ? 'Scheduled' : 'Ended'}</Badge>}
                      {o.isActive && !running && !scheduled && <Badge>Live (not shown)</Badge>}
                      {!o.isActive && <Badge variant="warning">Paused</Badge>}
                    </div>
                    <p className="font-display text-lg leading-tight text-charcoal">{o.title}</p>
                    <div className="flex flex-wrap gap-1">
                      {o.tiers.map((t) => (
                        <span key={t.quantity} className="rounded-full bg-forest px-2 py-0.5 text-[11px] font-bold text-cream">
                          {tierLabel(t)}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-warmgray">
                      {o.productIds.length ? `${o.productIds.length} products` : 'All products'}
                      {' · '}
                      {o.combineWithCoupons ? 'Stacks with coupons' : 'Best of offer/coupon'}
                    </p>
                    {(o.startsAt || o.endsAt) && (
                      <p className="text-xs text-warmgray">
                        {fmtDate(o.startsAt) ?? 'Now'} → {fmtDate(o.endsAt) ?? 'No end'}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-end gap-1.5 pt-2">
                      <button type="button" onClick={() => toggleActive(o)} className="rounded-lg border border-warmgray/30 p-1.5 hover:bg-parchment" title={o.isActive ? 'Pause offer' : 'Make live'} aria-label={o.isActive ? 'Pause' : 'Activate'}>
                        {o.isActive ? <Eye size={13} /> : <EyeOff size={13} />}
                      </button>
                      <button type="button" onClick={() => startEdit(o)} className="rounded-lg border border-warmgray/30 p-1.5 hover:bg-parchment" aria-label="Edit">
                        <Edit size={13} />
                      </button>
                      <button type="button" onClick={() => handleDelete(o._id)} className="rounded-lg border border-warmgray/30 p-1.5 text-terracotta hover:bg-terracotta-50" aria-label="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function Toggle({ checked, onChange, title, desc }: { checked: boolean; onChange: (v: boolean) => void; title: string; desc: string }) {
  return (
    <label className={cn('flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition', checked ? 'border-forest bg-forest/5' : 'border-warmgray/20 bg-white')}>
      <input type="checkbox" className="mt-1" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>
        <span className="block text-sm font-semibold text-charcoal">{title}</span>
        <span className="block text-xs text-warmgray">{desc}</span>
      </span>
    </label>
  )
}
