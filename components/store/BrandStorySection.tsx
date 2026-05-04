'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'

export default function BrandStorySection() {
  return (
    <section className="bg-cream">
      <div className="container-wide grid items-center gap-12 py-20 md:py-28 lg:grid-cols-2 lg:gap-20">
        <Reveal direction="right">
          <div className="relative">
            <div className="absolute -left-4 -top-4 h-full w-full rounded-3xl border-2 border-turmeric/40" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl shadow-warm-lg ring-1 ring-forest/10">
              <Image
                src="/media/brand-story.png"
                alt="Phinnie Ayurveda — handcrafted with care"
                width={1200}
                height={1200}
                className="h-full w-full object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority={false}
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden rounded-2xl bg-cream/90 p-5 shadow-warm-lg backdrop-blur md:block">
              <p className="font-accent text-sm italic text-warmgray">"Where ancient roots</p>
              <p className="font-display text-2xl text-forest">meet modern care."</p>
            </div>
          </div>
        </Reveal>

        <Reveal direction="left" delay={0.1}>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-turmeric-700">Our Story</p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-charcoal md:text-5xl lg:text-6xl">
              A quiet ritual,
              <br />
              <span className="italic text-forest">five thousand years</span> in the making.
            </h2>
            <div className="mt-6 space-y-5 font-accent text-lg leading-relaxed text-warmgray md:text-xl">
              <p>
                Phinnie Ayurveda began in a small kitchen in Rishikesh — a copper vessel,
                cold-pressed sesame, and a recipe handed down through four generations.
              </p>
              <p>
                Today, every bottle is still slow-cooked the bilona way: stone-ground herbs,
                shade-dried leaves, and hands that know the seasons. No shortcuts. No fillers.
                Just plants, oil, and intention.
              </p>
            </div>

            <dl className="mt-10 grid grid-cols-3 gap-6 border-y border-forest/10 py-6">
              <div>
                <dt className="font-display text-3xl text-forest md:text-4xl">40+</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-warmgray">Heritage Herbs</dd>
              </div>
              <div>
                <dt className="font-display text-3xl text-forest md:text-4xl">4 gen.</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-warmgray">of Family Craft</dd>
              </div>
              <div>
                <dt className="font-display text-3xl text-forest md:text-4xl">10k+</dt>
                <dd className="mt-1 text-xs uppercase tracking-wider text-warmgray">Daily Rituals</dd>
              </div>
            </dl>

            <Link
              href="/about"
              className="group mt-8 inline-flex items-center gap-2 font-semibold text-forest hover:text-forest-600"
            >
              Read our full story
              <ArrowRight size={16} className="transition group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
