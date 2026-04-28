import mongoose, { Schema, Document, Model } from 'mongoose'

export interface ICategory extends Document {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  description?: string
  image?: string
  productCount: number
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: String,
    image: String,
    productCount: { type: Number, default: 0 },
  },
  { timestamps: true },
)

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema)
export default Category
