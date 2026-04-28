import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2D5016',
          50: '#F0F5EC',
          100: '#DCE8CF',
          200: '#B9D19F',
          300: '#8FB66B',
          400: '#5F8B3E',
          500: '#2D5016',
          600: '#264311',
          700: '#1F360D',
          800: '#1A3A0A',
          900: '#0E1F05',
        },
        turmeric: {
          DEFAULT: '#C8860A',
          50: '#FCF6E8',
          100: '#F8EBC8',
          200: '#EFD487',
          300: '#E5BC4D',
          400: '#D7A21F',
          500: '#C8860A',
          600: '#A06A07',
          700: '#774F05',
          800: '#503503',
          900: '#2A1C02',
        },
        terracotta: {
          DEFAULT: '#C1440E',
          50: '#FCEDE6',
          100: '#F8D6C4',
          200: '#F0AC85',
          300: '#E78145',
          400: '#D55E1F',
          500: '#C1440E',
          600: '#9A360B',
          700: '#732808',
          800: '#4D1B05',
          900: '#260D03',
        },
        cream: '#FDF8F0',
        parchment: '#F5EDD8',
        charcoal: '#1C1C1C',
        warmgray: '#8B7355',
      },
      fontFamily: {
        display: ['var(--font-playfair)', 'Playfair Display', 'serif'],
        body: ['var(--font-lato)', 'Lato', 'sans-serif'],
        accent: ['var(--font-cormorant)', 'Cormorant Garamond', 'serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        warm: '0 4px 20px -2px rgba(45, 80, 22, 0.08), 0 2px 8px -2px rgba(193, 68, 14, 0.04)',
        'warm-lg': '0 12px 40px -4px rgba(45, 80, 22, 0.12), 0 4px 12px -2px rgba(193, 68, 14, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-up': 'fadeUp 0.7s ease-out',
        'fade-down': 'fadeDown 0.7s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeDown: { '0%': { opacity: '0', transform: 'translateY(-20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
