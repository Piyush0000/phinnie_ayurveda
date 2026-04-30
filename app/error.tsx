'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[app error]', error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream p-8 text-center">
      <p className="font-display text-7xl text-terracotta opacity-30">!</p>
      <h1 className="font-display text-4xl text-charcoal md:text-5xl">Something went wrong</h1>
      <p className="mt-3 max-w-md font-accent text-lg text-warmgray">
        We've been notified and we're looking into it. In the meantime, you can try again.
      </p>
      <div className="mt-8 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-forest px-7 py-3 font-semibold text-cream hover:bg-forest-600"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="rounded-lg border-2 border-forest px-7 py-3 font-semibold text-forest hover:bg-forest hover:text-cream"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
