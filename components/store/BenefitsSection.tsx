'use client'

import { Leaf, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import Reveal from './Reveal'

const BENEFITS = [
  { icon: Leaf, title: '100% Natural', desc: 'Pure herbs sourced from trusted Ayurvedic farms across India.' },
  { icon: ShieldCheck, title: 'AYUSH Certified', desc: 'Every formula tested for purity, potency, and safety.' },
  { icon: Truck, title: 'Free Shipping', desc: 'Complimentary delivery on every order above ₹999.' },
  { icon: Sparkles, title: 'Cruelty-Free', desc: 'Ethically made — never tested on animals.' },
]

export default function BenefitsSection() {
  return (
    <section className="bg-parchment/50">
      <div className="container-wide py-14 md:py-20">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="flex h-full flex-col items-center rounded-2xl border border-forest/10 bg-cream/80 p-6 text-center shadow-warm backdrop-blur supports-[backdrop-filter]:bg-cream/60">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-turmeric/15 text-turmeric-700 ring-1 ring-turmeric/20">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-display text-xl text-charcoal">{title}</h3>
                <p className="mt-2 text-sm text-warmgray">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
