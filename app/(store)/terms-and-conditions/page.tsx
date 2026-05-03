import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description:
    'Terms & Conditions for purchasing wellness supplements and herbal products from Thinnie Ayurvedic.',
  alternates: { canonical: '/terms-and-conditions' },
  openGraph: {
    title: 'Terms & Conditions — Thinnie Ayurvedic',
    description: 'Read the terms that apply to orders placed on Thinnie Ayurvedic.',
  },
}

export default function TermsAndConditionsPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Legal</p>
        <h1 className="mt-2 font-display text-5xl text-charcoal md:text-6xl">Terms &amp; Conditions</h1>
        <p className="mx-auto mt-4 max-w-2xl font-accent text-xl text-warmgray">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <article className="prose prose-lg mx-auto mt-10 max-w-none text-charcoal">
        <p className="leading-relaxed">
          By placing an order on Thinnie Ayurvedic, you agree to the terms outlined below. Please read them
          carefully before completing your purchase.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">1. Nature of Our Products</h2>
        <p className="mt-3 leading-relaxed">
          All items sold on this website are wellness supplements and herbal wellness products. They are
          <strong> not intended to diagnose, treat, cure, or prevent any disease</strong>. Our products are
          meant to support a balanced lifestyle and traditional wellness routines.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">2. Order Acceptance &amp; Availability</h2>
        <p className="mt-3 leading-relaxed">
          All orders are subject to product availability. Once an order is placed, it is treated as an offer
          which we may accept or decline. An order is confirmed only after we send a written confirmation
          email or SMS.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">3. Cancellation &amp; Refusal of Orders</h2>
        <p className="mt-3 leading-relaxed">
          We reserve the right to cancel, refuse or limit any order at our discretion — including but not
          limited to: stock unavailability, errors in product or pricing information, suspected fraud, or
          orders that do not comply with our policies. If an order you have paid for is cancelled by us,
          the full amount will be refunded to your original payment method.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">4. Pricing</h2>
        <p className="mt-3 leading-relaxed">
          All prices are listed in Indian Rupees (INR) and include applicable taxes unless otherwise
          stated. Prices, offers and shipping charges may change at any time without prior notice. The
          price shown on the order confirmation is the final price applicable to your order.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">5. Use of the Website</h2>
        <p className="mt-3 leading-relaxed">
          You agree to use this website only for lawful purposes and in a manner that does not infringe
          the rights of, or restrict or inhibit the use and enjoyment of, the site by any third party.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">6. Intellectual Property</h2>
        <p className="mt-3 leading-relaxed">
          All content on this website — including text, graphics, logos, images, and product photography —
          is the property of Thinnie Ayurvedic and is protected by applicable copyright and trademark laws.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">7. Governing Law</h2>
        <p className="mt-3 leading-relaxed">
          These terms are governed by the laws of India. Any disputes shall be subject to the exclusive
          jurisdiction of the courts at Rishikesh, Uttarakhand.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">8. Contact</h2>
        <p className="mt-3 leading-relaxed">
          For any questions about these terms, write to us at{' '}
          <a href="mailto:hello@thinnieayurvedic.com" className="text-forest underline">
            hello@thinnieayurvedic.com
          </a>
          .
        </p>
      </article>
    </div>
  )
}
