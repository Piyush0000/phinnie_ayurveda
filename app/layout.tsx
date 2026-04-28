import type { Metadata } from 'next'
import { Playfair_Display, Lato, Cormorant_Garamond } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})
const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Phinnie Aurvadic — Authentic Ayurvedic Wellness',
  description:
    'Discover premium Ayurvedic products handcrafted from time-honored formulas. Hair care, skin care, wellness and more.',
  keywords: ['Ayurveda', 'natural', 'wellness', 'hair care', 'skin care', 'Phinnie Aurvadic'],
  openGraph: {
    title: 'Phinnie Aurvadic',
    description: 'Authentic Ayurvedic products for modern wellness.',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth().catch(() => null)
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${cormorant.variable}`}>
      <body className="bg-cream text-charcoal antialiased">
        <SessionProvider session={session}>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#2D5016',
                color: '#FDF8F0',
                fontFamily: 'var(--font-lato)',
                borderRadius: '12px',
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}
