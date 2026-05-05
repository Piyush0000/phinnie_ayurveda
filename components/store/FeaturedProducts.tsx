import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProductCard from './ProductCard'

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

export default function FeaturedProducts({ products }: { products: Product[] }) {
  return (
    <section className="container-wide py-16 md:py-20">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-turmeric-700">Bestsellers</p>
          <h2 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Featured Wellness Products</h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:text-forest-600"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  )
}
