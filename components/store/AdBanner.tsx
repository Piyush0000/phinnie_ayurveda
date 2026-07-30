'use client'

import { useEffect, useState } from 'react'
import { X, Sparkles, Award, Truck, Heart, Shield, Star } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

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
    <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white min-h-[700px] md:min-h-[800px] overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 z-20 rounded-full bg-white/20 backdrop-blur-sm p-2 hover:bg-white/30 transition-colors"
        aria-label="Close ad"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      <div className="container-wide relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 py-12 md:py-16">
        <div className="w-full md:w-1/2 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-3xl blur-2xl opacity-40" />
            <img 
              src="/ad.jpeg" 
              alt="Special Promotion" 
              className="relative w-full h-[350px] md:h-[450px] lg:h-[550px] object-cover rounded-3xl shadow-2xl border-4 border-white/50"
            />
            <div className="absolute -top-4 -right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg animate-bounce">
              50% OFF
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Sparkles className="h-5 w-5 text-yellow-300" />
              <span className="text-sm font-semibold uppercase tracking-wider">Limited Time Offer</span>
            </div>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4">
              <span className="bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                First Order?
              </span>
              <br />
              <span className="text-white">Save 15%</span>
            </h2>
            
            <p className="font-accent text-xl md:text-2xl text-white/90 mb-6">
              Use code <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-lg font-bold text-2xl mx-1">WELCOME15</span> at checkout
            </p>

            {/* Data Points */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className="text-2xl font-bold">4.9/5</span>
                </div>
                <p className="text-sm text-white/80">10,000+ Happy Customers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="h-5 w-5 text-green-400" />
                  <span className="text-2xl font-bold">100%</span>
                </div>
                <p className="text-sm text-white/80">Natural Ingredients</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5 text-blue-400" />
                  <span className="text-2xl font-bold">Free</span>
                </div>
                <p className="text-sm text-white/80">Shipping on ₹999+</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="h-5 w-5 text-pink-400" />
                  <span className="text-2xl font-bold">24/7</span>
                </div>
                <p className="text-sm text-white/80">Customer Support</p>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-8">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <Shield className="h-4 w-4 text-green-400" />
                <span className="text-xs font-semibold">AYUSH Certified</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <Heart className="h-4 w-4 text-pink-400" />
                <span className="text-xs font-semibold">Cruelty-Free</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <Award className="h-4 w-4 text-yellow-400" />
                <span className="text-xs font-semibold">Lab Tested</span>
              </div>
            </div>

            <Link
              href="/shop"
              className="inline-flex h-16 items-center gap-3 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 px-10 font-bold text-white text-xl hover:from-yellow-300 hover:via-orange-400 hover:to-pink-400 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 border-2 border-white/30"
            >
              Shop Now
              <Sparkles className="h-5 w-5" />
            </Link>

            <p className="mt-4 text-sm text-white/70">
              *Valid on first purchase only. T&C apply.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}