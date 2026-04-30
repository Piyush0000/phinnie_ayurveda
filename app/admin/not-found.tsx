import Link from 'next/link'

export default function AdminNotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="rounded-2xl border border-forest/10 bg-cream p-10 text-center shadow-warm">
        <p className="font-display text-7xl text-forest opacity-25">404</p>
        <h1 className="font-display text-3xl text-charcoal">Resource not found</h1>
        <p className="mt-2 text-sm text-warmgray">The admin resource you're looking for doesn't exist.</p>
        <Link
          href="/admin"
          className="mt-6 inline-flex rounded-lg bg-forest px-6 py-2.5 font-semibold text-cream hover:bg-forest-600"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}
