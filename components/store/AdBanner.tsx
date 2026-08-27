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
    <section className="relative bg-forest-900 text-cream min-h-[600px] sm:min-h-[650px] md:min-h-[700px] lg:min-h-[800px] overflow-hidden">
      {/* Video-like background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-forest-900/90 via-forest-900/75 to-forest-900/90" aria-hidden />
      
      {/* Balloon Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-16 left-[3%] w-8 h-12 sm:w-10 sm:h-14 md:w-12 md:h-16 lg:w-16 lg:h-20 rounded-full bg-gradient-to-b from-red-400 to-red-600 opacity-60"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-6 sm:h-8 bg-red-300" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -25, 0], rotate: [0, -5, 5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-24 right-[5%] w-6 h-10 sm:w-8 sm:h-12 md:w-10 md:h-14 lg:w-14 lg:h-18 rounded-full bg-gradient-to-b from-blue-400 to-blue-600 opacity-60"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-4 sm:h-6 bg-blue-300" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -15, 0], rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-32 left-[10%] w-5 h-8 sm:w-7 sm:h-10 md:w-9 md:h-12 lg:w-12 lg:h-16 rounded-full bg-gradient-to-b from-yellow-400 to-yellow-600 opacity-60"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-3 sm:h-5 bg-yellow-300" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -30, 0], rotate: [0, -3, 3, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="hidden sm:block absolute top-20 right-[15%] w-10 h-14 md:w-14 md:h-18 lg:w-18 lg:h-24 rounded-full bg-gradient-to-b from-pink-400 to-pink-600 opacity-60"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-8 sm:h-10 bg-pink-300" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -18, 0], rotate: [0, 4, -4, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="hidden md:block absolute top-40 left-[20%] w-8 h-12 md:w-10 md:h-14 lg:w-14 lg:h-18 rounded-full bg-gradient-to-b from-green-400 to-green-600 opacity-60"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-5 sm:h-6 bg-green-300" />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -22, 0], rotate: [0, -4, 4, 0] }}
          transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="hidden lg:block absolute top-16 right-[25%] w-9 h-13 md:w-11 md:h-15 lg:w-13 lg:h-17 rounded-full bg-gradient-to-b from-purple-400 to-purple-600 opacity-60"
        >
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-6 sm:h-7 bg-purple-300" />
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-turmeric rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-amber-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-10 left-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 z-20 rounded-full bg-cream/20 backdrop-blur-sm p-2 hover:bg-cream/30 transition-colors"
        aria-label="Close ad"
      >
        <X className="h-6 w-6 text-cream" />
      </button>

      <div className="container-wide relative z-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-8 py-6 md:py-8 lg:py-12 xl:py-16 px-3 sm:px-4">
        <div className="w-full md:w-1/2 flex justify-center relative order-2 md:order-1">
          {/* Floating Ayurvedic Avatars - Hidden on small phones, visible on larger screens */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden sm:block absolute -left-2 md:-left-4 top-1/4 w-14 h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border-3 md:border-4 border-turmeric shadow-xl z-10"
          >
            <img src="/gallery/IMG_20260508_181247_529.jpg" alt="Ayurvedic herbs" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden sm:block absolute -right-2 md:-right-4 top-1/3 w-12 h-12 md:w-16 md:h-20 lg:w-20 lg:h-20 rounded-full overflow-hidden border-3 md:border-4 border-amber-400 shadow-xl z-10"
          >
            <img src="/gallery/IMG_20260508_181247_746.jpg" alt="Natural ingredients" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden md:block absolute left-1/4 -bottom-4 w-14 h-14 md:w-18 md:h-18 rounded-full overflow-hidden border-4 border-emerald-400 shadow-xl z-10"
          >
            <img src="/gallery/IMG_20260508_181247_766.jpg" alt="Ayurvedic products" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative w-full max-w-md"
          >
            <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-turmeric to-amber-500 rounded-2xl md:rounded-3xl blur-xl md:blur-2xl opacity-40" />
            <img
              src="/rakhi-offer.jpeg"
              alt="Raksha Bandhan Special Offer"
              className="relative w-full h-auto object-contain rounded-2xl md:rounded-3xl shadow-2xl border-3 md:border-4 border-turmeric/50"
            />
            <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 bg-gradient-to-r from-turmeric to-amber-500 text-forest-900 px-3 py-1.5 md:px-4 md:py-2 rounded-full font-bold text-sm md:text-lg shadow-lg animate-bounce">
              BUY 3 GET 1 FREE
            </div>
          </motion.div>
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left relative order-1 md:order-2">
          {/* Decorative Ayurvedic Elements - Hidden on mobile */}
          <motion.div 
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hidden md:block absolute -top-8 right-8 w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-turmeric/50 shadow-lg opacity-60"
          >
            <img src="/gallery/IMG_20260508_181258_642.jpg" alt="" className="w-full h-full object-cover" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, rotate: 20 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="hidden md:block absolute top-1/2 -right-6 w-10 h-10 md:w-14 md:h-14 rounded-full overflow-hidden border-2 border-amber-400/50 shadow-lg opacity-50"
          >
            <img src="/gallery/IMG_20260508_181259_026.jpg" alt="" className="w-full h-full object-cover" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="inline-flex items-center gap-2 bg-turmeric/20 backdrop-blur-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 mb-3 md:mb-4 border border-turmeric/30">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-turmeric-300" />
              <span className="text-xs md:text-sm font-semibold uppercase tracking-wider text-turmeric-200">Raksha Bandhan Offer</span>
            </div>

            <h2 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight mb-2 md:mb-3 lg:mb-4">
              <span className="bg-gradient-to-r from-turmeric-200 via-amber-200 to-yellow-200 bg-clip-text text-transparent">
                This Raksha Bandhan
              </span>
              <br />
              <span className="text-cream">Gift Good Health</span>
            </h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-3 md:mb-4 lg:mb-6"
            >
              <p className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-turmeric-200">
                Buy 3 Get 1 Free
              </p>
              <p className="font-display text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-amber-200">
                Worth ₹500
              </p>
            </motion.div>

            <p className="font-accent text-sm sm:text-base md:text-lg lg:text-xl text-cream/90 mb-4 md:mb-6">
              Because their wellness matters the most — gift your sibling a bond of lifelong health
            </p>

            {/* Data Points with Ayurvedic Images */}
            <div className="grid grid-cols-2 gap-2 md:gap-4 mb-4 md:mb-8">
              <div className="bg-cream/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 border border-cream/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 opacity-20">
                  <img src="/gallery/IMG_20260508_181248_388.jpg" alt="" className="w-full h-full object-cover rounded-bl-xl" />
                </div>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 relative z-10">
                  <Star className="h-4 w-4 md:h-5 md:w-5 text-turmeric-300" />
                  <span className="text-lg md:text-2xl font-bold text-cream">4.9/5</span>
                </div>
                <p className="text-xs md:text-sm text-cream/80 relative z-10">10,000+ Happy Customers</p>
              </div>
              <div className="bg-cream/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 border border-cream/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 opacity-20">
                  <img src="/gallery/IMG_20260508_181248_403.jpg" alt="" className="w-full h-full object-cover rounded-bl-xl" />
                </div>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 relative z-10">
                  <Award className="h-4 w-4 md:h-5 md:w-5 text-emerald-400" />
                  <span className="text-lg md:text-2xl font-bold text-cream">100%</span>
                </div>
                <p className="text-xs md:text-sm text-cream/80 relative z-10">Natural Ingredients</p>
              </div>
              <div className="bg-cream/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 border border-cream/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 opacity-20">
                  <img src="/gallery/IMG_20260508_181248_443.jpg" alt="" className="w-full h-full object-cover rounded-bl-xl" />
                </div>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 relative z-10">
                  <Truck className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                  <span className="text-lg md:text-2xl font-bold text-cream">Free</span>
                </div>
                <p className="text-xs md:text-sm text-cream/80 relative z-10">Shipping on ₹999+</p>
              </div>
              <div className="bg-cream/10 backdrop-blur-sm rounded-lg md:rounded-xl p-2 md:p-4 border border-cream/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-12 h-12 md:w-16 md:h-16 opacity-20">
                  <img src="/gallery/IMG_20260508_181248_512.jpg" alt="" className="w-full h-full object-cover rounded-bl-xl" />
                </div>
                <div className="flex items-center gap-1 md:gap-2 mb-1 md:mb-2 relative z-10">
                  <Heart className="h-4 w-4 md:h-5 md:w-5 text-pink-400" />
                  <span className="text-lg md:text-2xl font-bold text-cream">24/7</span>
                </div>
                <p className="text-xs md:text-sm text-cream/80 relative z-10">Customer Support</p>
              </div>
            </div>

            {/* Trust Badges with Product Images */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 mb-4 md:mb-8">
              <div className="flex items-center gap-1 md:gap-2 bg-cream/10 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 border border-cream/20">
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full overflow-hidden border border-emerald-400">
                  <img src="/gallery/IMG_20260508_181259_190.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <Shield className="h-3 w-3 md:h-4 md:w-4 text-emerald-400" />
                <span className="text-[10px] md:text-xs font-semibold text-cream">AYUSH Certified</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-cream/10 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 border border-cream/20">
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full overflow-hidden border border-pink-400">
                  <img src="/gallery/IMG_20260508_181247_891.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <Heart className="h-3 w-3 md:h-4 md:w-4 text-pink-400" />
                <span className="text-[10px] md:text-xs font-semibold text-cream">Cruelty-Free</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 bg-cream/10 backdrop-blur-sm rounded-full px-2 py-1 md:px-3 md:py-1.5 border border-cream/20">
                <div className="w-4 h-4 md:w-6 md:h-6 rounded-full overflow-hidden border border-turmeric-300">
                  <img src="/gallery/IMG_20260508_181247_529.jpg" alt="" className="w-full h-full object-cover" />
                </div>
                <Award className="h-3 w-3 md:h-4 md:w-4 text-turmeric-300" />
                <span className="text-[10px] md:text-xs font-semibold text-cream">Lab Tested</span>
              </div>
            </div>

            {/* Additional Product Showcase - Hidden on small mobile, visible on larger screens */}
            <div className="hidden sm:flex gap-2 md:gap-3 mb-4 md:mb-8 justify-center md:justify-start">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden border-2 border-turmeric/30 shadow-lg"
              >
                <img src="/gallery/IMG_20260508_181247_746.jpg" alt="Ayurvedic product" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden border-2 border-amber-400/30 shadow-lg"
              >
                <img src="/gallery/IMG_20260508_181247_766.jpg" alt="Ayurvedic product" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden border-2 border-emerald-400/30 shadow-lg"
              >
                <img src="/gallery/IMG_20260508_181248_388.jpg" alt="Ayurvedic product" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden border-2 border-pink-400/30 shadow-lg"
              >
                <img src="/gallery/IMG_20260508_181248_403.jpg" alt="Ayurvedic product" className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
              </motion.div>
            </div>

            <Link
              href="/shop"
              className="inline-flex h-12 md:h-14 lg:h-16 items-center gap-2 md:gap-3 rounded-full bg-gradient-to-r from-turmeric via-amber-500 to-yellow-500 px-6 md:px-8 lg:px-10 font-bold text-forest-900 text-base md:text-lg lg:text-xl hover:from-turmeric-400 hover:via-amber-400 hover:to-yellow-400 transition-all duration-300 shadow-xl md:shadow-2xl hover:shadow-3xl transform hover:scale-105 border-2 border-cream/30"
            >
              Shop Now
              <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
            </Link>

            <p className="mt-3 md:mt-4 text-xs md:text-sm text-cream/70">
              *Valid on Raksha Bandhan special purchases. T&C apply.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}