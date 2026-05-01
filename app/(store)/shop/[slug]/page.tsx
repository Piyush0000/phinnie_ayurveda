import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import connectDB, { isDatabaseConfigured } from '@/lib/mongodb'
import Product, { type IProduct } from '@/models/Product'
import Review, { type IReview } from '@/models/Review'
import ProductImageGallery from '@/components/store/ProductImageGallery'
import StarRating from '@/components/store/StarRating'
import AddToCartSection from './AddToCartSection'
import { formatPrice, calculateDiscount, formatDate } from '@/lib/utils'
import Badge from '@/components/ui/Badge'

export const dynamic = 'force-dynamic'

type ProductDoc = Omit<IProduct, '_id' | 'categoryId' | 'createdAt' | 'updatedAt'> & {
  _id: string
  categoryId: string
  createdAt: string
  updatedAt: string
}

type ReviewDoc = Omit<IReview, '_id' | 'userId' | 'productId' | 'createdAt'> & {
  _id: string
  userId: string
  productId: string
  createdAt: string
}

async function getProduct(slug: string): Promise<{ product: ProductDoc; reviews: ReviewDoc[]; related: ProductDoc[] } | null> {
  if (!isDatabaseConfigured()) return null
  await connectDB()
  const product = await Product.findOne({ slug, isActive: true }).lean()
  if (!product) return null
  const [reviews, related] = await Promise.all([
    Review.find({ productId: product._id }).sort({ createdAt: -1 }).limit(20).lean(),
    Product.find({ categoryId: product.categoryId, _id: { $ne: product._id }, isActive: true })
      .limit(4)
      .lean(),
  ])
  return {
    product: JSON.parse(JSON.stringify(product)) as ProductDoc,
    reviews: JSON.parse(JSON.stringify(reviews)) as ReviewDoc[],
    related: JSON.parse(JSON.stringify(related)) as ProductDoc[],
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data = await getProduct(params.slug)
  if (!data) return { title: 'Product Not Found' }
  const { product } = data
  const title = `${product.metaTitle || product.name} | Thinnie Aurvadic`
  const description =
    product.metaDescription || product.shortDesc || product.description.slice(0, 160)
  const heroImage = product.images[0]
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: heroImage ? [{ url: heroImage, alt: product.name }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const data = await getProduct(params.slug)
  if (!data) notFound()
  const { product, reviews, related } = data
  const discount = calculateDiscount(product.price, product.comparePrice)

  return (
    <div className="container-wide py-8 md:py-12">
      <nav className="mb-6 text-sm text-warmgray">
        <a href="/" className="hover:text-forest">Home</a> ·{' '}
        <a href="/shop" className="hover:text-forest">Shop</a> ·{' '}
        <a href={`/category/${product.categorySlug}`} className="hover:text-forest">{product.categoryName}</a>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductImageGallery images={product.images} name={product.name} />
        <div className="flex flex-col gap-4">
          <p className="text-xs uppercase tracking-widest text-turmeric-700">{product.categoryName}</p>
          <h1 className="font-display text-4xl text-charcoal md:text-5xl">{product.name}</h1>
          {product.shortDesc && <p className="font-accent text-xl text-warmgray">{product.shortDesc}</p>}
          <div className="flex items-center gap-3">
            <StarRating value={product.rating} count={product.reviewCount} size={18} />
            {product.soldCount > 0 && (
              <span className="text-sm text-warmgray">· {product.soldCount} sold</span>
            )}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-4xl text-forest">{formatPrice(product.price)}</span>
            {product.comparePrice && product.comparePrice > product.price && (
              <>
                <span className="text-lg text-warmgray line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                {discount && <Badge variant="danger">{discount}% OFF</Badge>}
              </>
            )}
          </div>
          {product.weight && <p className="text-sm text-warmgray">Net Weight: {product.weight}</p>}

          {product.benefits?.length > 0 && (
            <ul className="mt-2 space-y-1.5">
              {product.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-charcoal">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-turmeric" />
                  {b}
                </li>
              ))}
            </ul>
          )}

          <AddToCartSection
            product={{
              _id: product._id,
              name: product.name,
              price: product.price,
              comparePrice: product.comparePrice,
              image: product.images[0],
              slug: product.slug,
              stock: product.stock,
            }}
          />

          <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-forest/10 bg-parchment/50 p-4 text-center text-xs text-warmgray md:grid-cols-4">
            <div>✦ Ayush Certified</div>
            <div>✦ 100% Pure</div>
            <div>✦ Free Ship ₹999+</div>
            <div>✦ Easy Returns</div>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="font-display text-2xl text-forest">About this Product</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-charcoal">{product.description}</p>
          {product.ingredients && (
            <>
              <h3 className="mt-8 font-display text-xl text-forest">Ingredients</h3>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-charcoal">{product.ingredients}</p>
            </>
          )}
          {product.howToUse && (
            <>
              <h3 className="mt-8 font-display text-xl text-forest">How to Use</h3>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-charcoal">{product.howToUse}</p>
            </>
          )}
        </section>
        <aside>
          <h3 className="font-display text-2xl text-forest">Reviews</h3>
          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-warmgray">Be the first to review this product.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {reviews.map((r) => (
                <li key={r._id} className="rounded-xl border border-forest/10 bg-cream p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{r.userName}</span>
                    {r.isVerified && <Badge variant="success">Verified</Badge>}
                  </div>
                  <StarRating value={r.rating} size={14} className="mt-1" />
                  {r.title && <p className="mt-2 font-semibold">{r.title}</p>}
                  {r.body && <p className="mt-1 text-sm text-charcoal/80">{r.body}</p>}
                  <p className="mt-2 text-xs text-warmgray">{formatDate(r.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl text-charcoal">You may also like</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {related.map((p) => (
              <a
                key={p._id}
                href={`/shop/${p.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-cream shadow-warm transition hover:-translate-y-0.5"
              >
                <div className="relative aspect-square bg-parchment">
                  {p.images[0] && (
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 font-display text-base text-charcoal">{p.name}</h3>
                  <p className="mt-1 font-bold text-forest">{formatPrice(p.price)}</p>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
