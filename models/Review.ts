import mongoose, { Schema, Document, Model } from 'mongoose'

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
  },
  { timestamps: true },
)

ReviewSchema.index({ productId: 1, createdAt: -1 })
ReviewSchema.index({ userId: 1, productId: 1 }, { unique: true })

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema)
export default Review
