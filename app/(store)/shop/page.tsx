'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Search, X } from 'lucide-react'
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
}

function ShopContent() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const [products, setProducts] = useState<Product[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const search = sp.get('search') ?? ''
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
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set('search', search)
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
  }, [search, sort, page])

  return (
    <div className="container-wide py-8 md:py-12">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl text-charcoal md:text-5xl">Shop All Products</h1>
        <p className="mt-2 font-accent text-lg text-warmgray">
          Authentic Ayurvedic wellness products, handcrafted with care
        </p>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray" />
          <input
            value={search}
            onChange={(e) => setParam('search', e.target.value)}
            placeholder="Search wellness products, herbs, brands..."
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
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
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
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="container-wide py-12">Loading…</div>}>
      <ShopContent />
    </Suspense>
  )
}
