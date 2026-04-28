'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface Settings {
  storeName?: string
  storeEmail?: string
  storePhone?: string
  storeAddress?: string
  currency?: string
  freeShippingMin?: number
  shippingCharge?: number
  taxRate?: number
  metaTitle?: string
  metaDescription?: string
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => setSettings(d ?? {}))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings((s) => ({ ...s, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          freeShippingMin: settings.freeShippingMin ? Number(settings.freeShippingMin) : undefined,
          shippingCharge: settings.shippingCharge ? Number(settings.shippingCharge) : undefined,
          taxRate: settings.taxRate ? Number(settings.taxRate) : undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not save')
        return
      }
      toast.success('Settings saved')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <><AdminHeader title="Settings" /><div className="p-6">Loading…</div></>

  return (
    <>
      <AdminHeader title="Settings" />
      <form onSubmit={handleSubmit} className="space-y-6 p-6 lg:p-8">
        <section className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
          <h2 className="font-display text-xl text-forest">Store Information</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Input label="Store Name" value={settings.storeName ?? ''} onChange={(e) => update('storeName', e.target.value)} />
            <Input label="Currency" value={settings.currency ?? 'INR'} onChange={(e) => update('currency', e.target.value)} />
            <Input label="Store Email" type="email" value={settings.storeEmail ?? ''} onChange={(e) => update('storeEmail', e.target.value)} />
            <Input label="Store Phone" value={settings.storePhone ?? ''} onChange={(e) => update('storePhone', e.target.value)} />
            <Textarea label="Store Address" value={settings.storeAddress ?? ''} onChange={(e) => update('storeAddress', e.target.value)} className="md:col-span-2" rows={2} />
          </div>
        </section>

        <section className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
          <h2 className="font-display text-xl text-forest">Shipping & Tax</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Input
              label="Free Shipping Above (₹)"
              type="number" min="0"
              value={settings.freeShippingMin ?? 999}
              onChange={(e) => update('freeShippingMin', Number(e.target.value))}
            />
            <Input
              label="Standard Shipping Charge (₹)"
              type="number" min="0"
              value={settings.shippingCharge ?? 99}
              onChange={(e) => update('shippingCharge', Number(e.target.value))}
            />
            <Input
              label="Tax Rate (%)"
              type="number" min="0" max="100" step="0.1"
              value={settings.taxRate ?? 18}
              onChange={(e) => update('taxRate', Number(e.target.value))}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
          <h2 className="font-display text-xl text-forest">SEO</h2>
          <div className="mt-4 grid gap-4">
            <Input label="Meta Title" value={settings.metaTitle ?? ''} onChange={(e) => update('metaTitle', e.target.value)} />
            <Textarea label="Meta Description" value={settings.metaDescription ?? ''} onChange={(e) => update('metaDescription', e.target.value)} rows={3} />
          </div>
        </section>

        <Button type="submit" loading={saving} size="lg">Save Settings</Button>
      </form>
    </>
  )
}
