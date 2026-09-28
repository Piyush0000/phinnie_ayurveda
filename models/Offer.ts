import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IOfferTier {
  quantity: number
  price: number
}

export interface IOffer extends Document {
  _id: mongoose.Types.ObjectId
  title: string
  subtitle?: string
  countdownLabel?: string
  footnote?: string
  ctaText: string
  ctaLink: string
  imageUrl?: string
  publicId?: string
  tiers: IOfferTier[]
  productIds: mongoose.Types.ObjectId[]
  combineWithCoupons: boolean
  showCountdownBar: boolean
  countdownTheme: string
  isActive: boolean
  startsAt?: Date
  endsAt?: Date
  createdAt: Date
  updatedAt: Date
}

const OfferSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    subtitle: { type: String, trim: true, maxlength: 200 },
    countdownLabel: { type: String, trim: true, maxlength: 80 },
    footnote: { type: String, trim: true, maxlength: 200 },
    ctaText: { type: String, trim: true, maxlength: 40, default: 'Shop the Offer' },
    ctaLink: { type: String, trim: true, default: '/shop' },
    imageUrl: { type: String, trim: true },
    publicId: { type: String, trim: true },
    tiers: [
      {
        _id: false,
        quantity: { type: Number, required: true, min: 2 },
        price: { type: Number, required: true, min: 1 },
      },
    ],
    productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
    combineWithCoupons: { type: Boolean, default: false },
    showCountdownBar: { type: Boolean, default: true },
    countdownTheme: { type: String, default: 'purple' },
    isActive: { type: Boolean, default: true },
    startsAt: Date,
    endsAt: Date,
  },
  { timestamps: true },
)

OfferSchema.index({ isActive: 1, updatedAt: -1 })

const Offer: Model<IOffer> = mongoose.models.Offer || mongoose.model<IOffer>('Offer', OfferSchema)
export default Offer
