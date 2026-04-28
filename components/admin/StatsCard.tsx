import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  title: string
  value: string
  changePct?: number
  icon: LucideIcon
  iconColor?: string
}

export default function StatsCard({ title, value, changePct, icon: Icon, iconColor = 'text-forest' }: Props) {
  const isPositive = (changePct ?? 0) >= 0
  return (
    <div className="rounded-2xl border border-forest/10 bg-cream p-5 shadow-warm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-warmgray">{title}</p>
          <p className="mt-2 font-display text-3xl text-charcoal">{value}</p>
          {typeof changePct === 'number' && (
            <p
              className={cn(
                'mt-1 inline-flex items-center gap-0.5 text-xs font-semibold',
                isPositive ? 'text-forest' : 'text-terracotta',
              )}
            >
              {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(changePct).toFixed(1)}% vs last month
            </p>
          )}
        </div>
        <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl bg-forest/10', iconColor)}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}
