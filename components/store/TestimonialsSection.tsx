'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Testimonial {
  _id: string
  name: string
  rating: number
  comment: string
  avatar?: string
  location?: string
}

const FALLBACK: Testimonial[] = [
  {
    _id: 'fallback-1',
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    comment:
      'The Bhringraj hair oil has been wonderful for my hair routine. After three months of use, my hair feels noticeably fuller and stronger.',
  },
  {
    _id: 'fallback-2',
    name: 'Arjun Mehta',
    location: 'Bengaluru',
    rating: 5,
    comment:
      'Ashwagandha capsules have helped me feel calmer and more rested through the day. Pure quality, exactly what I expected.',
  },
  {
    _id: 'fallback-3',
    name: 'Lakshmi Iyer',
    location: 'Chennai',
    rating: 5,
    comment:
      'My grandmother used these same formulas. Thinnie Ayurvedic brings authentic Ayurveda to modern wellness — beautifully.',
  },
]

export default function TestimonialsSection() {
  const [reviews, setReviews] = useState<Testimonial[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    fetch('/api/testimonials?limit=12')
      .then((r) => (r.ok ? r.json() : { testimonials: [] }))
      .then((data) => {
        if (!alive) return
        setReviews(data.testimonials ?? [])
        setLoaded(true)
      })
      .catch(() => {
        if (!alive) return
        setReviews([])
        setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [])

  const list = loaded && reviews.length > 0 ? reviews : FALLBACK

  return (
    <section className="container-wide py-16 md:py-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Loved by thousands</p>
        <h2 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">What Our Family Says</h2>
        <Link
          href="/reviews/submit"
          className="mt-4 inline-block text-sm font-semibold text-forest underline-offset-4 hover:underline"
        >
          Share your experience →
        </Link>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {list.slice(0, 3).map((r) => (
          <article
            key={r._id}
            className="flex flex-col rounded-2xl border border-forest/10 bg-cream p-7 shadow-warm"
          >
            <div className="flex">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-turmeric text-turmeric" />
              ))}
            </div>
            <p className="mt-4 font-accent text-lg leading-relaxed text-charcoal">"{r.comment}"</p>
            <div className="mt-6 flex items-center gap-3 border-t border-forest/10 pt-4">
              {r.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.avatar}
                  alt={r.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest font-display text-lg text-cream">
                  {r.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-semibold text-charcoal">{r.name}</div>
                {r.location && <div className="text-xs text-warmgray">{r.location}</div>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
