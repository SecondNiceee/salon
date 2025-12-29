export default function Loading() {
  return (
    <div className="bg-gray-50 min-h-screen animate-pulse">
      {/* Minimal header skeleton */}
      <div className="bg-white h-16 shadow-sm" />

      {/* Categories skeleton - simple bar */}
      <div className="bg-white h-20 border-b" />

      {/* Content skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="h-8 w-48 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
