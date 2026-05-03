'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export default function CartPage() {
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const discount = useCartStore((s) => s.getDiscount())
  const shipping = useCartStore((s) => s.getShipping())
  const total = useCartStore((s) => s.getTotal())
  const config = useCartStore((s) => s.config)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) return <div className="container-wide py-12">Loading…</div>

  if (items.length === 0) {
    return (
      <div className="container-wide py-20 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-parchment">
          <ShoppingBag size={36} className="text-warmgray" />
        </div>
        <h1 className="mt-6 font-display text-4xl text-charcoal">Your cart is empty</h1>
        <p className="mt-2 text-warmgray">Discover handcrafted Ayurvedic wellness products in our shop.</p>
        <Link href="/shop" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-forest px-7 py-3 font-semibold text-cream hover:bg-forest-600">
          Browse Shop <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  const remaining = Math.max(0, config.freeShippingMin - subtotal)

  return (
    <div className="container-wide py-8 md:py-12">
      <h1 className="font-display text-4xl text-charcoal md:text-5xl">Your Cart</h1>
      {remaining > 0 && (
        <p className="mt-3 rounded-lg bg-turmeric-50 px-4 py-2 text-sm text-charcoal">
          Add <strong>{formatPrice(remaining)}</strong> more for FREE shipping
        </p>
      )}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr,1fr]">
        <ul className="divide-y divide-forest/10 rounded-2xl border border-forest/10 bg-cream shadow-warm">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 p-5">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-parchment">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                )}
              </div>
              <div className="flex flex-1 flex-col">
                <Link href={`/shop/${item.slug}`} className="font-display text-lg text-charcoal hover:text-forest">
                  {item.name}
                </Link>
                <span className="text-forest">{formatPrice(item.price)}</span>
                <div className="mt-auto flex items-center justify-between">
                  <div className="inline-flex items-center rounded-lg border border-warmgray/30">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="p-2 hover:bg-parchment">
                      <Minus size={14} />
                    </button>
                    <span className="min-w-10 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="p-2 hover:bg-parchment disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="inline-flex items-center gap-1 text-xs text-terracotta hover:text-terracotta-700"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
              <div className="shrink-0 font-bold text-charcoal">{formatPrice(item.price * item.quantity)}</div>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-2xl border border-forest/10 bg-parchment/50 p-6">
          <h2 className="font-display text-2xl text-forest">Order Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            {discount > 0 && <div className="flex justify-between text-terracotta"><dt>Discount</dt><dd>-{formatPrice(discount)}</dd></div>}
            <div className="flex justify-between"><dt>Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
            <div className="mt-3 flex justify-between border-t border-forest/10 pt-3 text-lg font-bold text-forest">
              <dt>Total</dt><dd>{formatPrice(total)}</dd>
            </div>
          </dl>
          <Link
            href="/checkout"
            className="mt-6 flex h-12 items-center justify-center rounded-lg bg-forest font-semibold text-cream shadow-warm hover:bg-forest-600"
          >
            Proceed to Checkout
          </Link>
        </aside>
      </div>
    </div>
  )
}
