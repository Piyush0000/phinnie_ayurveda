export default function AdminOrdersLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-5 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-parchment" />
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-forest/10 bg-cream shadow-warm">
        <div className="h-12 bg-parchment/40" />
        <div className="divide-y divide-forest/5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex h-14 animate-pulse items-center gap-4 px-4">
              <div className="h-4 w-24 rounded bg-parchment" />
              <div className="flex-1">
                <div className="h-4 w-1/3 rounded bg-parchment" />
              </div>
              <div className="h-4 w-16 rounded bg-parchment" />
              <div className="h-6 w-20 rounded-full bg-parchment" />
              <div className="h-6 w-20 rounded-full bg-parchment" />
              <div className="h-4 w-20 rounded bg-parchment" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
