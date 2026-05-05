import HeroSection from '@/components/store/HeroSection'
import BrandStorySection from '@/components/store/BrandStorySection'
import ProcessSection from '@/components/store/ProcessSection'
import CategoryShowcase from '@/components/store/CategoryShowcase'
import FeaturedProducts from '@/components/store/FeaturedProducts'
import BenefitsSection from '@/components/store/BenefitsSection'
import TestimonialsSection from '@/components/store/TestimonialsSection'
import NewsletterSection from '@/components/store/NewsletterSection'
import Link from 'next/link'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Product from '@/models/Product'
import Category from '@/models/Category'

export const dynamic = 'force-dynamic'

async function getHomeData() {
  if (!isDatabaseConfigured()) return { featured: [], categories: [] }
  try {
    await connectDB()
    let featured = await Product.find({ isActive: true, isFeatured: true })
      .sort({ soldCount: -1 })
      .limit(8)
      .lean()

    if (featured.length === 0) {
      featured = await Product.find({ isActive: true }).sort({ createdAt: -1 }).limit(4).lean()
    }

    const categories = await Category.find({}).sort({ name: 1 }).lean()
    return {
      featured: JSON.parse(JSON.stringify(featured)),
      categories: JSON.parse(JSON.stringify(categories)),
    }
  } catch {
    return { featured: [], categories: [] }
  }
}

export default async function HomePage() {
  const { featured, categories } = await getHomeData()
  return (
    <>
      <HeroSection />
      {!isDatabaseConfigured() && <SetupBanner />}
      <BenefitsSection />
      <BrandStorySection />
      <CategoryShowcase categories={categories} />
      <FeaturedProducts products={featured} />
      <ProcessSection />
      <PromoBanner />
      <TestimonialsSection />
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

function PromoBanner() {
  return (
    <section className="bg-forest text-cream">
      <div className="container-wide flex flex-col items-center justify-between gap-6 py-12 md:flex-row md:py-16">
        <div className="text-center md:text-left">
          <p className="text-xs uppercase tracking-widest text-turmeric-200">Limited Time</p>
          <h2 className="mt-1 font-display text-3xl md:text-4xl">First Order? Save 15%</h2>
          <p className="mt-2 font-accent text-lg text-cream/80">
            Use code <strong className="text-turmeric">WELCOME15</strong> at checkout
          </p>
        </div>
        <Link
          href="/shop"
          className="inline-flex h-12 items-center rounded-lg bg-turmeric px-7 font-semibold text-charcoal hover:bg-turmeric-400"
        >
          Shop Now
        </Link>
      </div>
    </section>
  )
}
