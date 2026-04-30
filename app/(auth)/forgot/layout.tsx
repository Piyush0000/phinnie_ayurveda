import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Phinnie Aurvadic account password.',
  robots: { index: false, follow: false },
}

export default function ForgotLayout({ children }: { children: React.ReactNode }) {
  return children
}
