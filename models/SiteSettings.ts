import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISocialLinks {
  instagram?: string
  facebook?: string
  twitter?: string
}

export interface ISiteSettings extends Document {
  storeName: string
  storeEmail?: string
  storePhone?: string
  storeAddress?: string
  currency: string
  freeShippingMin: number
  shippingCharge: number
  taxRate: number
  bannerText?: string
  bannerEnabled: boolean
  social: ISocialLinks
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    storeName: { type: String, default: 'SLim and Saane' },
    storeEmail: String,
    storePhone: String,
    storeAddress: String,
    currency: { type: String, default: 'INR' },
    freeShippingMin: { type: Number, default: 999 },
    shippingCharge: { type: Number, default: 99 },
    taxRate: { type: Number, default: 0 },
    bannerText: { type: String, default: 'Free shipping on orders over ₹999 — Authentic Ayurveda since the ancient days' },
    bannerEnabled: { type: Boolean, default: true },
    social: {
      instagram: String,
      facebook: String,
      twitter: String,
    },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true },
)

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)
export default SiteSettings
