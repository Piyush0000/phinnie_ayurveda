import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Thinnie Aurvadic — questions about products, orders, or wholesale enquiries.',
  openGraph: {
    title: 'Contact — Thinnie Aurvadic',
    description: 'Reach the Thinnie Aurvadic team for product, order, and wholesale enquiries.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
