'use client'

import { useEffect } from 'react'

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[admin error]', error)
  }, [error])

  return (
    <div className="p-6 lg:p-8">
      <div className="rounded-2xl border border-terracotta/20 bg-terracotta-50 p-6">
        <h2 className="font-display text-xl text-terracotta">Admin section error</h2>
        <p className="mt-2 text-sm text-charcoal">
          {error.message || 'Something went wrong loading this admin page.'}
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-lg bg-forest px-5 py-2 text-sm font-semibold text-cream hover:bg-forest-600"
        >
          Retry
        </button>
      </div>
    </div>
  )
}
