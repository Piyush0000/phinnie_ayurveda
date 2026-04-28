'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages: (number | '…')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i)
    }
    if (page < totalPages - 2) pages.push('…')
    pages.push(totalPages)
  }

  return (
    <nav className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-warmgray/30 text-charcoal disabled:opacity-40 hover:bg-parchment"
        aria-label="Previous"
      >
        <ChevronLeft size={16} />
      </button>
      {pages.map((p, idx) =>
        p === '…' ? (
          <span key={`e${idx}`} className="px-2 text-warmgray">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={cn(
              'h-9 min-w-9 rounded-lg border px-2.5 text-sm font-semibold transition',
              p === page
                ? 'border-forest bg-forest text-cream'
                : 'border-warmgray/30 text-charcoal hover:bg-parchment',
            )}
          >
            {p}
          </button>
        ),
      )}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-warmgray/30 text-charcoal disabled:opacity-40 hover:bg-parchment"
        aria-label="Next"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  )
}
