import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, MapPin } from 'lucide-react'

interface FooterProps {
  social?: { instagram?: string; facebook?: string; twitter?: string }
}

export default function Footer({ social }: FooterProps = {}) {
  const links = [
    { href: social?.instagram, label: 'Instagram', Icon: Instagram },
    { href: social?.facebook, label: 'Facebook', Icon: Facebook },
    { href: social?.twitter, label: 'Twitter', Icon: Twitter },
  ]
  return (
    <footer className="mt-16 bg-forest-800 text-cream">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <h3 className="font-display text-2xl">SLim and Saane</h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Authentic Ayurveda crafted from time-honored formulas. Pure, ethical, and made with reverence for nature.
          </p>
          <div className="mt-5 flex gap-3">
            {links.map(({ href, label, Icon }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-cream/30 p-2 hover:bg-cream/10"
                >
                  <Icon size={16} />
                </a>
              ) : null,
            )}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li><Link href="/category/hair-care" className="hover:text-cream">Hair Care</Link></li>
            <li><Link href="/category/skin-care" className="hover:text-cream">Skin Care</Link></li>
            <li><Link href="/category/wellness" className="hover:text-cream">Wellness</Link></li>
            <li><Link href="/category/digestive-health" className="hover:text-cream">Digestive</Link></li>
            <li><Link href="/category/immunity" className="hover:text-cream">Immunity</Link></li>
            <li><Link href="/shop" className="hover:text-cream">View All</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Help</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li><Link href="/about" className="hover:text-cream">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-cream">Contact</Link></li>
            <li><Link href="/orders" className="hover:text-cream">Track Order</Link></li>
            <li><Link href="/profile" className="hover:text-cream">My Account</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li><Link href="/terms-and-conditions" className="hover:text-cream">Terms &amp; Conditions</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-cream">Privacy Policy</Link></li>
            <li><Link href="/refund-policy" className="hover:text-cream">Refund Policy</Link></li>
            <li><Link href="/disclaimer" className="hover:text-cream">Disclaimer</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-5">
          <h4 className="font-display text-lg">Get in Touch</h4>
          <ul className="mt-3 grid gap-2 text-sm text-cream/70 md:grid-cols-3">
            <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5" /> hello@thinnie.in</li>
            <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5" /> support@thinnie.in</li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> Khewat no. 491, Khatauni No. 583, ward no. 10 Lakhpat colony Karnal 132116</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="container-wide py-4 text-center text-[11px] leading-relaxed text-cream/60">
          Our products are wellness supplements and are not intended to diagnose, treat, cure, or prevent any disease.
          Please consult a qualified healthcare professional before use.
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="container-wide flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/60 md:flex-row">
          <p>© {new Date().getFullYear()} SLim and Saane. All rights reserved.</p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/terms-and-conditions" className="hover:text-cream">Terms</Link>
            <Link href="/privacy-policy" className="hover:text-cream">Privacy</Link>
            <Link href="/refund-policy" className="hover:text-cream">Refunds</Link>
            <Link href="/disclaimer" className="hover:text-cream">Disclaimer</Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
