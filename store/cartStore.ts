'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  comparePrice?: number
  image?: string
  quantity: number
  slug: string
  stock: number
}

export interface AppliedCoupon {
  code: string
  type: 'PERCENT' | 'FIXED'
  value: number
  discountAmount: number
}

interface CartConfig {
  freeShippingMin: number
  shippingCharge: number
}

interface CartState {
  items: CartItem[]
  coupon: AppliedCoupon | null
  isOpen: boolean
  config: CartConfig
  addItem: (item: CartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, qty: number) => void
  clearCart: () => void
  applyCoupon: (coupon: AppliedCoupon) => void
  removeCoupon: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setConfig: (cfg: Partial<CartConfig>) => void
  getSubtotal: () => number
  getDiscount: () => number
  getShipping: () => number
  getTax: () => number
  getTotal: () => number
  getItemCount: () => number
}

const DEFAULT_CONFIG: CartConfig = {
  freeShippingMin: 0,
  shippingCharge: 0,
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      isOpen: false,
      config: DEFAULT_CONFIG,

      addItem: (item) => {
        const existing = get().items.find((i) => i.productId === item.productId)
        if (existing) {
          const newQty = Math.min(existing.quantity + item.quantity, item.stock || 99)
          set({
            items: get().items.map((i) =>
              i.productId === item.productId ? { ...i, quantity: newQty } : i,
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },

      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),

      updateQuantity: (productId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) })
          return
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId
              ? { ...i, quantity: Math.min(qty, i.stock || 99) }
              : i,
          ),
        })
      },

      clearCart: () => set({ items: [], coupon: null }),

      applyCoupon: (coupon) => set({ coupon }),
      removeCoupon: () => set({ coupon: null }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      setConfig: (cfg) => set({ config: { ...get().config, ...cfg } }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getDiscount: () => {
        const subtotal = get().getSubtotal()
        const c = get().coupon
        if (!c) return 0
        const raw = c.type === 'PERCENT' ? (subtotal * c.value) / 100 : c.value
        return Math.min(Math.round(raw), subtotal)
      },

      getShipping: () => {
        const { freeShippingMin, shippingCharge } = get().config
        const afterDiscount = get().getSubtotal() - get().getDiscount()
        if (afterDiscount <= 0) return 0
        return afterDiscount >= freeShippingMin ? 0 : shippingCharge
      },

      getTax: () => 0,

      getTotal: () => {
        const subtotal = get().getSubtotal()
        const discount = get().getDiscount()
        const shipping = get().getShipping()
        return Math.max(0, subtotal - discount + shipping)
      },

      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: 'thinnie-cart',
      partialize: (state) => ({
        items: state.items,
        coupon: state.coupon,
      }),
    },
  ),
)
