import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICoupon extends Document {
  code: string
  type: 'PERCENT' | 'FIXED'
  value: number
  minOrder?: number
  maxUses?: number
  usedCount: number
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    type: { type: String, enum: ['PERCENT', 'FIXED'], required: true },
    value: { type: Number, required: true },
    minOrder: Number,
    maxUses: Number,
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    expiresAt: Date,
  },
  { timestamps: true },
)

const Coupon: Model<ICoupon> =
  mongoose.models.Coupon || mongoose.model<ICoupon>('Coupon', CouponSchema)
export default Coupon
