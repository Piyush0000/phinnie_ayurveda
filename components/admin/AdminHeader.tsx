'use client'

import { useSession, signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

export default function AdminHeader({ title }: { title: string }) {
  const { data: session } = useSession()
  return (
    <header className="flex items-center justify-between border-b border-forest/10 bg-cream px-6 py-4 lg:px-8">
      <h1 className="font-display text-2xl text-forest md:text-3xl">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="hidden text-right text-sm md:block">
          <div className="font-semibold text-charcoal">{session?.user?.name}</div>
          <div className="text-xs text-warmgray">{session?.user?.email}</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-forest font-display text-cream">
          {session?.user?.name?.charAt(0).toUpperCase() ?? 'A'}
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="rounded-lg p-2 text-warmgray hover:bg-parchment"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
