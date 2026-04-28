import { Leaf, ShieldCheck, Truck, Sparkles } from 'lucide-react'

const BENEFITS = [
  { icon: Leaf, title: '100% Natural', desc: 'Pure herbs sourced from trusted Ayurvedic farms across India.' },
  { icon: ShieldCheck, title: 'AYUSH Certified', desc: 'Every formula tested for purity, potency, and safety.' },
  { icon: Truck, title: 'Free Shipping', desc: 'Complimentary delivery on every order above ₹999.' },
  { icon: Sparkles, title: 'Cruelty-Free', desc: 'Ethically made — never tested on animals.' },
]

export default function BenefitsSection() {
  return (
    <section className="bg-parchment/60">
      <div className="container-wide py-12 md:py-16">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col items-center rounded-2xl bg-cream p-6 text-center shadow-warm"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
                <Icon size={24} />
              </div>
              <h3 className="mt-4 font-display text-xl text-charcoal">{title}</h3>
              <p className="mt-2 text-sm text-warmgray">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
