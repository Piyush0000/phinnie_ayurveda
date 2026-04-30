'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminHeader from '@/components/admin/AdminHeader'
import Badge from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'

interface Product {
  _id: string
  name: string
  slug: string
  price: number
  comparePrice?: number
  stock: number
  images: string[]
  categoryName: string
  isActive: boolean
  isFeatured: boolean
  rating: number
  soldCount: number
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams({ limit: '100', includeInactive: 'true' })
    if (search) params.set('search', search)
    const res = await fetch(`/api/products?${params.toString()}`)
    const data = await res.json()
    setProducts(data.products ?? [])
    setLoading(false)
  }

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [search])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || 'Could not delete')
      return
    }
    toast.success('Product deleted')
    load()
  }

  return (
    <>
      <AdminHeader title="Products" />
      <div className="p-6 lg:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-warmgray" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="h-10 w-full rounded-lg border border-warmgray/30 bg-cream pl-10 pr-3 outline-none focus:border-forest"
            />
          </div>
          <Link
            href="/admin/products/new"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-forest px-5 font-semibold text-cream hover:bg-forest-600"
          >
            <Plus size={16} /> Add Product
          </Link>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-forest/10 bg-cream shadow-warm">
          <table className="w-full text-sm">
            <thead className="border-b border-forest/10 bg-parchment/40 text-left text-xs uppercase text-warmgray">
              <tr>
                <th className="py-3 pl-4 pr-2">Product</th>
                <th className="py-3 pr-2">Category</th>
                <th className="py-3 pr-2">Price</th>
                <th className="py-3 pr-2">Stock</th>
                <th className="py-3 pr-2">Status</th>
                <th className="py-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-12 text-center text-warmgray">Loading…</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-warmgray">No products yet</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id} className="border-b border-forest/5">
                    <td className="py-3 pl-4 pr-2">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-parchment">
                          {p.images[0] && (
                            <Image
                              src={p.images[0]}
                              alt={p.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link href={`/admin/products/${p._id}/edit`} className="line-clamp-1 font-semibold text-charcoal hover:text-forest">
                            {p.name}
                          </Link>
                          <div className="text-xs text-warmgray">{p.soldCount} sold</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-2 text-charcoal">{p.categoryName}</td>
                    <td className="py-3 pr-2 font-semibold">{formatPrice(p.price)}</td>
                    <td className="py-3 pr-2">
                      <span className={p.stock < 10 ? 'font-semibold text-terracotta' : ''}>{p.stock}</span>
                    </td>
                    <td className="py-3 pr-2">
                      <div className="flex flex-wrap gap-1">
                        <Badge variant={p.isActive ? 'success' : 'neutral'}>
                          {p.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        {p.isFeatured && <Badge variant="warning">Featured</Badge>}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${p._id}/edit`}
                          className="rounded-lg border border-warmgray/30 p-2 hover:bg-parchment"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="rounded-lg border border-warmgray/30 p-2 text-terracotta hover:bg-terracotta-50"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
