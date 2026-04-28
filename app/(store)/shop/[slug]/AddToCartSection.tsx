'use client'

import { useState } from 'react'
import { ShoppingBag, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import QuantitySelector from '@/components/store/QuantitySelector'
import Button from '@/components/ui/Button'

interface Props {
  product: {
    _id: string
    name: string
    price: number
    comparePrice?: number
    image?: string
    slug: string
    stock: number
  }
}

export default function AddToCartSection({ product }: Props) {
  const [qty, setQty] = useState(1)
  const addItem = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const wishlistHas = useWishlistStore((s) => s.has)
  const wishlistToggle = useWishlistStore((s) => s.toggle)
  const liked = wishlistHas(product._id)

  const handleAdd = () => {
    if (product.stock <= 0) {
      toast.error('Out of stock')
      return
    }
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.image,
      quantity: qty,
      slug: product.slug,
      stock: product.stock,
    })
    toast.success(`${product.name} added to cart`)
    openCart()
  }

  return (
    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
      <QuantitySelector value={qty} max={Math.max(1, product.stock)} onChange={setQty} />
      <Button onClick={handleAdd} size="lg" disabled={product.stock <= 0} className="flex-1">
        <ShoppingBag size={16} />
        {product.stock <= 0 ? 'Sold Out' : 'Add to Cart'}
      </Button>
      <Button
        variant="outline"
        size="lg"
        onClick={() => {
          wishlistToggle(product._id)
          toast.success(liked ? 'Removed from wishlist' : 'Saved to wishlist')
        }}
        className="px-4"
      >
        <Heart size={16} className={liked ? 'fill-terracotta text-terracotta' : ''} />
      </Button>
    </div>
  )
}
