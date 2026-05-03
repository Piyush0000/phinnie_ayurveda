import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Category, { type ICategory } from '@/models/Category'
import Product, { type IProduct } from '@/models/Product'
import ProductGrid from '@/components/store/ProductGrid'

export const dynamic = 'force-dynamic'

type CategoryDoc = Omit<ICategory, '_id' | 'createdAt' | 'updatedAt'> & {
  _id: string
  createdAt: string
  updatedAt: string
}

type ProductDoc = Omit<IProduct, '_id' | 'categoryId' | 'createdAt' | 'updatedAt'> & {
  _id: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

async function getData(slug: string): Promise<{ category: CategoryDoc; products: ProductDoc[] } | null> {
  if (!isDatabaseConfigured()) return null
  await connectDB()
  const category = await Category.findOne({ slug }).lean()
  if (!category) return null
  const products = await Product.find({ categorySlug: slug, isActive: true })
    .sort({ isFeatured: -1, soldCount: -1 })
    .lean()
  return {
    category: JSON.parse(JSON.stringify(category)) as CategoryDoc,
    products: JSON.parse(JSON.stringify(products)) as ProductDoc[],
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getData(params.slug)
  if (!data) return { title: 'Category — Thinnie Aurvadic' }
  const { category } = data
  return {
    title: `${category.name} — Thinnie Aurvadic`,
    description:
      category.description ?? `Shop ${category.name} — handcrafted Ayurvedic wellness products from Thinnie Aurvadic.`,
    openGraph: {
      title: `${category.name} — Thinnie Aurvadic`,
      description: category.description ?? undefined,
      images: category.image ? [category.image] : undefined,
    },
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
