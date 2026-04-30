import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a Phinnie Aurvadic account for personalized recommendations.',
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children
}
