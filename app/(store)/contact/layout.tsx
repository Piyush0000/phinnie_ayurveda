import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Phinnie Aurvadic — questions about products, orders, or wholesale enquiries.',
  openGraph: {
    title: 'Contact — Phinnie Aurvadic',
    description: 'Reach the Phinnie Aurvadic team for product, order, and wholesale enquiries.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
