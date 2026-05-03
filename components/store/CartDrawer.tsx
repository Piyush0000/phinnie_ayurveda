'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const shipping = useCartStore((s) => s.getShipping())
  const config = useCartStore((s) => s.config)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  const remainingForFree = Math.max(0, config.freeShippingMin - subtotal)

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-charcoal/50" onClick={closeCart} aria-hidden />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-warm-lg animate-fade-in">
        <header className="flex items-center justify-between border-b border-forest/10 px-5 py-4">
          <h2 className="flex items-center gap-2 font-display text-2xl text-forest">
            <ShoppingBag size={20} /> Your Cart
          </h2>
          <button onClick={closeCart} className="rounded-full p-1.5 hover:bg-parchment">
            <X size={20} />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-parchment">
              <ShoppingBag size={32} className="text-warmgray" />
            </div>
            <p className="font-display text-xl text-charcoal">Your cart is empty</p>
            <p className="text-sm text-warmgray">
              Discover authentic Ayurvedic wellness products in our shop.
            </p>
            <Link
              onClick={closeCart}
              href="/shop"
              className="mt-2 inline-flex items-center rounded-lg bg-forest px-6 py-2.5 font-semibold text-cream hover:bg-forest-600"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <>
            {remainingForFree > 0 && (
              <div className="border-b border-forest/10 bg-turmeric-50 px-5 py-3 text-center text-xs text-charcoal">
                Add <strong>{formatPrice(remainingForFree)}</strong> more for{' '}
                <strong>FREE shipping</strong>
              </div>
            )}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-5 py-4">
              <ul className="divide-y divide-forest/10">
                {items.map((item) => (
                  <li key={item.productId} className="flex gap-3 py-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-parchment">
                      {item.image && (
                        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <Link
                        href={`/shop/${item.slug}`}
                        onClick={closeCart}
                        className="line-clamp-2 font-semibold text-charcoal hover:text-forest"
                      >
                        {item.name}
                      </Link>
                      <span className="text-sm text-forest">{formatPrice(item.price)}</span>
                      <div className="mt-auto flex items-center justify-between">
                        <div className="inline-flex items-center rounded-lg border border-warmgray/30 bg-cream">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="p-1.5 hover:bg-parchment"
                            aria-label="Decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="p-1.5 hover:bg-parchment disabled:opacity-40"
                            aria-label="Increase"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-xs text-terracotta hover:text-terracotta-700"
                          aria-label="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <footer className="border-t border-forest/10 bg-parchment/50 px-5 py-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-warmgray">Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-warmgray">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'Free' : formatPrice(shipping)}
                  </span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 flex h-12 items-center justify-center rounded-lg bg-forest font-semibold text-cream shadow-warm hover:bg-forest-600"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-2 block text-center text-sm text-warmgray hover:text-forest"
              >
                View full cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  )
}
