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
}

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-warmgray/30 bg-parchment/50 p-12 text-center">
        <p className="font-display text-xl text-charcoal">No products found</p>
        <p className="mt-2 text-sm text-warmgray">Try a different search.</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  )
}
