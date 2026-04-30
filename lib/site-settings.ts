import connectDB, { isDatabaseConfigured } from './mongodb'
import SiteSettings from '@/models/SiteSettings'

export interface PublicSettings {
  storeName: string
  freeShippingMin: number
  bannerText: string
  bannerEnabled: boolean
  social: { instagram?: string; facebook?: string; twitter?: string }
}

const DEFAULTS: PublicSettings = {
  storeName: 'Phinnie Aurvadic',
  freeShippingMin: 999,
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
      bannerText: s.bannerText ?? DEFAULTS.bannerText,
      bannerEnabled: s.bannerEnabled ?? DEFAULTS.bannerEnabled,
      social: s.social ?? {},
    }
  } catch {
    return DEFAULTS
  }
}
