export default function AdminLoading() {
  return (
    <div className="p-6 lg:p-8">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-parchment" />
      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-2xl bg-parchment" />
        ))}
      </div>
      <div className="mt-6 h-72 animate-pulse rounded-2xl bg-parchment" />
    </div>
  )
}
