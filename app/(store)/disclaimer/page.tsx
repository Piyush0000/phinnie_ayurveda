import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Disclaimer',
  description:
    'Important disclaimer about the wellness products and information offered by Thinnie Aurvadic.',
  alternates: { canonical: '/disclaimer' },
  openGraph: {
    title: 'Disclaimer — Thinnie Aurvadic',
    description: 'Important information about our wellness products and content.',
  },
}

export default function DisclaimerPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Legal</p>
        <h1 className="mt-2 font-display text-5xl text-charcoal md:text-6xl">Disclaimer</h1>
        <p className="mx-auto mt-4 max-w-2xl font-accent text-xl text-warmgray">
          Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>

      <article className="prose prose-lg mx-auto mt-10 max-w-none text-charcoal">
        <h2 className="mt-2 font-display text-3xl text-forest">Not Medical Advice</h2>
        <p className="mt-3 leading-relaxed">
          The information, articles, and product descriptions on Thinnie Aurvadic are provided for general
          informational and educational purposes only. <strong>They are not a substitute for medical
          advice, diagnosis, or any form of professional healthcare.</strong>
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">Consult a Doctor</h2>
        <p className="mt-3 leading-relaxed">
          Always consult a qualified physician or registered Ayurvedic practitioner before starting any
          new wellness supplement, especially if you are pregnant, nursing, taking prescription
          medication, or have an existing health condition. Discontinue use and seek medical guidance if
          you experience any adverse reaction.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">No Disease Claims</h2>
        <p className="mt-3 leading-relaxed">
          Our products are wellness supplements and herbal wellness products. They are{' '}
          <strong>not intended to diagnose, treat, cure, or prevent any disease</strong>. Any references to
          traditional uses are based on Ayurvedic literature and not on modern medical claims.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">Individual Results May Vary</h2>
        <p className="mt-3 leading-relaxed">
          Wellness outcomes are personal and depend on lifestyle, diet, body type and many other factors.
          Testimonials shared on our website reflect the personal experience of individuals and are not a
          guarantee that you will experience the same results.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">External Links</h2>
        <p className="mt-3 leading-relaxed">
          Our website may contain links to third-party websites. Thinnie Aurvadic is not responsible for
          the content, accuracy or practices of those external sites.
        </p>

        <h2 className="mt-10 font-display text-3xl text-forest">Contact</h2>
        <p className="mt-3 leading-relaxed">
          For questions about this disclaimer, write to us at{' '}
          <a href="mailto:hello@thinnieaurvadic.com" className="text-forest underline">
            hello@thinnieaurvadic.com
          </a>
          .
        </p>
      </article>
    </div>
  )
}
