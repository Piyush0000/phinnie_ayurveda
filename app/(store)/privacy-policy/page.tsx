import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Thinnie Ayurvedic collects, uses, and protects the personal information you share with us.',
  alternates: { canonical: '/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy — Thinnie Ayurvedic',
    description: 'Read how we handle your data at Thinnie Ayurvedic.',
  },
}

export default function PrivacyPolicyPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Legal</p>
        <h1 className="mt-2 font-display text-5xl text-charcoal md:text-6xl">Privacy Policy</h1>
        <p className="mx-auto mt-4 max-w-2xl font-accent text-xl text-warmgray">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <article className="prose prose-lg mx-auto mt-10 max-w-none text-charcoal">
        <p className="leading-relaxed">
          Your privacy matters to us. This policy explains what information we collect when you visit or
          purchase from Thinnie Ayurvedic, how we use it, and the choices you have.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">1. Information We Collect</h2>
        <p className="mt-3 leading-relaxed">
          When you create an account, place an order, or contact us, we collect:
        </p>
        <ul className="mt-3 space-y-2 leading-relaxed">
          <li>✦ Your full name</li>
          <li>✦ Email address</li>
          <li>✦ Phone number</li>
          <li>✦ Shipping and billing address</li>
        </ul>
        <p className="mt-3 leading-relaxed">
          Payment details (card number, UPI ID, bank information) are processed directly by our payment
          partner Razorpay and are never stored on our servers.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">2. How We Use Your Information</h2>
        <p className="mt-3 leading-relaxed">
          We use the information you share with us for the following purposes:
        </p>
        <ul className="mt-3 space-y-2 leading-relaxed">
          <li>✦ Processing and delivering your orders</li>
          <li>✦ Sending order updates and shipping notifications</li>
          <li>✦ Responding to your queries and support requests</li>
          <li>✦ Sending you newsletters or offers (only if you opt in)</li>
          <li>✦ Meeting legal, tax, and accounting obligations</li>
        </ul>

        <h2 className="mt-10 font-display text-3xl text-forest">3. We Do Not Sell Your Data</h2>
        <p className="mt-3 leading-relaxed">
          We <strong>do not sell, rent, or trade</strong> your personal information to any third party.
          Information is shared only with trusted service providers (such as our courier partners and
          payment gateway) and only to the extent needed to fulfil your order.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">4. Data Storage &amp; Security</h2>
        <p className="mt-3 leading-relaxed">
          Your data is stored on secure servers protected by industry-standard safeguards including
          encryption in transit (HTTPS), hashed passwords, and access controls. While we work hard to
          protect your information, no method of internet transmission is 100% secure.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">5. Cookies</h2>
        <p className="mt-3 leading-relaxed">
          We use a small number of cookies to keep you signed in, remember your cart, and understand how
          our website is used. You can disable cookies in your browser, but parts of the site may not work
          as expected.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">6. Your Rights</h2>
        <p className="mt-3 leading-relaxed">
          You can request access to, correction of, or deletion of your personal data at any time by
          writing to{' '}
          <a href="mailto:hello@thinnie.in" className="text-forest underline">
            hello@thinnie.in
          </a>
          . We will respond within a reasonable time frame.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">7. Updates to this Policy</h2>
        <p className="mt-3 leading-relaxed">
          We may update this policy from time to time. The latest version will always be available on this
          page along with the date of the most recent change.
        </p>
      </article>
    </div>
  )
}
