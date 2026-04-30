'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function OrdersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[orders error]', error)
  }, [error])

  return (
    <div className="container-narrow py-16 text-center">
      <h1 className="font-display text-4xl text-charcoal">Couldn't load your orders</h1>
      <p className="mt-3 font-accent text-lg text-warmgray">
        We hit a snag fetching your order history. Please try again.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-forest px-6 py-2.5 font-semibold text-cream hover:bg-forest-600"
        >
          Try again
        </button>
        <Link
          href="/profile"
          className="rounded-lg border-2 border-forest px-6 py-2.5 font-semibold text-forest hover:bg-forest hover:text-cream"
        >
          My profile
        </Link>
      </div>
    </div>
  )
}
