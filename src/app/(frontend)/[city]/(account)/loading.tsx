import { Skeleton } from "@/components/ui/skeleton"

export default function AccountLoading() {
  return (
    <main className="bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-80 mx-auto" />
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Sidebar skeleton */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* User info skeleton */}
              <div className="text-center mb-6">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                <Skeleton className="h-5 w-32 mx-auto mb-1" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>

              {/* Navigation skeleton */}
              <nav className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                    <Skeleton className="w-5 h-5" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
              </nav>

              {/* Logout button skeleton */}
              <div className="mt-6 pt-6 border-t">
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </aside>

          {/* Main content skeleton */}
          <section className="col-span-12 md:col-span-8 lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <Skeleton className="h-8 w-48 mb-6" />

              {/* Content blocks */}
              <div className="space-y-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-12 w-full rounded-lg" />
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mt-8">
                <Skeleton className="h-10 w-24 rounded-lg" />
                <Skeleton className="h-10 w-32 rounded-lg" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
