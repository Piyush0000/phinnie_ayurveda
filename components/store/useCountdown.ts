'use client'

import { useEffect, useState } from 'react'
import type { PublicOffer } from '@/lib/bundle-offer'

export interface CountdownParts {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function endOfToday(): number {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

function split(ms: number): CountdownParts {
  const s = Math.max(0, Math.floor(ms / 1000))
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  }
}

/**
 * Live countdown for an offer. A scheduled ('upcoming') offer counts down to its
 * start and reloads the page when it goes live. A live offer counts down to its
 * end date, or to midnight (a rolling "today only" timer) when it has none.
 * Returns null parts until mounted to avoid SSR mismatch.
 */
export function useOfferCountdown(offer: Pick<PublicOffer, 'phase' | 'startsAt' | 'endsAt'>) {
  const upcoming = offer.phase === 'upcoming' && !!offer.startsAt
  const targetIso = upcoming ? offer.startsAt : offer.endsAt
  const [parts, setParts] = useState<CountdownParts | null>(null)

  useEffect(() => {
    const target = () => (targetIso ? new Date(targetIso).getTime() : endOfToday())
    let reloaded = false
    const tick = () => {
      const left = target() - Date.now()
      setParts(split(left))
      if (upcoming && left <= 0 && !reloaded) {
        reloaded = true
        // Offer just started: re-render from the server so prices and timer switch to live.
        window.setTimeout(() => window.location.reload(), 1500)
      }
    }
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [targetIso, upcoming])

  return { parts, upcoming }
}

export const pad2 = (n: number) => String(n).padStart(2, '0')
