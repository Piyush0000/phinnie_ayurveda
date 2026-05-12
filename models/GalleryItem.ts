import mongoose, { Schema, Document, Model } from 'mongoose'

export type GalleryItemType = 'IMAGE' | 'VIDEO'

export interface IGalleryItem extends Document {
  _id: mongoose.Types.ObjectId
  url: string
  type: GalleryItemType
  caption?: string
  publicId?: string
  sortOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    url: { type: String, required: true, trim: true },
    type: { type: String, enum: ['IMAGE', 'VIDEO'], required: true },
    caption: { type: String, trim: true, maxlength: 240 },
    publicId: { type: String, trim: true },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
)

GalleryItemSchema.index({ isActive: 1, sortOrder: 1, createdAt: -1 })

const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema)
export default GalleryItem
