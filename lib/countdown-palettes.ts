import type { CountdownTheme } from './bundle-offer'

export interface CountdownPalette {
  label: string
  bg: string
  balloon: [string, string]
  gift: string
  ribbon: string
  digit: string
}

/** Colour themes for the top countdown bar; picked per offer in admin. */
export const COUNTDOWN_PALETTES: Record<CountdownTheme, CountdownPalette> = {
  purple: {
    label: 'Royal purple',
    bg: 'linear-gradient(90deg, #2a0b4a 0%, #4b1680 45%, #5a1d95 55%, #2a0b4a 100%)',
    balloon: ['#c084fc', '#7e22ce'],
    gift: '#6d28d9',
    ribbon: '#f5c542',
    digit: '#3b0d6b',
  },
  maroon: {
    label: 'Festive maroon',
    bg: 'linear-gradient(90deg, #5a0a1b 0%, #a3162f 50%, #5a0a1b 100%)',
    balloon: ['#fb7185', '#be123c'],
    gift: '#9f1239',
    ribbon: '#f5c542',
    digit: '#7a0f24',
  },
  green: {
    label: 'Thinnie green',
    bg: 'linear-gradient(90deg, #0e1f05 0%, #2D5016 50%, #0e1f05 100%)',
    balloon: ['#86efac', '#15803d'],
    gift: '#166534',
    ribbon: '#f5c542',
    digit: '#1A3A0A',
  },
  saffron: {
    label: 'Saffron',
    bg: 'linear-gradient(90deg, #7c2d12 0%, #ea580c 50%, #7c2d12 100%)',
    balloon: ['#fde047', '#f59e0b'],
    gift: '#b45309',
    ribbon: '#be123c',
    digit: '#7c2d12',
  },
  pink: {
    label: 'Rani pink',
    bg: 'linear-gradient(90deg, #500724 0%, #be185d 50%, #500724 100%)',
    balloon: ['#f9a8d4', '#db2777'],
    gift: '#9d174d',
    ribbon: '#f5c542',
    digit: '#831843',
  },
}
