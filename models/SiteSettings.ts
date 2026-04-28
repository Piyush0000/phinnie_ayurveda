import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ISiteSettings extends Document {
  storeName: string
  storeEmail?: string
  storePhone?: string
  storeAddress?: string
  currency: string
  freeShippingMin: number
  shippingCharge: number
  taxRate: number
  metaTitle?: string
  metaDescription?: string
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    storeName: { type: String, default: 'Phinnie Aurvadic' },
    storeEmail: String,
    storePhone: String,
    storeAddress: String,
    currency: { type: String, default: 'INR' },
    freeShippingMin: { type: Number, default: 999 },
    shippingCharge: { type: Number, default: 99 },
    taxRate: { type: Number, default: 18 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true },
)

const SiteSettings: Model<ISiteSettings> =
  mongoose.models.SiteSettings ||
  mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema)
export default SiteSettings
