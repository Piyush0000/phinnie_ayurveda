import Link from 'next/link'
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 bg-forest-800 text-cream">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="font-display text-2xl">Phinnie Aurvadic</h3>
          <p className="mt-3 text-sm leading-relaxed text-cream/70">
            Authentic Ayurveda crafted from time-honored formulas. Pure, ethical, and made with reverence for nature.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="#" aria-label="Instagram" className="rounded-full border border-cream/30 p-2 hover:bg-cream/10">
              <Instagram size={16} />
            </a>
            <a href="#" aria-label="Facebook" className="rounded-full border border-cream/30 p-2 hover:bg-cream/10">
              <Facebook size={16} />
            </a>
            <a href="#" aria-label="Twitter" className="rounded-full border border-cream/30 p-2 hover:bg-cream/10">
              <Twitter size={16} />
            </a>
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
          <h4 className="font-display text-lg">Get in Touch</h4>
          <ul className="mt-3 space-y-2 text-sm text-cream/70">
            <li className="flex items-start gap-2"><Mail size={14} className="mt-0.5" /> hello@phinnieaurvadic.com</li>
            <li className="flex items-start gap-2"><Phone size={14} className="mt-0.5" /> +91 98765 43210</li>
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5" /> Rishikesh, Uttarakhand, India</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="container-wide flex flex-col items-center justify-between gap-3 py-5 text-xs text-cream/60 md:flex-row">
          <p>© {new Date().getFullYear()} Phinnie Aurvadic. All rights reserved.</p>
          <p>Made with reverence for nature.</p>
        </div>
      </div>
    </footer>
  )
}
