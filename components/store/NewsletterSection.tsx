'use client'

import { useState } from 'react'
import { Mail } from 'lucide-react'
import toast from 'react-hot-toast'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <section className="container-wide py-12">
      <div className="overflow-hidden rounded-3xl bg-forest p-8 text-cream shadow-warm-lg md:p-14">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-turmeric-300">Join the family</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl">Wisdom in your inbox</h2>
            <p className="mt-3 max-w-md font-accent text-lg text-cream/80">
              Receive Ayurvedic rituals, herbal recipes, and exclusive offers — straight from our vaidyas.
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!email.includes('@')) {
                toast.error('Please enter a valid email')
                return
              }
              setLoading(true)
              setTimeout(() => {
                setLoading(false)
                toast.success("Subscribed! Welcome to the Thinnie family.")
                setEmail('')
              }, 600)
            }}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 w-full rounded-lg bg-cream/10 pl-11 pr-4 text-cream placeholder:text-cream/50 ring-1 ring-cream/20 outline-none focus:bg-cream/20 focus:ring-turmeric"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="h-12 rounded-lg bg-turmeric px-7 font-semibold text-charcoal hover:bg-turmeric-400 disabled:opacity-50"
            >
              {loading ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
