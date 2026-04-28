import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-parchment via-cream to-turmeric-50">
      <div className="absolute inset-0 bg-grain opacity-50" aria-hidden />
      <LeafDecor className="absolute -left-20 top-10 h-80 w-80 -rotate-12 text-forest/10" />
      <LeafDecor className="absolute -right-24 bottom-0 h-96 w-96 rotate-180 text-turmeric/15" />

      <div className="container-wide relative grid items-center gap-10 py-16 md:py-24 lg:grid-cols-2 lg:py-32">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-cream px-4 py-1.5 text-xs font-semibold tracking-wider text-forest">
            <span className="h-1.5 w-1.5 rounded-full bg-turmeric" /> AYURVEDA · ROOTED IN TRADITION
          </span>
          <h1 className="mt-6 font-display text-5xl leading-tight text-charcoal md:text-6xl lg:text-7xl">
            Wisdom of <span className="italic text-forest">Ayurveda</span> in every drop
          </h1>
          <p className="mt-6 max-w-xl font-accent text-xl text-warmgray md:text-2xl">
            Handcrafted from time-honored formulas — pure herbs, cold-pressed oils, and gentle care for your body and soul.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center rounded-lg bg-forest px-7 font-semibold text-cream shadow-warm transition hover:bg-forest-600"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center rounded-lg border-2 border-forest px-7 font-semibold text-forest transition hover:bg-forest hover:text-cream"
            >
              Our Story
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs uppercase tracking-wider text-warmgray">
            <span>✦ 100% Natural</span>
            <span>✦ Cruelty-Free</span>
            <span>✦ Ayush Certified</span>
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="relative mx-auto aspect-square max-w-md overflow-hidden rounded-full bg-forest shadow-warm-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-forest-600 to-forest-800" />
            <BotanicalArt className="absolute inset-0 h-full w-full p-10 text-turmeric-200/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-cream">
                <p className="font-accent text-2xl italic">since</p>
                <p className="font-display text-7xl">∞</p>
                <p className="font-accent text-xl italic tracking-widest">years of wisdom</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 hidden rounded-2xl bg-cream p-4 shadow-warm-lg md:block">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                <div className="h-9 w-9 rounded-full bg-turmeric-300 ring-2 ring-cream" />
                <div className="h-9 w-9 rounded-full bg-terracotta-300 ring-2 ring-cream" />
                <div className="h-9 w-9 rounded-full bg-forest-300 ring-2 ring-cream" />
              </div>
              <div>
                <div className="font-bold text-charcoal">10,000+</div>
                <div className="text-xs text-warmgray">happy customers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function LeafDecor({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="currentColor" className={className} aria-hidden>
      <path d="M100 20C60 20 30 60 30 100c0 30 20 60 50 70-10-30-5-70 30-100 20-15 40-30 60-50-25 0-50 0-70 0z" />
      <path d="M100 20c-20 30-50 50-70 70 30-5 60 0 80 30-5-40 0-70-10-100z" opacity="0.5" />
    </svg>
  )
}

function BotanicalArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden>
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="60" />
      <path d="M100 30v140M30 100h140" />
      <path d="M50 50l100 100M150 50L50 150" />
      <circle cx="100" cy="100" r="20" fill="currentColor" opacity="0.3" />
    </svg>
  )
}
