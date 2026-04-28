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
