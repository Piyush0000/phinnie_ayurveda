import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse handcrafted Ayurvedic remedies — hair care, skin care, wellness, and more.',
  openGraph: {
    title: 'Shop — Phinnie Aurvadic',
    description: 'Authentic Ayurveda for every aspect of your wellness journey.',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
