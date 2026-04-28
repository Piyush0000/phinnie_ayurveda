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
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5 lg:grid-cols-4 xl:grid-cols-8">
        {list.map((c) => (
          <Link
            key={c._id}
            href={`/category/${c.slug}`}
            className="group flex flex-col items-center rounded-2xl border border-forest/10 bg-parchment/60 p-4 text-center transition hover:-translate-y-0.5 hover:bg-parchment hover:shadow-warm md:p-5"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full bg-forest md:h-20 md:w-20">
              {c.image ? (
                <Image src={c.image} alt={c.name} fill sizes="80px" className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-2xl text-cream">
                  {c.name.charAt(0)}
                </div>
              )}
            </div>
            <h3 className="mt-3 font-display text-sm text-charcoal group-hover:text-forest md:text-base">
              {c.name}
            </h3>
            {c.productCount > 0 && (
              <p className="text-[11px] text-warmgray">{c.productCount} items</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
