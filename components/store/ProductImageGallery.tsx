'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function ProductImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)
  const list = images?.length ? images : ['']
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-parchment shadow-warm">
        {list[active] && (
          <Image
            src={list[active]}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        )}
      </div>
      {list.length > 1 && (
        <div className="flex gap-2">
          {list.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                'relative h-20 w-20 overflow-hidden rounded-lg border-2 transition',
                i === active ? 'border-forest' : 'border-transparent',
              )}
            >
              {src && <Image src={src} alt={`${name} ${i + 1}`} fill sizes="80px" className="object-cover" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
