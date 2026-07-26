'use client'

import { useEffect, useState } from 'react'
import { X, Sparkles, Leaf } from 'lucide-react'
import Link from 'next/link'

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

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
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('promo-banner-dismissed', Date.now().toString())
  }

  if (!mounted || !isVisible) return null

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-forest via-forest/95 to-turmeric/90 text-cream">
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23ffffff%27 fill-opacity=%270.4%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%27%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </div>

      <div className="container-wide relative py-4 md:py-6">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Main offer */}
          <div className="flex flex-1 items-center gap-3 md:gap-4">
            <div className="hidden md:flex h-12 w-12 items-center justify-center rounded-full bg-cream/20 backdrop-blur-sm">
              <Sparkles className="h-6 w-6 text-cream" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-bold md:text-xl">
                  MONSOON WELLNESS SALE
                </span>
                <span className="rounded-full bg-terracotta px-2 py-0.5 text-xs font-bold md:text-sm">
                  30% OFF
                </span>
              </div>
              <p className="text-xs md:text-sm opacity-90">
                Boost your immunity this season with authentic Ayurvedic products
              </p>
            </div>
          </div>

          {/* Middle - Call to action */}
          <div className="hidden md:block flex-1 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-cream px-6 py-2 font-semibold text-forest transition hover:bg-parchment hover:scale-105"
            >
              <Leaf className="h-4 w-4" />
              Shop Now
            </Link>
          </div>

          {/* Right side - Timer and dismiss */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs opacity-75">Limited Time Offer</div>
              <div className="font-display font-bold">Ends Soon</div>
            </div>
            <button
              onClick={handleDismiss}
              className="rounded-full p-1.5 hover:bg-cream/20 transition-colors"
              aria-label="Close banner"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-3 text-center md:hidden">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2 font-semibold text-forest transition hover:bg-parchment"
          >
            <Leaf className="h-4 w-4" />
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}
