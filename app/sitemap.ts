import type { MetadataRoute } from 'next'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Product from '@/models/Product'

export const revalidate = 3600

const STATIC_PATHS = [
  '',
  '/shop',
  '/about',
  '/contact',
  '/login',
  '/register',
  '/terms-and-conditions',
  '/privacy-policy',
  '/refund-policy',
  '/disclaimer',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000'
  const now = new Date()
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: `${baseUrl}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.7,
  }))

  if (!isDatabaseConfigured()) return staticEntries

  try {
    await connectDB()
    const products = await Product.find({ isActive: true }).select('slug updatedAt').lean()
    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
    return [...staticEntries, ...productEntries]
  } catch {
    return staticEntries
  }
}
