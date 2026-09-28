'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/store/cartStore'
import type { PublicOffer } from '@/lib/bundle-offer'

/** Pushes the server's active offer into the cart store so totals match checkout. */
export default function OfferSync({ offer }: { offer: PublicOffer | null }) {
  const setOffer = useCartStore((s) => s.setOffer)
  useEffect(() => {
    setOffer(offer)
  }, [offer, setOffer])
  return null
}
