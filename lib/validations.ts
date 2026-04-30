import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type RegisterInput = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const addressSchema = z.object({
  name: z.string().min(2),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Phone must be a valid 10-digit Indian number'),
  email: z.string().email(),
})
export type AddressInput = z.infer<typeof addressSchema>

export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1, 'Cart cannot be empty'),
  couponCode: z.string().optional(),
  notes: z.string().optional(),
})
export type CheckoutInput = z.infer<typeof checkoutSchema>

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().min(10),
  shortDesc: z.string().optional(),
  price: z.number().nonnegative(),
  comparePrice: z.number().nonnegative().optional(),
  costPrice: z.number().nonnegative().optional(),
  sku: z.string().optional(),
  stock: z.number().int().nonnegative(),
  images: z.array(z.string().url()).default([]),
  categoryId: z.string(),
  tags: z.array(z.string()).default([]),
  ingredients: z.string().optional(),
  benefits: z.array(z.string()).default([]),
  howToUse: z.string().optional(),
  weight: z.string().optional(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
})
export type ProductInput = z.infer<typeof productSchema>

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(2000).optional(),
})
export type ReviewInput = z.infer<typeof reviewSchema>

export const orderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED']),
  note: z.string().optional(),
})

export const categoryCreateSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().max(500).optional(),
  image: z.string().url().optional().or(z.literal('')),
})
export type CategoryCreateInput = z.infer<typeof categoryCreateSchema>

export const categoryUpdateSchema = categoryCreateSchema.partial()
export type CategoryUpdateInput = z.infer<typeof categoryUpdateSchema>

export const couponSchema = z.object({
  code: z.string().min(2).max(40).regex(/^[A-Z0-9_-]+$/i, 'Letters, digits, dash and underscore only'),
  type: z.enum(['PERCENT', 'FIXED']),
  value: z.number().positive(),
  minOrder: z.number().nonnegative().optional(),
  maxUses: z.number().int().positive().optional(),
  isActive: z.boolean().default(true),
  expiresAt: z.string().datetime().optional().or(z.literal('')),
})
export type CouponInput = z.infer<typeof couponSchema>

export const couponUpdateSchema = couponSchema.partial()
export type CouponUpdateInput = z.infer<typeof couponUpdateSchema>

export const settingsSchema = z.object({
  storeName: z.string().min(2).max(80).optional(),
  storeEmail: z.string().email().optional().or(z.literal('')),
  storePhone: z.string().max(40).optional(),
  storeAddress: z.string().max(500).optional(),
  currency: z.string().min(3).max(8).optional(),
  freeShippingMin: z.number().nonnegative().optional(),
  shippingCharge: z.number().nonnegative().optional(),
  taxRate: z.number().nonnegative().max(100).optional(),
  metaTitle: z.string().max(160).optional(),
  metaDescription: z.string().max(500).optional(),
})
export type SettingsInput = z.infer<typeof settingsSchema>

export const reviewModerationSchema = z.object({
  isVerified: z.boolean().optional(),
  moderationStatus: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email('Enter a valid email'),
})
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
