'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BadgeCheck, Flower2, Leaf, ShieldPlus, Sparkles, Timer } from 'lucide-react'
import { normalizeTiers, type PublicOffer } from '@/lib/bundle-offer'
import { formatPrice } from '@/lib/utils'
import { useCountdown, pad2 } from './useCountdown'

const MAROON = '#a3162f'

// Deterministic confetti so server and client render identical markup.
const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100,
  delay: (i * 0.73) % 8,
  duration: 7 + ((i * 1.7) % 6),
  size: 6 + (i % 4) * 2,
  color: ['#f7c948', MAROON, '#2D5016', '#e8792b', '#8FB66B'][i % 5],
  round: i % 3 === 0,
}))

const TRUST = [
  { icon: Leaf, label: '100% Natural Ingredients' },
  { icon: ShieldPlus, label: 'Supports Weight Management' },
  { icon: Flower2, label: 'Boosts Metabolism' },
  { icon: Sparkles, label: 'Healthy You Naturally' },
]

export default function FestiveOfferBanner({ offer }: { offer: PublicOffer }) {
  const tiers = normalizeTiers(offer.tiers)
  const t = useCountdown(offer.endsAt)
  const taglines = (offer.subtitle ?? '').split(/\s*[·•|]\s*/).filter(Boolean)
  const [brand, ...rest] = offer.title.split(' ')
  // "Thinnie Festive Dhamaka" → brand "Thinnie", script word "Festive", ribbon word "Dhamaka"
  const ribbonWord = rest.length >= 2 ? rest[rest.length - 1] : rest[0] ?? offer.title
  const scriptWord = rest.length >= 2 ? rest.slice(0, -1).join(' ') : ''
  const allProducts = offer.productIds.length === 0

  return (
    <section
      className="relative isolate overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 20% 10%, #fff7dc 0%, transparent 55%), radial-gradient(ellipse at 85% 80%, #eef6df 0%, transparent 55%), linear-gradient(180deg, #fdf8ea 0%, #f7efd6 100%)',
      }}
      aria-labelledby="festive-offer-heading"
    >
      {/* soft bokeh */}
      <div className="pointer-events-none absolute -left-24 top-1/3 -z-10 h-80 w-80 rounded-full bg-[#f7c948]/25 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-20 top-10 -z-10 h-96 w-96 rounded-full bg-forest-200/40 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[#e8792b]/10 blur-3xl" aria-hidden />

      {/* confetti */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden motion-reduce:hidden" aria-hidden>
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute -top-6 block animate-confetti"
            style={{
              left: `${c.left}%`,
              width: c.size,
              height: c.round ? c.size : c.size * 1.8,
              background: c.color,
              borderRadius: c.round ? '9999px' : '2px',
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
            }}
          />
        ))}
      </div>

      <Garland className="left-0" />
      <Garland className="right-0 hidden sm:block" flip />

      <div className="container-wide relative grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr,0.95fr] lg:gap-14 lg:py-20">
        {/* ---------- copy ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 text-center lg:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#e0a100]/40 bg-white/70 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-forest shadow-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-[#e0a100]" /> Limited Time Festive Offer
          </span>

          <h2 id="festive-offer-heading" className="mt-5 leading-none">
            <span className="block font-body text-2xl font-black uppercase tracking-[0.12em] text-forest md:text-3xl">
              {brand}
            </span>
            {scriptWord && (
              <span
                className="-mt-1 block bg-gradient-to-b from-[#ffd95a] via-[#f2b418] to-[#b87800] bg-clip-text pb-2 font-display text-6xl font-black italic text-transparent drop-shadow-[0_3px_0_rgba(45,80,22,0.35)] sm:text-7xl md:text-8xl"
              >
                {scriptWord}
              </span>
            )}
            <span className="relative mx-auto mt-1 inline-block lg:mx-0">
              <span
                className="relative z-10 block px-8 py-2 font-body text-5xl font-black uppercase tracking-wide text-cream sm:text-6xl md:text-7xl"
                style={{
                  background: `linear-gradient(180deg, #c21d3b 0%, ${MAROON} 55%, #7a0f24 100%)`,
                  clipPath: 'polygon(0 0, 100% 0, 96% 50%, 100% 100%, 0 100%, 4% 50%)',
                  textShadow: '0 3px 0 rgba(0,0,0,0.25)',
                }}
              >
                {ribbonWord}
              </span>
              <span className="absolute inset-x-3 -bottom-1.5 h-2 rounded-b bg-[#e0a100]/70" aria-hidden />
            </span>
          </h2>

          {taglines.length > 0 && (
            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-semibold text-forest md:text-base lg:justify-start">
              {taglines.map((line) => (
                <li key={line} className="flex items-center gap-1.5">
                  <Leaf className="h-4 w-4 text-forest-400" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          )}

          {/* tiers */}
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-3 gap-2 sm:gap-3 lg:mx-0">
            {tiers.map((tier, i) => {
              return (
                <motion.div
                  key={tier.quantity}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 + i * 0.12, type: 'spring', stiffness: 260, damping: 18 }}
                  whileHover={{ y: -4 }}
                  className="relative rounded-2xl bg-gradient-to-b from-forest-500 to-forest-800 p-1.5 shadow-warm-lg ring-2 ring-[#e0a100]/80"
                >
                  <div className="flex h-full flex-col items-center rounded-xl border-2 border-dashed border-[#f7c948]/60 px-2 pb-3 pt-2">
                    <span
                      className="-mt-1 whitespace-nowrap px-2 py-0.5 text-xs font-black uppercase tracking-wide text-cream shadow-md sm:px-3 sm:text-sm md:text-base"
                      style={{ background: MAROON, clipPath: 'polygon(0 0, 100% 0, 94% 50%, 100% 100%, 0 100%, 6% 50%)' }}
                    >
                      Buy {tier.quantity} @
                    </span>
                    <span className="mt-1 bg-gradient-to-b from-[#fff1a8] via-[#f7c948] to-[#d99a00] bg-clip-text font-body text-2xl font-black tabular-nums text-transparent sm:text-3xl md:text-4xl">
                      {formatPrice(tier.price)}
                    </span>
                    <span className="text-[10px] font-semibold text-cream/80 sm:text-[11px]">
                      any {tier.quantity} {allProducts ? 'products' : 'offer items'}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* countdown */}
          <div className="mx-auto mt-7 flex max-w-xl flex-wrap items-center justify-center gap-3 lg:mx-0 lg:justify-start">
            <span className="flex items-center gap-1.5 text-sm font-bold uppercase tracking-wider text-[#7a0f24]">
              <Timer className="h-4 w-4" /> Ends in
            </span>
            <div className="flex gap-2" role="timer" aria-live="off">
              {[
                ...(t && t.days > 0 ? [{ v: t.days, l: 'Days' }] : []),
                { v: t?.hours, l: 'Hrs' },
                { v: t?.minutes, l: 'Min' },
                { v: t?.seconds, l: 'Sec' },
              ].map((u) => (
                <div key={u.l} className="flex w-14 flex-col items-center rounded-xl bg-white/80 py-1.5 shadow-warm ring-1 ring-forest/10">
                  <span className="font-body text-xl font-black tabular-nums text-forest">
                    {u.v === undefined ? '--' : pad2(u.v)}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-warmgray">{u.l}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link
              href={offer.ctaLink}
              className="group relative inline-flex h-14 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-forest-600 via-forest-500 to-forest-600 px-8 text-lg font-bold text-cream shadow-warm-lg ring-2 ring-[#f7c948] transition hover:scale-[1.03]"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine" aria-hidden />
              {offer.ctaText}
              <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </Link>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-forest">
              <BadgeCheck className="h-5 w-5 text-forest-400" />
              Auto-applied at checkout · no coupon needed
            </span>
          </div>

          {offer.footnote && <p className="mt-4 text-xs text-warmgray">{offer.footnote}</p>}
        </motion.div>

        {/* ---------- poster ---------- */}
        {offer.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative mx-auto w-full max-w-[22rem] sm:max-w-sm lg:max-w-md"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-[#f7c948]/60 via-[#e8792b]/30 to-forest-300/50 blur-2xl" aria-hidden />
            <div className="animate-float-slow motion-reduce:animate-none">
              <div className="rounded-[1.75rem] bg-gradient-to-br from-[#ffe27a] via-[#d99a00] to-[#8a5a00] p-[5px] shadow-2xl">
                <div className="overflow-hidden rounded-[1.5rem] bg-cream">
                  <Image
                    src={offer.imageUrl}
                    alt={`${offer.title} — ${tiers.map((x) => `Buy ${x.quantity} at ₹${x.price}`).join(', ')}`}
                    width={1536}
                    height={2304}
                    priority
                    sizes="(min-width: 1024px) 28rem, (min-width: 640px) 24rem, 90vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>
            </div>

            {/* rotating stamp */}
            <div className="absolute -left-4 top-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#a3162f] text-center shadow-xl ring-4 ring-[#f7c948] sm:-left-8 sm:h-28 sm:w-28">
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-[spin_14s_linear_infinite] motion-reduce:animate-none" aria-hidden>
                <defs>
                  <path id="stampCircle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text fill="#f7c948" fontSize="10.5" fontWeight="800" letterSpacing="2.2">
                  <textPath href="#stampCircle">MIX • MATCH • SAVE • MORE •</textPath>
                </text>
              </svg>
              <span className="relative text-[11px] font-black uppercase leading-tight text-cream sm:text-xs">
                {allProducts ? (
                  <>Any<br />Products</>
                ) : (
                  <>Select<br />Products</>
                )}
              </span>
            </div>
          </motion.div>
        )}
      </div>

      {/* trust strip */}
      <div className="container-wide relative pb-10 md:pb-14">
        <ul className="grid grid-cols-2 gap-y-5 rounded-3xl border border-[#e0a100]/40 bg-white/75 px-4 py-5 shadow-warm backdrop-blur md:grid-cols-4 md:divide-x md:divide-[#e0a100]/40">
          {TRUST.map(({ icon: Icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-2 px-2 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-forest/70 text-forest">
                <Icon className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold text-forest">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Hanging marigold garland with leaves. */
function Garland({ className, flip }: { className?: string; flip?: boolean }) {
  const strands = [0, 1, 2]
  return (
    <div
      className={`pointer-events-none absolute top-0 z-0 w-16 opacity-90 sm:w-28 md:w-40 ${className ?? ''}`}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      aria-hidden
    >
      <svg viewBox="0 0 160 260" className="h-auto w-full">
        {strands.map((s) => {
          const x = 18 + s * 42
          const len = 7 + ((s + 1) % 3) * 3
          return (
            <g key={s} className="origin-top animate-sway" style={{ animationDelay: `${s * 0.6}s`, transformBox: 'fill-box' }}>
              <line x1={x} y1={0} x2={x} y2={len * 17} stroke="#6b4f1d" strokeWidth={1.5} />
              {Array.from({ length: len }).map((_, i) => (
                <g key={i}>
                  <circle cx={x} cy={10 + i * 17} r={9} fill={i % 2 ? '#f59e0b' : '#f97316'} />
                  <circle cx={x} cy={10 + i * 17} r={5.5} fill={i % 2 ? '#fbbf24' : '#fb923c'} />
                  <circle cx={x} cy={10 + i * 17} r={2} fill="#b45309" />
                </g>
              ))}
              <path
                d={`M${x} ${len * 17 + 4} q-9 12 0 26 q9 -14 0 -26z`}
                fill="#3f7a1f"
              />
            </g>
          )
        })}
        <path d="M0 6 Q80 34 160 6" stroke="#2D5016" strokeWidth={5} fill="none" />
        {[20, 55, 95, 135].map((x) => (
          <ellipse key={x} cx={x} cy={x === 55 || x === 95 ? 22 : 16} rx={12} ry={5} fill="#4d8a2a" transform={`rotate(${x > 80 ? -20 : 20} ${x} 18)`} />
        ))}
      </svg>
    </div>
  )
}
