'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  value: number
  count?: number
  size?: number
  interactive?: boolean
  onChange?: (n: number) => void
  className?: string
}

export default function StarRating({
  value,
  count,
  size = 16,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= Math.round(value)
          return (
            <button
              key={n}
              type="button"
              disabled={!interactive}
              onClick={() => onChange?.(n)}
              className={cn(
                'transition',
                interactive && 'cursor-pointer hover:scale-110',
                !interactive && 'cursor-default',
              )}
              aria-label={`Rate ${n} stars`}
            >
              <Star
                size={size}
                className={filled ? 'fill-turmeric text-turmeric' : 'text-warmgray/40'}
              />
            </button>
          )
        })}
      </div>
      {typeof count === 'number' && (
        <span className="text-xs text-warmgray">({count})</span>
      )}
    </div>
  )
}
