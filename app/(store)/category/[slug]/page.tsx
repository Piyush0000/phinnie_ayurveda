import { notFound } from 'next/navigation'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Category from '@/models/Category'
import Product from '@/models/Product'
import ProductGrid from '@/components/store/ProductGrid'

export const dynamic = 'force-dynamic'

async function getData(slug: string) {
  if (!isDatabaseConfigured()) return null
  await connectDB()
  const category = await Category.findOne({ slug }).lean()
  if (!category) return null
  const products = await Product.find({ categorySlug: slug, isActive: true })
    .sort({ isFeatured: -1, soldCount: -1 })
    .lean()
  return {
    category: JSON.parse(JSON.stringify(category)) as any,
    products: JSON.parse(JSON.stringify(products)) as any[],
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const data = await getData(params.slug)
  if (!data) notFound()
  const { category, products } = data
  return (
    <div className="container-wide py-8 md:py-12">
      <header className="mb-8 text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Category</p>
        <h1 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">{category.name}</h1>
        {category.description && (
          <p className="mx-auto mt-3 max-w-2xl font-accent text-lg text-warmgray">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-warmgray">{products.length} products</p>
      </header>
      <ProductGrid products={products} />
    </div>
  )
}
