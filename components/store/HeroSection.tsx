'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-forest-900 text-cream">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/media/egge.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/brand-story.png"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest-900/80 via-forest-900/55 to-forest-900/85" aria-hidden />
      <div className="absolute inset-0 bg-grain opacity-30 mix-blend-overlay" aria-hidden />

      <div className="container-wide relative grid min-h-[88vh] items-center py-24 md:py-32">
        <div className="max-w-3xl">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 rounded-full border border-turmeric/40 bg-cream/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-turmeric-200 backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-turmeric" />
            Phinnie Ayurveda · Rooted in Tradition
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-5xl leading-[1.05] text-cream md:text-7xl lg:text-[5.5rem]"
          >
            The wisdom of <span className="italic text-turmeric-200">Ayurveda</span>,
            <br className="hidden md:block" /> bottled with intention.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 max-w-2xl font-accent text-xl leading-relaxed text-cream/85 md:text-2xl"
          >
            Cold-pressed oils, slow-cooked rasayanas, and time-honoured formulas — handcrafted
            in small batches for your body, your skin, and your everyday ritual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/shop"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-turmeric px-7 font-semibold text-charcoal shadow-warm-lg transition hover:bg-turmeric-400"
            >
              Shop Collection
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center rounded-full border border-cream/40 px-7 font-semibold text-cream backdrop-blur transition hover:bg-cream hover:text-forest"
            >
              Our Story
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.7 }}
            className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.2em] text-cream/70"
          >
            <span>✦ 100% Natural</span>
            <span>✦ Cruelty-Free</span>
            <span>✦ AYUSH Certified</span>
            <span>✦ Small-Batch Crafted</span>
          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cream/60 md:flex">
        <span className="h-px w-10 bg-cream/40" />
        Scroll
        <span className="h-px w-10 bg-cream/40" />
      </div>
    </section>
  )
}
