import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Thinnie Ayurvedic — questions about products, orders, or wholesale enquiries.',
  openGraph: {
    title: 'Contact — Thinnie Ayurvedic',
    description: 'Reach the Thinnie Ayurvedic team for product, order, and wholesale enquiries.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
