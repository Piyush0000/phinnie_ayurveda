import mongoose, { Schema, Document, Model } from 'mongoose'

export type TestimonialApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ITestimonial extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  rating: number
  comment: string
  avatar?: string
  location?: string
  isActive: boolean
  approvalStatus: TestimonialApprovalStatus
  source: 'ADMIN' | 'CUSTOMER'
  createdAt: Date
  updatedAt: Date
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 2000 },
    avatar: { type: String, trim: true },
    location: { type: String, trim: true, maxlength: 120 },
    isActive: { type: Boolean, default: true },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'APPROVED',
    },
    source: {
      type: String,
      enum: ['ADMIN', 'CUSTOMER'],
      default: 'ADMIN',
    },
  },
  { timestamps: true },
)

TestimonialSchema.index({ approvalStatus: 1, isActive: 1, createdAt: -1 })

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema)
export default Testimonial
