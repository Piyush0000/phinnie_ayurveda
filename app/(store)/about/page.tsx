export const metadata = { title: 'About — Phinnie Aurvadic' }

export default function AboutPage() {
  return (
    <div className="container-narrow py-12 md:py-20">
      <header className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Our Story</p>
        <h1 className="mt-2 font-display text-5xl text-charcoal md:text-6xl">Rooted in Wisdom</h1>
        <p className="mx-auto mt-4 max-w-2xl font-accent text-xl text-warmgray">
          Three generations of vaidyas, one promise — to bring authentic Ayurveda to every home.
        </p>
      </header>
      <article className="prose prose-lg mx-auto mt-10 max-w-none text-charcoal">
        <p className="font-accent text-xl leading-relaxed">
          In the foothills of Rishikesh, where the Ganges sings its eternal song, our family has
          been crafting Ayurvedic remedies for generations. Each formula is born from
          centuries-old wisdom, prepared in copper vessels under the careful hand of our vaidyas.
        </p>
        <p className="mt-6 leading-relaxed">
          We source our herbs from trusted farmers across India — Bhringraj from the banks of the
          Yamuna, Ashwagandha from the parched soils of Rajasthan, and Brahmi from the tranquil
          ponds of Kerala. Every ingredient is harvested at its potency peak and processed using
          traditional methods that preserve its prana.
        </p>
        <h2 className="mt-12 font-display text-3xl">Our Promise</h2>
        <ul className="mt-4 space-y-3 leading-relaxed">
          <li>✦ 100% natural ingredients — no parabens, sulfates, or synthetics</li>
          <li>✦ AYUSH-certified manufacturing</li>
          <li>✦ Cruelty-free and vegan-friendly</li>
          <li>✦ Sustainably sourced and packaged</li>
          <li>✦ Backed by ancient texts and modern research</li>
        </ul>
        <h2 className="mt-12 font-display text-3xl">Why Phinnie Aurvadic?</h2>
        <p className="mt-4 leading-relaxed">
          Because true wellness is not a product — it's a relationship. Between body and mind,
          between earth and self, between tradition and modern living. We don't just bottle
          herbs; we bottle reverence. Each jar carries the prayers of the women who hand-pick our
          flowers, the focus of the vaidyas who blend them, and the love of a family that has
          done this for over a century.
        </p>
        <p className="mt-6 italic font-accent text-2xl text-forest">
          "Sarve bhavantu sukhinah — May all be happy, may all be free from illness."
        </p>
      </article>
    </div>
  )
}
