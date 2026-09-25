export default function Loading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-pulse">
      <div className="border-b-2 border-ink pb-4">
        <div className="h-3 w-24 bg-ink/20 mb-3" />
        <div className="h-12 w-80 bg-ink/20" />
      </div>
      <div className="h-24 border-2 border-ink" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 border-2 border-ink" />
        ))}
      </div>
      <div className="h-72 border-2 border-ink" />
      <div className="h-96 border-2 border-ink" />
    </div>
  )
}