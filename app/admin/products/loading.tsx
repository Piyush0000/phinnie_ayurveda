export default function AdminProductsLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-5 flex items-center justify-between">
        <div className="h-10 w-72 animate-pulse rounded-lg bg-parchment" />
        <div className="h-10 w-32 animate-pulse rounded-lg bg-parchment" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-forest/10 bg-cream shadow-warm">
        <div className="h-12 bg-parchment/40" />
        <div className="divide-y divide-forest/5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex h-16 animate-pulse items-center gap-4 px-4">
              <div className="h-12 w-12 rounded-lg bg-parchment" />
              <div className="flex-1">
                <div className="h-4 w-1/3 rounded bg-parchment" />
                <div className="mt-1.5 h-3 w-1/5 rounded bg-parchment" />
              </div>
              <div className="h-4 w-16 rounded bg-parchment" />
              <div className="h-4 w-12 rounded bg-parchment" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
