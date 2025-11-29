import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
      {/* Header Skeleton */}
      <Skeleton className="h-8 w-48 mb-10" />

      {/* Avatar Skeleton */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <Skeleton className="w-28 h-28 md:w-36 md:h-36 rounded-full" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 opacity-20 blur-xl animate-pulse"></div>
        </div>
      </div>

      {/* Email Section Skeleton */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-5 w-12" />
          </div>
          <Skeleton className="h-5 w-64" />
        </div>
      </div>

      {/* Phone Section Skeleton */}
      <div className="mb-10">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="space-y-3">
            <div className="flex gap-3">
              <Skeleton className="h-10 flex-1 rounded" />
              <Skeleton className="h-10 w-24 rounded" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="w-4 h-4" />
              <Skeleton className="h-4 w-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Address Section Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Skeleton className="w-2 h-2 rounded-full" />
          <Skeleton className="h-6 w-40" />
        </div>

        {/* Address Button Skeleton */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl px-6 py-5 border border-orange-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="h-5 w-64" />
            </div>
            <Skeleton className="w-5 h-5" />
          </div>
        </div>

        {/* Address Details Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 text-center border border-purple-100 shadow-sm"
            >
              <Skeleton className="h-3 w-16 mx-auto mb-2" />
              <Skeleton className="h-6 w-8 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
