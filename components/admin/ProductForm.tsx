'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import ImageUploader from './ImageUploader'
import { slugify } from '@/lib/utils'

interface Category {
  _id: string
  name: string
  slug: string
}

interface ProductData {
  _id?: string
  name?: string
  slug?: string
  description?: string
  shortDesc?: string
  price?: number
  comparePrice?: number
  costPrice?: number
  sku?: string
  stock?: number
  images?: string[]
  categoryId?: string
  tags?: string[]
  ingredients?: string
  benefits?: string[]
  howToUse?: string
  weight?: string
  isActive?: boolean
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
}

export default function ProductForm({ initial, productId }: { initial?: ProductData; productId?: string }) {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<ProductData>({
    name: '',
    slug: '',
    description: '',
    shortDesc: '',
    price: 0,
    comparePrice: undefined,
    stock: 0,
    images: [],
    tags: [],
    benefits: [],
    isActive: true,
    isFeatured: false,
    ...initial,
  })
  const [tagInput, setTagInput] = useState('')
  const [benefitInput, setBenefitInput] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((d) => setCategories(d.categories ?? []))
  }, [])

  const update = <K extends keyof ProductData>(key: K, value: ProductData[K]) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleNameChange = (name: string) => {
    setForm((f) => {
      const slug = !productId && (!f.slug || f.slug === slugify(f.name ?? '')) ? slugify(name) : f.slug
      return { ...f, name, slug }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
        costPrice: form.costPrice ? Number(form.costPrice) : undefined,
        stock: Number(form.stock ?? 0),
      }
      const url = productId ? `/api/products/${productId}` : '/api/products'
      const method = productId ? 'PATCH' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not save product')
        return
      }
      toast.success(productId ? 'Product updated' : 'Product created')
      router.push('/admin/products')
      router.refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
        <h2 className="font-display text-xl text-forest">Basic Information</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input label="Name" value={form.name ?? ''} onChange={(e) => handleNameChange(e.target.value)} required />
          <Input label="Slug" value={form.slug ?? ''} onChange={(e) => update('slug', slugify(e.target.value))} required />
          <Textarea
            label="Short Description"
            value={form.shortDesc ?? ''}
            onChange={(e) => update('shortDesc', e.target.value)}
            rows={2}
            className="md:col-span-2"
          />
          <Textarea
            label="Description"
            value={form.description ?? ''}
            onChange={(e) => update('description', e.target.value)}
            rows={5}
            className="md:col-span-2"
            required
          />
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Category</label>
            <select
              value={form.categoryId ?? ''}
              onChange={(e) => update('categoryId', e.target.value)}
              required
              className="w-full rounded-lg border border-warmgray/30 bg-white px-4 py-2.5 outline-none focus:border-forest"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
        <h2 className="font-display text-xl text-forest">Pricing & Stock</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Input label="Price (₹)" type="number" min="0" step="0.01" value={form.price ?? 0} onChange={(e) => update('price', Number(e.target.value))} required />
          <Input label="Compare At (₹)" type="number" min="0" step="0.01" value={form.comparePrice ?? ''} onChange={(e) => update('comparePrice', e.target.value ? Number(e.target.value) : undefined)} />
          <Input label="Cost (₹)" type="number" min="0" step="0.01" value={form.costPrice ?? ''} onChange={(e) => update('costPrice', e.target.value ? Number(e.target.value) : undefined)} />
          <Input label="SKU" value={form.sku ?? ''} onChange={(e) => update('sku', e.target.value)} />
          <Input label="Stock" type="number" min="0" value={form.stock ?? 0} onChange={(e) => update('stock', Number(e.target.value))} />
          <Input label="Weight" placeholder="e.g. 100ml, 60 capsules" value={form.weight ?? ''} onChange={(e) => update('weight', e.target.value)} />
        </div>
      </section>

      <section className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
        <h2 className="font-display text-xl text-forest">Images</h2>
        <div className="mt-4">
          <ImageUploader images={form.images ?? []} onChange={(images) => update('images', images)} />
        </div>
      </section>

      <section className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
        <h2 className="font-display text-xl text-forest">Ayurvedic Details</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Benefits</label>
            <div className="flex flex-wrap gap-2">
              {(form.benefits ?? []).map((b, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 px-3 py-1 text-sm text-forest-700">
                  {b}
                  <button
                    type="button"
                    onClick={() => update('benefits', form.benefits!.filter((_, idx) => idx !== i))}
                    className="hover:text-terracotta"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="mt-2 flex gap-2">
              <input
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (benefitInput.trim()) {
                      update('benefits', [...(form.benefits ?? []), benefitInput.trim()])
                      setBenefitInput('')
                    }
                  }
                }}
                placeholder="Type and press Enter"
                className="flex-1 rounded-lg border border-warmgray/30 bg-white px-3 py-2 text-sm outline-none focus:border-forest"
              />
            </div>
          </div>
          <Textarea label="Ingredients" value={form.ingredients ?? ''} onChange={(e) => update('ingredients', e.target.value)} rows={3} />
          <Textarea label="How to Use" value={form.howToUse ?? ''} onChange={(e) => update('howToUse', e.target.value)} rows={3} />
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Tags</label>
            <div className="flex flex-wrap gap-2">
              {(form.tags ?? []).map((t, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-turmeric-100 px-2.5 py-0.5 text-xs text-turmeric-800">
                  {t}
                  <button type="button" onClick={() => update('tags', form.tags!.filter((_, idx) => idx !== i))}>
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  if (tagInput.trim()) {
                    update('tags', [...(form.tags ?? []), tagInput.trim()])
                    setTagInput('')
                  }
                }
              }}
              placeholder="Add tag and press Enter"
              className="mt-2 w-full rounded-lg border border-warmgray/30 bg-white px-3 py-2 text-sm outline-none focus:border-forest"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm">
        <h2 className="font-display text-xl text-forest">Visibility</h2>
        <div className="mt-4 flex gap-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isActive ?? true} onChange={(e) => update('isActive', e.target.checked)} />
            <span className="font-semibold">Active</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.isFeatured ?? false} onChange={(e) => update('isFeatured', e.target.checked)} />
            <span className="font-semibold">Featured</span>
          </label>
        </div>
      </section>

      <div className="flex gap-3">
        <Button type="submit" loading={saving} size="lg">{productId ? 'Save Changes' : 'Create Product'}</Button>
        <Button type="button" variant="outline" size="lg" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
