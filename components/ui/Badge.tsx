import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

type Variant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  children: ReactNode
  variant?: Variant
  className?: string
}

const variantClasses: Record<Variant, string> = {
  default: 'bg-forest-100 text-forest-700',
  success: 'bg-green-100 text-green-800',
  warning: 'bg-turmeric-100 text-turmeric-800',
  danger: 'bg-terracotta-100 text-terracotta-700',
  info: 'bg-blue-100 text-blue-800',
  neutral: 'bg-warmgray/15 text-warmgray',
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
