'use client'

import { useEffect, useState } from 'react'
import { X, Sparkles, Leaf } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_HEADLINES = ['This Raksha Bandhan — Buy 3 Get 1 Free, Worth ₹500']

interface StripPromotion {
  title: string
  ctaText?: string
  ctaLink?: string
}

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [promos, setPromos] = useState<StripPromotion[] | null>(null)

  useEffect(() => {
    setMounted(true)
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem('promo-banner-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const now = Date.now()
      // Show again after 24 hours
      if (now - dismissedTime < 24 * 60 * 60 * 1000) {
        setIsVisible(false)
      }
    }
    fetch('/api/promotions?placement=STRIP')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setPromos(data?.promotions?.length ? data.promotions : null))
      .catch(() => setPromos(null))
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('promo-banner-dismissed', Date.now().toString())
  }

  if (!mounted || !isVisible) return null

  const headlines = promos?.length ? promos.map((p) => p.title) : DEFAULT_HEADLINES
  const ctaText = promos?.[0]?.ctaText || 'Shop Now'
  const ctaLink = promos?.[0]?.ctaLink || '/shop'

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-forest via-forest/95 to-turmeric/90 text-cream">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.4%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%27%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      <div className="container-wide relative py-2.5 md:py-3">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex items-center gap-10" aria-hidden={i === 1}>
                  {Array.from({ length: 4 }).map((_, j) =>
                    headlines.map((headline, k) => (
                      <span key={`${j}-${k}`} className="flex items-center gap-2 font-display text-base font-bold md:text-lg">
                        <Sparkles className="h-4 w-4 text-turmeric-300 md:h-5 md:w-5" />
                        {headline}
                      </span>
                    )),
                  )}
                </div>
              ))}
            </div>
          </div>

          <Link
            href={ctaLink}
            className="hidden shrink-0 items-center gap-2 rounded-full bg-cream px-5 py-2 font-semibold text-forest transition hover:bg-parchment hover:scale-105 md:inline-flex"
          >
            <Leaf className="h-4 w-4" />
            {ctaText}
          </Link>

          <button
            onClick={handleDismiss}
            className="shrink-0 rounded-full p-1.5 hover:bg-cream/20 transition-colors"
            aria-label="Close banner"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Mobile CTA */}
        <div className="mt-2 text-center md:hidden">
          <Link
            href={ctaLink}
            className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2 font-semibold text-forest transition hover:bg-parchment"
          >
            <Leaf className="h-4 w-4" />
            {ctaText}
          </Link>
        </div>
      </div>
    </div>
  )
}
