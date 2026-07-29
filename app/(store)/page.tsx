import HeroSection from '@/components/store/HeroSection'
import BrandStorySection from '@/components/store/BrandStorySection'
import ProcessSection from '@/components/store/ProcessSection'
import FeaturedProducts from '@/components/store/FeaturedProducts'
import BenefitsSection from '@/components/store/BenefitsSection'
import TestimonialsSection from '@/components/store/TestimonialsSection'
import GallerySection from '@/components/store/GallerySection'
import NewsletterSection from '@/components/store/NewsletterSection'
import AdBanner from '@/components/store/AdBanner'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Product from '@/models/Product'
import { getPublicSettings } from '@/lib/site-settings'

export const dynamic = 'force-dynamic'

async function getHomeData() {
  if (!isDatabaseConfigured()) return { featured: [] }
  try {
    await connectDB()
    const featured = await Product.find({ isActive: true })
      .sort({ isFeatured: -1, soldCount: -1, createdAt: -1 })
      .lean()

    return {
      featured: JSON.parse(JSON.stringify(featured)),
    }
  } catch {
    return { featured: [] }
  }
}

export default async function HomePage() {
  const { featured } = await getHomeData()
  const settings = await getPublicSettings()
  return (
    <>
      <HeroSection />
      {!isDatabaseConfigured() && <SetupBanner />}
      <BenefitsSection freeShippingMin={settings.freeShippingMin} />
      <AdBanner />
      <BrandStorySection />
      <FeaturedProducts products={featured} />
      <ProcessSection />
      <TestimonialsSection />
      <GallerySection />
      <NewsletterSection />
    </>
  )
}

function SetupBanner() {
  return (
    <section className="container-wide py-8">
      <div className="rounded-2xl border-2 border-dashed border-turmeric bg-turmeric-50 p-6 md:p-8">
        <h3 className="font-display text-2xl text-forest">⚙️ Database not configured</h3>
        <p className="mt-2 text-sm text-charcoal">
          Add your MongoDB Atlas connection string to <code className="rounded bg-cream px-1.5 py-0.5">.env.local</code> as{' '}
          <code className="rounded bg-cream px-1.5 py-0.5">MONGODB_URI</code>, then run{' '}
          <code className="rounded bg-cream px-1.5 py-0.5">npm run seed</code> to populate sample data.
        </p>
      </div>
    </section>
  )
}
