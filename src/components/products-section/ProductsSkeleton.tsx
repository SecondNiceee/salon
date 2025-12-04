import { Skeleton } from "@/components/ui/skeleton"

interface ProductsSkeletonProps {
  count?: number
  isLargeText?: boolean
}

export function ProductsSkeleton({ count = 6, isLargeText = false }: ProductsSkeletonProps) {
  return (
    <div className="flex flex-col gap-4 pt-3">
      {/* Category title skeleton */}
      <div className="flex items-start justify-between w-full">
        <Skeleton className="h-7 w-48 bg-gray-200" />
      </div>

      {/* Products grid skeleton */}
      <div className={`grid w-full gap-4 ${isLargeText ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Image skeleton */}
            <Skeleton className="aspect-[4/3] w-full bg-gray-200" />

            {/* Content skeleton */}
            <div className="p-5 flex flex-col gap-3">
              <Skeleton className="h-5 w-full bg-gray-200" />
              <Skeleton className="h-4 w-24 bg-gray-200" />
              <Skeleton className="h-4 w-32 bg-gray-200" />
              <Skeleton className="h-6 w-20 bg-gray-200" />
              <Skeleton className="h-10 w-full rounded-xl bg-gray-200" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProductsSectionSkeleton({
  categoriesCount = 2,
  isLargeText = false,
}: { categoriesCount?: number; isLargeText?: boolean }) {
  return (
    <>
      {Array.from({ length: categoriesCount }).map((_, i) => (
        <ProductsSkeleton key={i} isLargeText={isLargeText} />
      ))}
    </>
  )
}
