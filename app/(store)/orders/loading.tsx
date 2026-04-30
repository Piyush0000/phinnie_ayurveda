export default function OrdersLoading() {
  return (
    <div className="container-wide py-8 md:py-12">
      <div className="h-12 w-48 animate-pulse rounded-lg bg-parchment" />
      <ul className="mt-6 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="h-32 animate-pulse rounded-2xl bg-parchment" />
        ))}
      </ul>
    </div>
  )
}
