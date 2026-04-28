import { Star } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    body:
      'The Bhringraj hair oil completely transformed my hair. After three months of use, my hair fall has reduced dramatically.',
  },
  {
    name: 'Arjun Mehta',
    location: 'Bengaluru',
    rating: 5,
    body:
      'Ashwagandha capsules have been a game changer for my stress and sleep. Pure quality, exactly what I expected.',
  },
  {
    name: 'Lakshmi Iyer',
    location: 'Chennai',
    rating: 5,
    body:
      'My grandmother used these same formulas. Phinnie Aurvadic brings authentic Ayurveda to modern wellness — beautifully.',
  },
]

export default function TestimonialsSection() {
  return (
    <section className="container-wide py-16 md:py-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Loved by thousands</p>
        <h2 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">What Our Family Says</h2>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <article
            key={r.name}
            className="flex flex-col rounded-2xl border border-forest/10 bg-cream p-7 shadow-warm"
          >
            <div className="flex">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star key={i} size={16} className="fill-turmeric text-turmeric" />
              ))}
            </div>
            <p className="mt-4 font-accent text-lg leading-relaxed text-charcoal">"{r.body}"</p>
            <div className="mt-6 flex items-center gap-3 border-t border-forest/10 pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest font-display text-lg text-cream">
                {r.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-charcoal">{r.name}</div>
                <div className="text-xs text-warmgray">{r.location}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
