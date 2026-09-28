'use client'

import Link from 'next/link'
import type { PublicOffer } from '@/lib/bundle-offer'
import { COUNTDOWN_PALETTES } from '@/lib/countdown-palettes'
import { useCountdown, pad2 } from './useCountdown'

export default function OfferCountdownBar({ offer }: { offer: PublicOffer }) {
  const t = useCountdown(offer.endsAt)
  const p = COUNTDOWN_PALETTES[offer.countdownTheme] ?? COUNTDOWN_PALETTES.purple
  const label = offer.countdownLabel || `${offer.title} Ends In`
  const units = t
    ? [
        ...(t.days > 0 ? [{ v: t.days, l: t.days === 1 ? 'Day' : 'Days' }] : []),
        { v: t.hours, l: 'Hour' },
        { v: t.minutes, l: 'Min' },
        { v: t.seconds, l: 'Sec' },
      ]
    : [
        { v: null, l: 'Hour' },
        { v: null, l: 'Min' },
        { v: null, l: 'Sec' },
      ]

  return (
    <Link
      href={offer.ctaLink}
      className="group relative block overflow-hidden text-white"
      style={{ background: p.bg }}
      aria-label={`${label} — view offer`}
    >
      {/* stars & confetti */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(circle at 6% 25%, #f5c542 1.5px, transparent 2.2px), radial-gradient(circle at 18% 80%, #fff 1px, transparent 1.6px), radial-gradient(circle at 34% 15%, #f5c542 1.2px, transparent 2px), radial-gradient(circle at 63% 85%, #fff 1px, transparent 1.6px), radial-gradient(circle at 77% 20%, #f5c542 1.5px, transparent 2.2px), radial-gradient(circle at 92% 60%, #fff 1px, transparent 1.6px)',
          backgroundSize: '220px 64px',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shine" aria-hidden />

      {/* balloons */}
      <Balloon className="left-[3%] top-1 hidden md:block" colors={p.balloon} delay="0s" />
      <Balloon className="left-[34%] -bottom-6 hidden lg:block" colors={p.balloon} delay="1.2s" small />
      <Balloon className="right-[22%] -top-3 hidden md:block" colors={p.balloon} delay="0.6s" small />
      <Balloon className="right-[2%] -bottom-5 hidden sm:block" colors={p.balloon} delay="1.8s" />

      {/* streamers */}
      <Streamer className="left-[1%] top-2" />
      <Streamer className="right-[1%] bottom-1 rotate-180" />

      <div className="container-wide relative flex items-center justify-center gap-2.5 py-2.5 sm:gap-5 md:py-3">
        <GiftBox className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" box={p.gift} ribbon={p.ribbon} />
        <p className="font-body text-[15px] font-extrabold leading-tight tracking-tight drop-shadow sm:text-xl md:text-2xl">
          {label}
        </p>
        <div className="flex shrink-0 items-start gap-1.5 sm:gap-2" role="timer" aria-live="off">
          {units.map((u) => (
            <div key={u.l} className="flex flex-col items-center">
              <span
                className="flex h-9 w-10 items-center justify-center rounded-lg bg-white text-lg font-extrabold tabular-nums shadow-[0_3px_0_rgba(0,0,0,0.25)] sm:h-11 sm:w-12 sm:text-2xl"
                style={{ color: p.digit }}
              >
                {u.v === null ? '--' : pad2(u.v)}
              </span>
              <span className="mt-0.5 text-[9px] font-bold uppercase tracking-wider text-white/90 sm:text-[11px]">
                {u.l}
              </span>
            </div>
          ))}
        </div>
        <GiftBox className="hidden h-11 w-11 shrink-0 sm:block" box={p.gift} ribbon={p.ribbon} />
      </div>
    </Link>
  )
}

function Balloon({ className, colors, delay, small }: { className: string; colors: [string, string]; delay: string; small?: boolean }) {
  const id = `bl-${colors[1].slice(1)}-${small ? 's' : 'l'}`
  return (
    <svg
      viewBox="0 0 40 64"
      className={`pointer-events-none absolute animate-float-slow motion-reduce:animate-none ${small ? 'h-9 w-6' : 'h-12 w-8'} ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="25%" stopColor={colors[0]} />
          <stop offset="100%" stopColor={colors[1]} />
        </radialGradient>
      </defs>
      <ellipse cx="20" cy="20" rx="16" ry="19" fill={`url(#${id})`} />
      <path d="M17 38 L20 42 L23 38 Z" fill={colors[1]} />
      <path d="M20 42 q-4 7 0 12 q4 5 0 10" stroke="#ffffff99" strokeWidth="1" fill="none" />
    </svg>
  )
}

function GiftBox({ className, box, ribbon }: { className: string; box: string; ribbon: string }) {
  return (
    <svg viewBox="0 0 48 48" className={`animate-wiggle drop-shadow-lg motion-reduce:animate-none ${className}`} aria-hidden>
      <rect x="6" y="20" width="36" height="24" rx="2" fill={box} />
      <rect x="4" y="14" width="40" height="9" rx="2" fill={box} style={{ filter: 'brightness(1.25)' }} />
      <rect x="21" y="14" width="6" height="30" fill={ribbon} />
      <path d="M24 14 C16 4 8 8 14 14 Z" fill={ribbon} />
      <path d="M24 14 C32 4 40 8 34 14 Z" fill={ribbon} />
      <circle cx="24" cy="14" r="3" fill={ribbon} style={{ filter: 'brightness(0.85)' }} />
    </svg>
  )
}

function Streamer({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 30 40" className={`pointer-events-none absolute hidden h-8 w-6 sm:block ${className}`} aria-hidden>
      <path d="M4 2 q10 6 2 12 q-8 6 4 12 q10 6 2 12" stroke="#f5c542" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </svg>
  )
}
