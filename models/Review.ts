import mongoose, { Schema, Document, Model } from 'mongoose'

export type ReviewModerationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface IReview extends Document {
  _id: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  userName: string
  userImage?: string
  productId: mongoose.Types.ObjectId
  rating: number
  title?: string
  body?: string
  isVerified: boolean
  moderationStatus: ReviewModerationStatus
  createdAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userImage: String,
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: String,
    body: String,
    isVerified: { type: Boolean, default: false },
    // Default APPROVED preserves the current auto-publish behavior. Admins can
    // demote to REJECTED (hide) or PENDING (queue) from the moderation UI; the
    // public reviews endpoint surfaces only APPROVED records.
    moderationStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
    },
  },
  { timestamps: true },
)

ReviewSchema.index({ productId: 1, createdAt: -1 })
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true })
ReviewSchema.index({ moderationStatus: 1, createdAt: -1 })

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)
export default Review
