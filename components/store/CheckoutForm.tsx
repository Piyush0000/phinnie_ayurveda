'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { addressSchema, type AddressInput } from '@/lib/validations'
import { useCartStore } from '@/store/cartStore'
import { Input, Textarea } from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void; on: (e: string, cb: () => void) => void }
  }
}

interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description?: string
  order_id: string
  prefill?: { name?: string; email?: string; contact?: string }
  theme?: { color?: string }
  handler?: (response: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }) => void
  modal?: { ondismiss?: () => void }
}

const RAZORPAY_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if (window.Razorpay) return resolve(true)
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(true))
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CheckoutForm() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const coupon = useCartStore((s) => s.coupon)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const discount = useCartStore((s) => s.getDiscount())
  const shipping = useCartStore((s) => s.getShipping())
  const total = useCartStore((s) => s.getTotal())
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)
  const clearCart = useCartStore((s) => s.clearCart)
  const [loading, setLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [notes, setNotes] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
  })

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: couponCode, subtotal }),
    })
    const data = await res.json()
    if (!res.ok) return toast.error(data.error || 'Invalid coupon')
    applyCoupon(data)
    toast.success(`Coupon ${data.code} applied!`)
  }

  const onSubmit = async (data: AddressInput) => {
    if (items.length === 0) {
      toast.error('Cart is empty')
      router.push('/shop')
      return
    }
    setLoading(true)
    try {
      const ok = await loadRazorpay()
      if (!ok) {
        toast.error('Could not load Razorpay. Check your internet connection.')
        return
      }

      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: data,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode: coupon?.code,
          notes,
        }),
      })
      const orderData = await orderRes.json()
      if (!orderRes.ok) {
        toast.error(orderData.error || 'Could not create order')
        return
      }
      const orderId: string = orderData.orderId

      const payRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const payData = await payRes.json()
      if (!payRes.ok) {
        toast.error(payData.error || 'Could not start payment')
        return
      }

      const options: RazorpayOptions = {
        key: payData.keyId,
        amount: Number(payData.amount),
        currency: payData.currency,
        name: 'Thinnie Aurvadic',
        description: 'Authentic Ayurvedic Products',
        order_id: payData.razorpayOrderId,
        prefill: payData.customer,
        theme: { color: '#2D5016' },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled', { icon: '🙏' })
            setLoading(false)
          },
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderId, ...response }),
            })
            const verifyData = await verifyRes.json()
            if (!verifyRes.ok) {
              toast.error(verifyData.error || 'Payment verification failed')
              return
            }
            clearCart()
            toast.success('Payment successful!')
            router.push(`/order-confirmation/${verifyData.orderNumber}`)
          } catch {
            toast.error('Payment verification failed')
          }
        },
      }

      const rp = new window.Razorpay!(options)
      rp.open()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not start checkout')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.5fr,1fr]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-forest/10 bg-cream p-6 shadow-warm md:p-8">
        <div>
          <h2 className="font-display text-2xl text-forest">Shipping Details</h2>
          <p className="mt-1 text-sm text-warmgray">Where should we ship your order?</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Full Name" placeholder="As on ID" error={errors.name?.message} {...register('name')} />
          <Input label="Phone" type="tel" placeholder="10-digit number" error={errors.phone?.message} {...register('phone')} />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            error={errors.email?.message}
            className="md:col-span-2"
            {...register('email')}
          />
          <Input
            label="Address Line 1"
            placeholder="House No, Street"
            error={errors.line1?.message}
            className="md:col-span-2"
            {...register('line1')}
          />
          <Input
            label="Address Line 2 (Optional)"
            placeholder="Landmark, Area"
            error={errors.line2?.message}
            className="md:col-span-2"
            {...register('line2')}
          />
          <Input label="City" placeholder="City" error={errors.city?.message} {...register('city')} />
          <Input label="State" placeholder="State" error={errors.state?.message} {...register('state')} />
          <Input label="Pincode" placeholder="6-digit pincode" error={errors.pincode?.message} {...register('pincode')} />
        </div>

        <Textarea
          label="Order Notes (Optional)"
          placeholder="Any special instructions?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />

        <Button type="submit" loading={loading} size="lg" className="w-full">
          Pay Now with Razorpay
        </Button>
        <p className="text-center text-xs text-warmgray">
          Secured by Razorpay · UPI · Cards · Netbanking
        </p>
      </form>

      <aside className="rounded-2xl border border-forest/10 bg-parchment/50 p-6 md:p-8">
        <h3 className="font-display text-2xl text-forest">Order Summary</h3>
        <ul className="mt-4 divide-y divide-forest/10">
          {items.map((i) => (
            <li key={i.productId} className="flex justify-between py-2.5 text-sm">
              <span className="line-clamp-1 pr-2 text-charcoal">
                {i.name} <span className="text-warmgray">× {i.quantity}</span>
              </span>
              <span className="shrink-0 font-semibold">{formatPrice(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex gap-2">
          {!coupon ? (
            <>
              <input
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="flex-1 rounded-lg border border-warmgray/30 bg-cream px-3 py-2 text-sm outline-none focus:border-forest"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="rounded-lg border-2 border-forest px-4 text-sm font-semibold text-forest hover:bg-forest hover:text-cream"
              >
                Apply
              </button>
            </>
          ) : (
            <div className="flex w-full items-center justify-between rounded-lg bg-turmeric-50 px-3 py-2">
              <span className="text-sm font-semibold text-turmeric-700">{coupon.code} applied</span>
              <button type="button" onClick={removeCoupon} className="text-xs text-terracotta hover:underline">
                Remove
              </button>
            </div>
          )}
        </div>
        <dl className="mt-5 space-y-1.5 border-t border-forest/10 pt-4 text-sm">
          <div className="flex justify-between"><dt className="text-warmgray">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          {discount > 0 && (
            <div className="flex justify-between text-terracotta">
              <dt>Discount</dt><dd>-{formatPrice(discount)}</dd>
            </div>
          )}
          <div className="flex justify-between"><dt className="text-warmgray">Shipping</dt><dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd></div>
          <div className="mt-3 flex justify-between border-t border-forest/10 pt-3 text-base font-bold text-forest">
            <dt>Total</dt><dd>{formatPrice(total)}</dd>
          </div>
        </dl>
      </aside>
    </div>
  )
}
