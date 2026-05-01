'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderTree,
  Settings,
  Menu,
  X,
  ExternalLink,
  Tag,
  Star,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: FolderTree },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-30 rounded-lg bg-forest-800 p-2 text-cream lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
        </div>
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform bg-forest-800 text-cream shadow-warm-lg transition-transform lg:relative lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between border-b border-cream/10 px-5 py-5">
          <Link href="/admin" className="font-display text-2xl text-cream">
            Thinnie Admin
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="rounded p-1 text-cream/70 hover:text-cream lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="px-3 py-4">
          {NAV.map((item) => {
            const Icon = item.icon
            const active =
              item.href === '/admin' ? pathname === '/admin' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  'mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition',
                  active
                    ? 'bg-turmeric text-charcoal'
                    : 'text-cream/80 hover:bg-forest-700 hover:text-cream',
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-cream/10 p-4">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-cream/70 hover:bg-forest-700 hover:text-cream"
          >
            <ExternalLink size={14} /> View store
          </Link>
        </div>
      </aside>
    </>
  )
}
