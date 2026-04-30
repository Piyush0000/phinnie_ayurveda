export default function ShopLoading() {
  return (
    <div className="container-wide py-8 md:py-12">
      <div className="mx-auto h-12 w-64 animate-pulse rounded-lg bg-parchment" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-parchment" />
        ))}
      </div>
    </div>
  )
}
