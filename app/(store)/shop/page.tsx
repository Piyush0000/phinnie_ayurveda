'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search, Filter, X } from 'lucide-react'
import ProductGrid from '@/components/store/ProductGrid'
import Pagination from '@/components/ui/Pagination'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  images: string[]
  rating: number
  reviewCount: number
  stock: number
  shortDesc?: string
  categoryName?: string
}

interface Category {
  _id: string
  name: string
  slug: string
  productCount: number
}

function ShopContent() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const search = sp.get('search') ?? ''
  const category = sp.get('category') ?? ''
  const sort = sp.get('sort') ?? 'newest'
  const page = Math.max(1, Number(sp.get('page')) || 1)

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(sp.toString())
    if (value && value.length > 0) params.set(key, value)
    else params.delete(key)
    if (key !== 'page') params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    params.set('sort', sort)
    params.set('page', String(page))
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products ?? [])
        setTotalPages(d.totalPages ?? 1)
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [search, category, sort, page])

  return (
    <div className="container-wide py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl text-charcoal md:text-5xl">Shop All Products</h1>
        <p className="mt-2 font-accent text-lg text-warmgray">
          Authentic Ayurvedic remedies, handcrafted with care
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray" />
          <input
            value={search}
            onChange={(e) => setParam('search', e.target.value)}
            placeholder="Search remedies, herbs, brands..."
            className="h-11 w-full rounded-lg border border-warmgray/30 bg-cream pl-11 pr-4 outline-none focus:border-forest focus:ring-2 focus:ring-forest/20"
          />
          {search && (
            <button
              onClick={() => setParam('search', null)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-warmgray hover:bg-parchment"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <select
          value={sort}
          onChange={(e) => setParam('sort', e.target.value)}
          className="h-11 rounded-lg border border-warmgray/30 bg-cream px-3 outline-none focus:border-forest"
        >
          <option value="newest">Newest</option>
          <option value="featured">Featured</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="bestselling">Best Selling</option>
        </select>
        <button
          onClick={() => setFiltersOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-lg border border-warmgray/30 bg-cream px-4 font-semibold text-charcoal hover:bg-parchment lg:hidden"
        >
          <Filter size={16} /> Filters
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px,1fr]">
        <aside
          className={`${filtersOpen ? 'fixed inset-0 z-40 overflow-y-auto bg-cream p-6' : 'hidden'} lg:relative lg:block lg:p-0`}
        >
          <div className="flex items-center justify-between lg:hidden">
            <h3 className="font-display text-2xl text-forest">Filters</h3>
            <button onClick={() => setFiltersOpen(false)}><X size={22} /></button>
          </div>
          <div className="mt-6 lg:mt-0">
            <h3 className="font-display text-lg text-forest">Categories</h3>
            <ul className="mt-3 space-y-1">
              <li>
                <button
                  onClick={() => { setParam('category', null); setFiltersOpen(false) }}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm ${!category ? 'bg-forest text-cream font-semibold' : 'hover:bg-parchment'}`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((c) => (
                <li key={c._id}>
                  <button
                    onClick={() => { setParam('category', c.slug); setFiltersOpen(false) }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                      category === c.slug ? 'bg-forest text-cream font-semibold' : 'hover:bg-parchment'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs opacity-70">{c.productCount}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-parchment" />
              ))}
            </div>
          ) : (
            <>
              <ProductGrid products={products} />
              <div className="mt-10">
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  onChange={(p) => setParam('page', String(p))}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-wide py-12">Loading…</div>}>
      <ShopContent />
    </Suspense>
  )
}
