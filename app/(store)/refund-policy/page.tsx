import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund &amp; Return Policy',
  description:
    'Refunds at Thinnie Ayurvedic are issued only for damaged or incorrect wellness products, requested within 3–5 days of delivery.',
  alternates: { canonical: '/refund-policy' },
  openGraph: {
    title: 'Refund Policy — Thinnie Ayurvedic',
    description: 'Read our refund and return policy for orders placed on Thinnie Ayurvedic.',
  },
}

export default function RefundPolicyPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Legal</p>
        <h1 className="mt-2 font-display text-5xl text-charcoal md:text-6xl">Refund &amp; Return Policy</h1>
        <p className="mx-auto mt-4 max-w-2xl font-accent text-xl text-warmgray">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <article className="prose prose-lg mx-auto mt-10 max-w-none text-charcoal">
        <p className="leading-relaxed">
          Because our products are wellness supplements and herbal items meant for personal consumption,
          we follow a strict refund policy to ensure quality and hygiene.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">1. Eligibility for Refund</h2>
        <p className="mt-3 leading-relaxed">
          Refunds or replacements are issued <strong>only</strong> in the following cases:
        </p>
        <ul className="mt-3 space-y-2 leading-relaxed">
          <li>✦ The product was delivered damaged, broken or with a leaking seal</li>
          <li>✦ The wrong product was sent to you</li>
          <li>✦ The product is missing items from its declared contents</li>
        </ul>

        <h2 className="mt-10 font-display text-3xl text-forest">2. Time Window</h2>
        <p className="mt-3 leading-relaxed">
          You must raise a refund or replacement request <strong>within 3 to 5 days of delivery</strong>.
          Requests received after this window will not be eligible for a refund or replacement.
        </p>
        <p className="mt-3 leading-relaxed">
          To raise a request, email us at{' '}
          <a href="mailto:hello@thinnieayurvedic.com" className="text-forest underline">
            hello@thinnieayurvedic.com
          </a>{' '}
          with your order number, a short description of the issue and clear photographs of the product
          and outer packaging.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">3. Non-Refundable Items</h2>
        <p className="mt-3 leading-relaxed">
          For health, hygiene, and safety reasons, we <strong>do not</strong> accept returns or refunds on:
        </p>
        <ul className="mt-3 space-y-2 leading-relaxed">
          <li>✦ Products that have been opened, used, or had their tamper seal broken</li>
          <li>✦ Products purchased on clearance or marked &ldquo;final sale&rdquo;</li>
          <li>✦ Refunds requested only because of a change of mind or personal preference</li>
          <li>✦ Products damaged due to misuse or improper storage after delivery</li>
        </ul>

        <h2 className="mt-10 font-display text-3xl text-forest">4. Refund Processing Time</h2>
        <p className="mt-3 leading-relaxed">
          Once a refund is approved, the amount will be credited back to your original payment method
          within <strong>5 to 7 business days</strong>. Depending on your bank or card issuer, it may take
          a few additional days for the credit to reflect in your statement.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">5. Cancellation Before Dispatch</h2>
        <p className="mt-3 leading-relaxed">
          You may cancel an order any time before it is dispatched by writing to us. Once dispatched,
          orders cannot be cancelled and the standard refund policy above will apply.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">6. Contact</h2>
        <p className="mt-3 leading-relaxed">
          For all refund or return queries, please reach us at{' '}
          <a href="mailto:hello@thinnieayurvedic.com" className="text-forest underline">
            hello@thinnieayurvedic.com
          </a>{' '}
          or call <strong>+91 98765 43210</strong> (Mon–Sat, 10am–7pm IST).
        </p>
      </article>
    </div>
  )
}
