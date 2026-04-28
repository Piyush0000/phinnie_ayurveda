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
import PaymentButton from './PaymentButton'

export default function CheckoutForm() {
  const router = useRouter()
  const items = useCartStore((s) => s.items)
  const coupon = useCartStore((s) => s.coupon)
  const subtotal = useCartStore((s) => s.getSubtotal())
  const discount = useCartStore((s) => s.getDiscount())
  const shipping = useCartStore((s) => s.getShipping())
  const tax = useCartStore((s) => s.getTax())
  const total = useCartStore((s) => s.getTotal())
  const applyCoupon = useCartStore((s) => s.applyCoupon)
  const removeCoupon = useCartStore((s) => s.removeCoupon)
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null)
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
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shippingAddress: data,
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          couponCode: coupon?.code,
          notes,
        }),
      })
      const result = await res.json()
      if (!res.ok) {
        toast.error(result.error || 'Could not create order')
        return
      }
      setCreatedOrderId(result.orderId)
      toast.success('Order created! Complete payment to confirm.')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create order')
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

        {!createdOrderId && (
          <Button type="submit" loading={loading} size="lg" className="w-full">
            Continue to Payment
          </Button>
        )}
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
          <div className="flex justify-between"><dt className="text-warmgray">Tax (18% GST)</dt><dd>{formatPrice(tax)}</dd></div>
          <div className="mt-3 flex justify-between border-t border-forest/10 pt-3 text-base font-bold text-forest">
            <dt>Total</dt><dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        {createdOrderId && (
          <div className="mt-6">
            <PaymentButton orderId={createdOrderId} />
            <p className="mt-2 text-center text-xs text-warmgray">
              Secured by Razorpay · UPI · Cards · Netbanking
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
