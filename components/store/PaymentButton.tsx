'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { useCartStore } from '@/store/cartStore'

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

interface Props {
  orderId: string
  className?: string
  children?: React.ReactNode
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

export default function PaymentButton({ orderId, className, children }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const clearCart = useCartStore((s) => s.clearCart)

  const handlePay = async () => {
    setLoading(true)
    try {
      const ok = await loadRazorpay()
      if (!ok) {
        toast.error('Could not load Razorpay. Check your internet connection.')
        return
      }

      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error || 'Could not create payment')
        return
      }

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: Number(data.amount),
        currency: data.currency,
        name: 'Phinnie Aurvadic',
        description: 'Authentic Ayurvedic Products',
        order_id: data.razorpayOrderId,
        prefill: data.customer,
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
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className={
        className ??
        'flex h-12 w-full items-center justify-center rounded-lg bg-forest font-semibold text-cream shadow-warm hover:bg-forest-600 disabled:opacity-50'
      }
    >
      {loading ? 'Processing…' : children ?? 'Pay Now'}
    </button>
  )
}
