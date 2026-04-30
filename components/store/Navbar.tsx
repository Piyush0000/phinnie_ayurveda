'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingBag, Search, User, Menu, X, LogOut, Package, Heart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/category/hair-care', label: 'Hair' },
  { href: '/category/skin-care', label: 'Skin' },
  { href: '/category/wellness', label: 'Wellness' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

interface NavbarProps {
  bannerText?: string | null
  storeName?: string
}

export default function Navbar({ bannerText, storeName = 'Phinnie Aurvadic' }: NavbarProps = {}) {
  const { data: session } = useSession()
  const itemCount = useCartStore((s) => s.getItemCount())
  const openCart = useCartStore((s) => s.openCart)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all ${
          scrolled ? 'bg-cream/95 backdrop-blur shadow-warm' : 'bg-cream'
        }`}
      >
        {bannerText && (
          <div className="border-b border-forest/10 bg-forest text-cream">
            <div className="container-wide flex h-8 items-center justify-center text-xs tracking-wide">
              <span className="opacity-90">{bannerText}</span>
            </div>
          </div>
        )}
        <div className="container-wide flex h-16 items-center justify-between gap-4 lg:h-20">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-forest hover:bg-parchment lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <Link href="/" className="flex items-center gap-2 font-display text-2xl font-semibold text-forest lg:text-3xl">
            <LeafIcon className="h-7 w-7 text-turmeric" />
            <span className="tracking-tight">{storeName}</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-semibold text-charcoal hover:text-forest"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/shop"
              className="hidden rounded-lg p-2 text-forest hover:bg-parchment md:inline-flex"
              aria-label="Search"
            >
              <Search size={20} />
            </Link>
            <Link
              href="/profile"
              className="hidden rounded-lg p-2 text-forest hover:bg-parchment md:inline-flex"
              aria-label="Wishlist"
            >
              <Heart size={20} />
            </Link>
            <div className="relative">
              <button
                onClick={() => setUserMenu((v) => !v)}
                className="rounded-lg p-2 text-forest hover:bg-parchment"
                aria-label="Account"
              >
                <User size={20} />
              </button>
              {userMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-forest/10 bg-cream shadow-warm-lg"
                  onMouseLeave={() => setUserMenu(false)}
                >
                  {session?.user ? (
                    <div className="py-1">
                      <div className="border-b border-forest/10 px-4 py-3">
                        <div className="truncate text-sm font-semibold text-charcoal">
                          {session.user.name ?? 'Account'}
                        </div>
                        <div className="truncate text-xs text-warmgray">{session.user.email}</div>
                      </div>
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-parchment">
                        <User size={16} /> Profile
                      </Link>
                      <Link href="/orders" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-parchment">
                        <Package size={16} /> My Orders
                      </Link>
                      {session.user.role === 'ADMIN' && (
                        <Link href="/admin" className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-turmeric-700 hover:bg-parchment">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex w-full items-center gap-2 border-t border-forest/10 px-4 py-2 text-sm hover:bg-parchment"
                      >
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  ) : (
                    <div className="py-1">
                      <Link href="/login" className="block px-4 py-2 text-sm hover:bg-parchment">
                        Sign in
                      </Link>
                      <Link href="/register" className="block px-4 py-2 text-sm hover:bg-parchment">
                        Create account
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={openCart}
              className="relative rounded-lg p-2 text-forest hover:bg-parchment"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              {mounted && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-cream">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-charcoal/60" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-cream p-6 shadow-warm-lg animate-fade-in">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-2 text-forest hover:bg-parchment"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            <Link href="/" onClick={() => setMobileOpen(false)} className="font-display text-2xl text-forest">
              {storeName}
            </Link>
            <nav className="mt-8 flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 font-semibold text-charcoal hover:bg-parchment hover:text-forest"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}

function LeafIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z" />
    </svg>
  )
}
