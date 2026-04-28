import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream p-8 text-center">
      <p className="font-display text-9xl text-forest opacity-20">404</p>
      <h1 className="font-display text-4xl text-charcoal md:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md font-accent text-lg text-warmgray">
        The path you're seeking has wandered off — perhaps it's meditating somewhere in the Himalayas.
      </p>
      <Link href="/" className="mt-8 rounded-lg bg-forest px-7 py-3 font-semibold text-cream hover:bg-forest-600">
        Return Home
      </Link>
    </div>
  )
}
