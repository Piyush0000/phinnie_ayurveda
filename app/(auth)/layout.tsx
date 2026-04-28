import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment via-cream to-turmeric-50">
      <div className="container-narrow flex min-h-screen flex-col items-center py-10">
        <Link href="/" className="font-display text-3xl text-forest">
          Phinnie Aurvadic
        </Link>
        <div className="mt-8 flex w-full flex-1 items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
