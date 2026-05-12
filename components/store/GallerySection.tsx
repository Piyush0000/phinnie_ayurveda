'use client'

import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import Reveal from './Reveal'

type MediaItem = {
  src: string
  type: 'image' | 'video'
  alt: string
}

type ApiItem = {
  _id: string
  url: string
  type: 'IMAGE' | 'VIDEO'
  caption?: string
}

const FALLBACK: MediaItem[] = [
  { src: '/gallery/IMG_20260508_181247_529.jpg', type: 'image', alt: 'Thinnie Ayurveda — handcrafted ritual' },
  { src: '/gallery/IMG_20260508_181247_746.jpg', type: 'image', alt: 'Slow-cooked the bilona way' },
  { src: '/gallery/IMG_20260508_181247_766.jpg', type: 'image', alt: 'Heritage herbs' },
  { src: '/gallery/IMG_20260508_181247_891.jpg', type: 'image', alt: 'Stone-ground roots' },
  { src: '/gallery/IMG_20260508_181248_388.jpg', type: 'image', alt: 'Herbal infusion' },
  { src: '/gallery/IMG_20260508_181248_403.jpg', type: 'image', alt: 'Daily ritual' },
]

const AUTOPLAY_MS = 4000
const CLOUDINARY_HOST = /^https:\/\/res\.cloudinary\.com\//

export default function GallerySection() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const isOpen = activeIndex !== null
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    let alive = true
    fetch('/api/gallery?limit=60')
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items?: ApiItem[] }) => {
        if (!alive) return
        const mapped: MediaItem[] = (data.items ?? []).map((it) => ({
          src: it.url,
          type: it.type === 'VIDEO' ? 'video' : 'image',
          alt: it.caption?.trim() || 'Thinnie Ayurveda gallery',
        }))
        setItems(mapped)
        setLoaded(true)
      })
      .catch(() => {
        if (!alive) return
        setItems([])
        setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const list = useMemo(() => (loaded && items.length > 0 ? items : FALLBACK), [loaded, items])

  const close = useCallback(() => setActiveIndex(null), [])
  const next = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i + 1) % list.length)),
    [list.length],
  )
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + list.length) % list.length)),
    [list.length],
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

  const scrollByCard = useCallback((direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-gallery-item]')
    const cardWidth = card ? card.getBoundingClientRect().width : track.clientWidth * 0.5
    const gap = 16
    track.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' })
  }, [])

  const updateScrollState = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const { scrollLeft, scrollWidth, clientWidth } = track
    setCanScrollLeft(scrollLeft > 4)
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    updateScrollState()
    track.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      track.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState, list.length])

  useEffect(() => {
    if (isOpen || isHovered) return
    const track = trackRef.current
    if (!track) return
    const id = window.setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = track
      const atEnd = scrollLeft + clientWidth >= scrollWidth - 4
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: 'smooth' })
      } else {
        scrollByCard(1)
      }
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [isOpen, isHovered, scrollByCard, list.length])

  if (loaded && items.length === 0) {
    // No DB items and no fallback worth showing — render nothing rather than a half-empty section.
    // (FALLBACK still kicks in above, so this guard is only hit if FALLBACK is manually emptied.)
  }

  const active = activeIndex !== null ? list[activeIndex] : null

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
          <div
            className="group/carousel relative mt-12"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              ref={trackRef}
              className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {list.map((item, idx) => (
                <button
                  key={`${item.src}-${idx}`}
                  type="button"
                  data-gallery-item
                  onClick={() => setActiveIndex(idx)}
                  className="group relative aspect-[3/4] w-[70%] shrink-0 snap-start overflow-hidden rounded-2xl shadow-warm ring-1 ring-forest/10 transition hover:shadow-warm-lg focus:outline-none focus:ring-2 focus:ring-turmeric sm:w-[44%] md:w-[31%] lg:w-[27%] xl:w-[calc((100%-3.5*1rem)/3.5)]"
                  aria-label={`Open ${item.alt}`}
                >
                  {item.type === 'image' ? (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 27vw, (min-width: 768px) 31vw, (min-width: 640px) 44vw, 70vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                      unoptimized={!CLOUDINARY_HOST.test(item.src) && !item.src.startsWith('/')}
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

            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              disabled={!canScrollLeft}
              aria-label="Scroll left"
              className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/95 text-charcoal shadow-warm-lg ring-1 ring-forest/10 opacity-0 transition group-hover/carousel:opacity-100 hover:bg-cream disabled:pointer-events-none disabled:opacity-0 md:flex"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              disabled={!canScrollRight}
              aria-label="Scroll right"
              className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-cream/95 text-charcoal shadow-warm-lg ring-1 ring-forest/10 opacity-0 transition group-hover/carousel:opacity-100 hover:bg-cream disabled:pointer-events-none disabled:opacity-0 md:flex"
            >
              <ChevronRight size={20} />
            </button>
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
                    unoptimized={!CLOUDINARY_HOST.test(active.src) && !active.src.startsWith('/')}
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
