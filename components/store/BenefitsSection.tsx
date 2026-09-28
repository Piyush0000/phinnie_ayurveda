'use client'

import { Leaf, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import Reveal from './Reveal'

interface BenefitsSectionProps {
  freeShippingMin?: number
}

export default function BenefitsSection({ freeShippingMin = 999 }: BenefitsSectionProps) {
  const BENEFITS = [
    { icon: Leaf, title: '100% Natural', desc: 'Pure herbs sourced from trusted Ayurvedic farms across India.', color: '#2D5016', tint: '#eaf4e0' },
    { icon: ShieldCheck, title: 'AYUSH Certified', desc: 'Every formula tested for purity, potency, and safety.', color: '#ea580c', tint: '#fff1e6' },
    { icon: Truck, title: 'Free Shipping', desc: `Complimentary delivery on every order above ₹${freeShippingMin}.`, color: '#db2777', tint: '#fdebf3' },
    { icon: Sparkles, title: 'Cruelty-Free', desc: 'Ethically made — never tested on animals.', color: '#7e22ce', tint: '#f3e9fd' },
  ]
  return (
    <section className="bg-gradient-to-br from-[#fff6e5] via-cream to-[#fdf0f6]">
      <div className="container-wide py-14 md:py-20">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, desc, color, tint }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div
                className="flex h-full flex-col items-center rounded-2xl border-t-4 p-6 text-center shadow-warm transition hover:-translate-y-1 hover:shadow-warm-lg"
                style={{ borderColor: color, background: tint }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md ring-4 ring-white"
                  style={{ background: color }}
                >
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 font-display text-xl" style={{ color }}>{title}</h3>
                <p className="mt-2 text-sm text-warmgray">{desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
