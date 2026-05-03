import Link from 'next/link'
import Image from 'next/image'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment via-cream to-turmeric-50">
      <div className="container-narrow flex min-h-screen flex-col items-center py-10">
        <Link href="/" aria-label="Thinnie Ayurvedic" className="inline-flex items-center">
          <Image src="/logo.png" alt="Thinnie Ayurvedic" width={400} height={178} priority quality={95} className="h-16 w-auto md:h-20" />
        </Link>
        <div className="mt-8 flex w-full flex-1 items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
}
