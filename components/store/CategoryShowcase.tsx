import Link from 'next/link'
import Image from 'next/image'

interface Category {
  _id: string
  name: string
  slug: string
  image?: string
  productCount: number
}

const FALLBACK_CATEGORIES: Category[] = [
  { _id: '1', name: 'Hair Care', slug: 'hair-care', productCount: 0 },
  { _id: '2', name: 'Skin Care', slug: 'skin-care', productCount: 0 },
  { _id: '3', name: 'Wellness', slug: 'wellness', productCount: 0 },
  { _id: '4', name: 'Digestive', slug: 'digestive-health', productCount: 0 },
  { _id: '5', name: 'Immunity', slug: 'immunity', productCount: 0 },
  { _id: '6', name: 'Oils & Ghee', slug: 'oils-ghee', productCount: 0 },
  { _id: '7', name: 'Face Care', slug: 'face-care', productCount: 0 },
  { _id: '8', name: 'Body Care', slug: 'body-care', productCount: 0 },
]

export default function CategoryShowcase({ categories }: { categories?: Category[] }) {
  const list = categories?.length ? categories : FALLBACK_CATEGORIES
  return (
    <section className="container-wide py-16 md:py-20">
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-turmeric-700">Explore</p>
        <h2 className="mt-2 font-display text-4xl text-charcoal md:text-5xl">Shop by Category</h2>
        <p className="mt-3 font-accent text-lg text-warmgray">
          Curated formulas for every aspect of your wellness journey
        </p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
        {list.map((c) => (
          <Link
            key={c._id}
            href={`/category/${c.slug}`}
            className="group relative block overflow-hidden rounded-2xl border border-forest/10 bg-parchment shadow-warm transition hover:-translate-y-1 hover:shadow-warm-lg"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
              {c.image ? (
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-forest font-display text-5xl text-cream">
                  {c.name.charAt(0)}
                </div>
              )}
              <div
                className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/30 to-transparent"
                aria-hidden
              />
            </div>
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              <h3 className="font-display text-lg text-cream md:text-xl">{c.name}</h3>
              {c.productCount > 0 && (
                <p className="mt-0.5 text-[11px] uppercase tracking-wider text-cream/80">
                  {c.productCount} {c.productCount === 1 ? 'item' : 'items'}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
