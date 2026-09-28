'use client'

import Link from 'next/link'
import { Gift, Sparkles } from 'lucide-react'
import type { PublicOffer } from '@/lib/bundle-offer'
import { useCountdown, pad2 } from './useCountdown'

export default function OfferCountdownBar({ offer }: { offer: PublicOffer }) {
  const t = useCountdown(offer.endsAt)
  const label = offer.countdownLabel || `${offer.title} Ends In`
  const units = t
    ? [
        ...(t.days > 0 ? [{ v: t.days, l: t.days === 1 ? 'Day' : 'Days' }] : []),
        { v: t.hours, l: 'Hour' },
        { v: t.minutes, l: 'Min' },
        { v: t.seconds, l: 'Sec' },
      ]
    : []

  return (
    <Link
      href={offer.ctaLink}
      className="group relative block overflow-hidden bg-gradient-to-r from-[#7a0f24] via-[#a3162f] to-[#7a0f24] text-cream"
      aria-label={`${label} — view offer`}
    >
      {/* sparkle + confetti texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'radial-gradient(circle at 8% 30%, #f7c948 1.5px, transparent 2px), radial-gradient(circle at 22% 75%, #fff 1px, transparent 1.5px), radial-gradient(circle at 70% 20%, #f7c948 1.5px, transparent 2px), radial-gradient(circle at 88% 70%, #fff 1px, transparent 1.5px), radial-gradient(circle at 50% 50%, #f7c948 1px, transparent 1.5px)',
          backgroundSize: '160px 60px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/15 to-transparent animate-shine" aria-hidden />

      <div className="container-wide relative flex items-center justify-center gap-3 py-2.5 sm:gap-5 md:py-3">
        <Gift className="hidden h-7 w-7 shrink-0 text-[#f7c948] drop-shadow sm:block animate-wiggle" aria-hidden />
        <p className="flex items-center gap-1.5 font-display text-[13px] font-bold leading-tight min-[400px]:text-sm sm:text-lg md:text-xl">
          <Sparkles className="h-4 w-4 shrink-0 text-[#f7c948] sm:hidden" aria-hidden />
          {label}
        </p>
        <div className="flex shrink-0 items-start gap-1.5 sm:gap-2" role="timer" aria-live="off">
          {(t ? units : [{ v: 0, l: 'Hour' }, { v: 0, l: 'Min' }, { v: 0, l: 'Sec' }]).map((u) => (
            <div key={u.l} className="flex flex-col items-center">
              <span className="flex h-8 w-9 items-center justify-center rounded-md bg-cream font-bold tabular-nums text-[#7a0f24] shadow-md sm:h-10 sm:w-11 sm:text-lg">
                {t ? pad2(u.v) : '--'}
              </span>
              <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-cream/85 sm:text-[10px]">
                {u.l}
              </span>
            </div>
          ))}
        </div>
        <Gift className="hidden h-7 w-7 shrink-0 text-[#f7c948] drop-shadow md:block animate-wiggle" aria-hidden />
      </div>
    </Link>
  )
}
