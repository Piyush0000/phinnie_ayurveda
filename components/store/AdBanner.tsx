'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import Link from 'next/link'

export default function AdBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if user has dismissed the banner before
    const dismissed = localStorage.getItem('ad-banner-dismissed')
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
    localStorage.setItem('ad-banner-dismissed', Date.now().toString())
  }

  if (!mounted || !isVisible) return null

  return (
    <section className="relative bg-gradient-to-r from-forest via-emerald-700 to-teal-600 text-cream min-h-[600px] md:min-h-[700px]">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 z-10 rounded-full bg-cream/20 p-2 hover:bg-cream/30 transition-colors"
        aria-label="Close ad"
      >
        <X className="h-6 w-6 text-cream" />
      </button>
      <div className="container-wide flex flex-col md:flex-row items-center justify-center gap-8 py-16 md:py-20">
        <div className="w-full md:w-1/2 flex justify-center">
          <img 
            src="/ad.jpeg" 
            alt="Special Promotion" 
            className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-3xl shadow-2xl border-4 border-turmeric-400"
          />
        </div>
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="text-base uppercase tracking-widest text-turmeric-300 mb-4">✨ Special Offer ✨</p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            First Order? Save 15%
          </h2>
          <p className="mt-6 font-accent text-xl md:text-2xl text-cream/90">
            Use code <strong className="text-turmeric-300 text-2xl md:text-3xl">WELCOME15</strong> at checkout
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-14 items-center rounded-full bg-gradient-to-r from-turmeric to-amber-500 px-8 font-bold text-charcoal text-lg hover:from-amber-400 hover:to-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Shop Now →
          </Link>
        </div>
      </div>
    </section>
  )
}