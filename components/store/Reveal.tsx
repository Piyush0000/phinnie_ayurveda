'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

interface RevealProps {
  children: ReactNode
  direction?: Direction
  delay?: number
  duration?: number
  className?: string
  once?: boolean
}

const offsetFor = (d: Direction): { x: number; y: number } => {
  switch (d) {
    case 'up':
      return { x: 0, y: 28 }
    case 'down':
      return { x: 0, y: -28 }
    case 'left':
      return { x: 28, y: 0 }
    case 'right':
      return { x: -28, y: 0 }
    default:
      return { x: 0, y: 0 }
  }
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.7,
  className,
  once = true,
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const start = prefersReducedMotion ? { opacity: 0 } : { opacity: 0, ...offsetFor(direction) }
  const end = { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      className={className}
      initial={start}
      whileInView={end}
      viewport={{ once, amount: 0.2 }}
      transition={{
        duration: prefersReducedMotion ? 0.3 : duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
