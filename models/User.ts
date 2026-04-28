import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IAddress {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  phone: string
  isDefault: boolean
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId
  name?: string
  email: string
  emailVerified?: Date
  image?: string
  password?: string
  role: 'CUSTOMER' | 'ADMIN'
  phone?: string
  addresses: IAddress[]
  createdAt: Date
  updatedAt: Date
}

const AddressSchema = new Schema<IAddress>(
  {
    name: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
)

const UserSchema = new Schema<IUser>(
  {
    name: String,
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    emailVerified: Date,
    image: String,
    password: String,
    role: { type: String, enum: ['CUSTOMER', 'ADMIN'], default: 'CUSTOMER' },
    phone: String,
    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true },
)

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
export default User
