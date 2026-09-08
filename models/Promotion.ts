import mongoose, { Schema, Document, Model } from 'mongoose'

export type PromotionPlacement = 'HERO' | 'STRIP'

export interface IPromotion extends Document {
  _id: mongoose.Types.ObjectId
  placement: PromotionPlacement
  badgeText?: string
  title: string
  subtitle?: string
  highlight1?: string
  highlight2?: string
  description?: string
  imageBadge?: string
  imageUrl?: string
  publicId?: string
  ctaText: string
  ctaLink: string
  footnote?: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

const PromotionSchema = new Schema<IPromotion>(
  {
    placement: { type: String, enum: ['HERO', 'STRIP'], required: true, default: 'HERO' },
    badgeText: { type: String, trim: true, maxlength: 80 },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    subtitle: { type: String, trim: true, maxlength: 160 },
    highlight1: { type: String, trim: true, maxlength: 80 },
    highlight2: { type: String, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 400 },
    imageBadge: { type: String, trim: true, maxlength: 40 },
    imageUrl: { type: String, trim: true },
    publicId: { type: String, trim: true },
    ctaText: { type: String, trim: true, maxlength: 40, default: 'Shop Now' },
    ctaLink: { type: String, trim: true, default: '/shop' },
    footnote: { type: String, trim: true, maxlength: 200 },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

PromotionSchema.index({ placement: 1, isActive: 1, sortOrder: 1, createdAt: -1 })

const Promotion: Model<IPromotion> =
  mongoose.models.Promotion || mongoose.model<IPromotion>('Promotion', PromotionSchema)
export default Promotion
