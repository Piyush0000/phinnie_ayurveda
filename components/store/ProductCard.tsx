'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingBag, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { formatPrice, calculateDiscount, cn } from '@/lib/utils'
import StarRating from './StarRating'

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

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const wishlistHas = useWishlistStore((s) => s.has)
  const wishlistToggle = useWishlistStore((s) => s.toggle)
  const liked = wishlistHas(product._id)
  const discount = calculateDiscount(product.price, product.comparePrice)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (product.stock <= 0) {
      toast.error('Out of stock')
      return
    }
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.images[0],
      quantity: 1,
      slug: product.slug,
      stock: product.stock,
    })
    toast.success('Added to cart')
    openCart()
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    wishlistToggle(product._id)
    toast.success(liked ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-cream shadow-warm transition hover:-translate-y-0.5 hover:shadow-warm-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-parchment">
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-warmgray">No image</div>
        )}
        {discount && (
          <span className="absolute left-3 top-3 rounded-full bg-terracotta px-2.5 py-1 text-[11px] font-bold text-cream">
            {discount}% OFF
          </span>
        )}
        {product.stock <= 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-charcoal/80 px-2.5 py-1 text-[11px] font-bold text-cream">
            Sold Out
          </span>
        )}
        <button
          onClick={handleWishlist}
          aria-label="Add to wishlist"
          className={cn(
            'absolute right-3 top-3 rounded-full bg-cream/90 p-2 text-charcoal opacity-0 shadow-warm transition hover:bg-cream group-hover:opacity-100',
            product.stock <= 0 && 'top-12',
          )}
        >
          <Heart size={16} className={liked ? 'fill-terracotta text-terracotta' : ''} />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {product.categoryName && (
          <div className="text-[11px] uppercase tracking-wider text-turmeric-700">
            {product.categoryName}
          </div>
        )}
        <h3 className="font-display text-lg leading-tight text-charcoal line-clamp-2">
          {product.name}
        </h3>
        {product.shortDesc && (
          <p className="text-xs text-warmgray line-clamp-2">{product.shortDesc}</p>
        )}
        <StarRating value={product.rating} count={product.reviewCount} size={14} />
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-bold text-forest">{formatPrice(product.price)}</span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-sm text-warmgray line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={product.stock <= 0}
          className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-forest py-2 text-sm font-semibold text-cream transition hover:bg-forest-600 disabled:opacity-40"
        >
          <ShoppingBag size={14} /> Add to Cart
        </button>
      </div>
    </Link>
  )
}
