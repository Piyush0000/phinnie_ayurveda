import connectDB, { isDatabaseConfigured } from './mongodb'
import SiteSettings from '@/models/SiteSettings'

export interface PublicSettings {
  storeName: string
  freeShippingMin: number
  shippingCharge: number
  currency: string
  bannerText: string
  bannerEnabled: boolean
  social: { instagram?: string; facebook?: string; twitter?: string }
}

const DEFAULTS: PublicSettings = {
  storeName: 'Thinnie Slim and Sane',
  freeShippingMin: 999,
  shippingCharge: 99,
  currency: 'INR',
  bannerText: '✦ Free shipping on orders over ₹999 — Authentic Ayurveda since the ancient days ✦',
  bannerEnabled: true,
  social: {},
}

export async function getPublicSettings(): Promise<PublicSettings> {
  if (!isDatabaseConfigured()) return DEFAULTS
  try {
    await connectDB()
    const s = await SiteSettings.findOne().lean()
    if (!s) return DEFAULTS
    return {
      storeName: s.storeName ?? DEFAULTS.storeName,
      freeShippingMin: s.freeShippingMin ?? DEFAULTS.freeShippingMin,
      shippingCharge: s.shippingCharge ?? DEFAULTS.shippingCharge,
      currency: s.currency ?? DEFAULTS.currency,
      bannerText: s.bannerText ?? DEFAULTS.bannerText,
      bannerEnabled: s.bannerEnabled ?? DEFAULTS.bannerEnabled,
      social: s.social ?? {},
    }
  } catch {
    return DEFAULTS
  }
}
