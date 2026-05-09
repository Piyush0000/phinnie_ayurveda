'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import Reveal from './Reveal'

type MediaItem = {
  src: string
  type: 'image' | 'video'
  alt: string
  span: string
}

const ITEMS: MediaItem[] = [
  { src: '/gallery/IMG_20260508_181247_529.jpg', type: 'image', alt: 'Thinnie Ayurveda — handcrafted ritual', span: 'md:col-span-2 md:row-span-2' },
  { src: '/gallery/VID_20260508_181239_230.mp4', type: 'video', alt: 'SLim and Saane in motion', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181247_746.jpg', type: 'image', alt: 'Slow-cooked the bilona way', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181247_766.jpg', type: 'image', alt: 'Heritage herbs', span: 'md:col-span-1 md:row-span-2' },
  { src: '/gallery/VID_20260508_181239_640.mp4', type: 'video', alt: 'Texture pour', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181247_891.jpg', type: 'image', alt: 'Stone-ground roots', span: 'md:col-span-2 md:row-span-1' },
  { src: '/gallery/VID_20260508_181239_961.mp4', type: 'video', alt: 'Bottling SLim and Saane', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181248_388.jpg', type: 'image', alt: 'Herbal infusion', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181248_403.jpg', type: 'image', alt: 'Daily ritual', span: 'md:col-span-2 md:row-span-2' },
  { src: '/gallery/VID_20260508_181239_988.mp4', type: 'video', alt: 'Behind the craft', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181248_443.jpg', type: 'image', alt: 'Family tradition', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181248_512.jpg', type: 'image', alt: 'Roots and oils', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/VID_20260508_181240_048.mp4', type: 'video', alt: 'Wellness in motion', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181258_642.jpg', type: 'image', alt: 'Ayurvedic wisdom', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181259_026.jpg', type: 'image', alt: 'Cold-pressed sesame', span: 'md:col-span-1 md:row-span-1' },
  { src: '/gallery/IMG_20260508_181259_190.jpg', type: 'image', alt: 'Shade-dried leaves', span: 'md:col-span-2 md:row-span-1' },
]

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isOpen = activeIndex !== null

  const close = useCallback(() => setActiveIndex(null), [])
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % ITEMS.length)),
    [],
  )
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + ITEMS.length) % ITEMS.length)),
    [],
  )

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = original
    }
  }, [isOpen, close, next, prev])

  const active = activeIndex !== null ? ITEMS[activeIndex] : null

  return (
    <section className="bg-parchment/40">
      <div className="container-wide py-16 md:py-24">
        <Reveal>
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.25em] text-turmeric-700">In our world</p>
            <h2 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
              The Thinnie Ayurveda Gallery
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-accent text-lg text-warmgray">
              Glimpses of the SLim and Saane ritual — from copper kadhais to your morning shelf.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid auto-rows-[140px] grid-cols-2 gap-3 md:auto-rows-[180px] md:grid-cols-4 md:gap-4">
            {ITEMS.map((item, idx) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`group relative overflow-hidden rounded-2xl shadow-warm ring-1 ring-forest/10 transition hover:shadow-warm-lg focus:outline-none focus:ring-2 focus:ring-turmeric ${item.span}`}
                aria-label={`Open ${item.alt}`}
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <>
                    <video
                      src={item.src}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="pointer-events-none absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-charcoal/60 text-cream backdrop-blur">
                      <Play size={14} className="fill-cream" />
                    </span>
                  </>
                )}
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <AnimatePresence>
        {isOpen && active && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/90 p-4 backdrop-blur-sm"
            onClick={close}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20"
              aria-label="Close gallery"
            >
              <X size={22} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 md:left-6"
              aria-label="Previous"
            >
              <ChevronLeft size={28} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-cream/10 text-cream transition hover:bg-cream/20 md:right-6"
              aria-label="Next"
            >
              <ChevronRight size={28} />
            </button>
            <motion.div
              key={active.src}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-[88vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              {active.type === 'image' ? (
                <div className="relative mx-auto aspect-[4/3] w-full max-h-[88vh] overflow-hidden rounded-2xl">
                  <Image
                    src={active.src}
                    alt={active.alt}
                    fill
                    sizes="100vw"
                    className="object-contain"
                    priority
                  />
                </div>
              ) : (
                <video
                  src={active.src}
                  autoPlay
                  controls
                  loop
                  playsInline
                  className="mx-auto max-h-[88vh] w-full rounded-2xl bg-black"
                />
              )}
              <p className="mt-3 text-center font-accent text-base text-cream/80">{active.alt}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
