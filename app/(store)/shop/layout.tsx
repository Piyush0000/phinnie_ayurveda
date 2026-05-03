import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Browse handcrafted Ayurvedic wellness products — hair care, skin care, supplements, and more.',
  openGraph: {
    title: 'Shop — Thinnie Aurvadic',
    description: 'Authentic Ayurveda for every aspect of your wellness journey.',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children
}
