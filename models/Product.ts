import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IProduct extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  description: string
  shortDesc?: string
  price: number
  comparePrice?: number
  costPrice?: number
  sku?: string
  stock: number
  images: string[]
  categoryId: mongoose.Types.ObjectId
  categoryName: string
  categorySlug: string
  tags: string[]
  ingredients?: string
  benefits: string[]
  howToUse?: string
  weight?: string
  isActive: boolean
  isFeatured: boolean
  rating: number
  reviewCount: number
  soldCount: number
  metaTitle?: string
  metaDescription?: string
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDesc: String,
    price: { type: Number, required: true },
    comparePrice: Number,
    costPrice: Number,
    sku: { type: String, sparse: true },
    stock: { type: Number, default: 0 },
    images: { type: [String], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    categoryName: { type: String, required: true },
    categorySlug: { type: String, required: true },
    tags: { type: [String], default: [] },
    ingredients: String,
    benefits: { type: [String], default: [] },
    howToUse: String,
    weight: String,
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    metaTitle: String,
    metaDescription: String,
  },
  { timestamps: true },
)

ProductSchema.index({ slug: 1 })
ProductSchema.index({ categoryId: 1 })
ProductSchema.index({ categorySlug: 1 })
ProductSchema.index({ isActive: 1, isFeatured: 1 })
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' })

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
export default Product
