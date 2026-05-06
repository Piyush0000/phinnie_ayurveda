'use client'

import Reveal from './Reveal'

const STEPS = [
  {
    n: '01',
    title: 'Hand-picked',
    desc: 'Heritage herbs sourced from trusted Ayurvedic farms across Uttarakhand and Kerala.',
  },
  {
    n: '02',
    title: 'Slow-cooked',
    desc: 'Bilona method, copper vessels, slow wood fires. The way it has been done for centuries.',
  },
  {
    n: '03',
    title: 'Small-batched',
    desc: 'Bottled fresh in micro-batches so every drop reaches you potent, fragrant, and alive.',
  },
]

export default function ProcessSection() {
  return (
    <section className="relative isolate overflow-hidden bg-forest text-cream">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        src="/media/egw.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-forest/85 via-forest/70 to-forest-900/95" aria-hidden />

      <div className="container-wide relative py-24 md:py-32">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-turmeric-200">Why Thinnie</p>
            <h2 className="mt-3 font-display text-4xl leading-tight md:text-5xl lg:text-6xl">
              From <span className="italic text-turmeric-200">earth</span> to your everyday ritual.
            </h2>
            <p className="mt-5 font-accent text-lg text-cream/80 md:text-xl">
              Three quiet steps — no shortcuts, no fillers, no fragrance you can't pronounce.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-6 md:mt-20 md:grid-cols-3 md:gap-8">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="group h-full rounded-3xl border border-cream/15 bg-cream/5 p-8 backdrop-blur-md transition hover:border-turmeric/50 hover:bg-cream/10">
                <span className="font-display text-5xl text-turmeric-200/80 md:text-6xl">{s.n}</span>
                <h3 className="mt-5 font-display text-2xl text-cream md:text-3xl">{s.title}</h3>
                <p className="mt-3 font-accent text-base leading-relaxed text-cream/75 md:text-lg">
                  {s.desc}
                </p>
                <div className="mt-6 h-px w-12 bg-turmeric transition-all group-hover:w-20" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
