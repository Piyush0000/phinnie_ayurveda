import type { MetadataRoute } from 'next'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'

// Re-build the sitemap hourly so newly published products and categories
// appear without requiring a redeploy.
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
    const [products, categories] = await Promise.all([
      Product.find({ isActive: true }).select('slug updatedAt').lean(),
      Category.find({}).select('slug updatedAt').lean(),
    ])
    const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
      url: `${baseUrl}/shop/${p.slug}`,
      lastModified: p.updatedAt ?? now,
      changeFrequency: 'weekly',
      priority: 0.6,
    }))
    const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
      url: `${baseUrl}/category/${c.slug}`,
      lastModified: c.updatedAt ?? now,
      changeFrequency: 'weekly',
      priority: 0.5,
    }))
    return [...staticEntries, ...categoryEntries, ...productEntries]
  } catch {
    return staticEntries
  }
}
