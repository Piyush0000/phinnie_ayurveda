'use client'

import { Minus, Plus } from 'lucide-react'

interface Props {
  value: number
  max?: number
  onChange: (n: number) => void
}

export default function QuantitySelector({ value, max = 99, onChange }: Props) {
  return (
    <div className="inline-flex items-center rounded-lg border border-warmgray/30 bg-cream">
      <button
        onClick={() => onChange(Math.max(1, value - 1))}
        className="p-2.5 hover:bg-parchment disabled:opacity-40"
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-[3rem] text-center font-semibold">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="p-2.5 hover:bg-parchment disabled:opacity-40"
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
