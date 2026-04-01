"use client"

import { useRouter } from "next/navigation"
import { useRef, useState, useMemo } from "react"
import { ProductCard } from "@/components/product-card/ProductCard"
import { ArrowRight, ArrowLeft } from "lucide-react"
import SubCategories from "@/components/sub-categories/SubCategories"
import type { City, Category, FilterConfig, Product } from "@/payload-types"
import "@/styles/richText.scss"
import MemoRichText from "@/components/memo-rich-text/MemoRichText"
import { useAccessibilityStore } from "@/entities/accessibility/accessibilityStore"
import useSWR from "swr"
import { getSubCategoryWithProducts } from "@/actions/server/products/getSubCategoryWithProducts"
import { getFilteredProducts } from "@/actions/server/products/getFilterProducts"
import { ProductFilters, type ActiveFilters } from "@/components/product-filters/ProductFilters"

type Props = {
  subcategorySlug: string
  citySlug: string
  initialCity: City | null
  processedContent: any
  processedContentAfter: any
  filterConfig: FilterConfig | null
}

function ProductsSkeleton() {
  return (
    <div className="grid w-full gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mt-2" />
          </div>
        </div>
      ))}
    </div>
  )
}

function applyFilters(products: Product[], activeFilters: ActiveFilters): Product[] {
  const entries = Object.entries(activeFilters).filter(([, vals]) => vals.length > 0)
  if (entries.length === 0) return products

  return products.filter((product) => {
    const productFilterValues = product.filterValues ?? []

    return entries.every(([key, selectedValues]) => {
      // Find the product's value(s) for this filter key
      const productValues = productFilterValues
        .filter((fv) => fv.key === key)
        .map((fv) => fv.value)

      // The product must have at least one matching value
      return selectedValues.some((sv) => productValues.includes(sv))
    })
  })
}

const SubCategoryClientPage = ({
  subcategorySlug,
  citySlug,
  initialCity,
  processedContent,
  processedContentAfter,
  filterConfig,
}: Props) => {
  const router = useRouter()
  const { isLargeText } = useAccessibilityStore()
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({})
  // effectiveFilters включает autoselect значения и используется для фильтрации продуктов
  const [effectiveFilters, setEffectiveFilters] = useState<ActiveFilters>({})

  const badgesRef = useRef<(HTMLDivElement | null)[]>([])
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  const { data: initialData, isLoading: isLoadingProducts } = useSWR(
    ["subcategory-products", subcategorySlug],
    () => getSubCategoryWithProducts(subcategorySlug),
    { revalidateOnFocus: false },
  )

  const { data: allSubCategories = [], isLoading: isLoadingSubCategories } = useSWR(
    initialData ? ["all-subcategories", (initialData.subCategory.parent as Category)?.value] : null,
    ([, parentSlug]) => (parentSlug ? getFilteredProducts(parentSlug) : Promise.resolve([])),
    { revalidateOnFocus: false },
  )

  const filteredProducts = useMemo(() => {
    if (!initialData?.products) return []
    // Используем effectiveFilters для фильтрации (включает autoselect значения)
    return applyFilters(initialData.products, effectiveFilters)
  }, [initialData?.products, effectiveFilters])

  const goToNext = () => {
    if (initialData?.nextSubCategory) {
      router.push(`/${citySlug}/${initialData.nextSubCategory.value}`)
    } else if (initialData?.nextCategoryFirstSubCategory) {
      router.push(`/${citySlug}/${initialData.nextCategoryFirstSubCategory.value}`)
    }
  }

  const goToPrev = () => {
    if (initialData?.prevSubCategory) {
      router.push(`/${citySlug}/${initialData.prevSubCategory.value}`)
    } else if (initialData?.prevCategoryLastSubCategory) {
      router.push(`/${citySlug}/${initialData.prevCategoryLastSubCategory.value}`)
    }
  }

  const navigateToSubCategory = (value: string) => {
    router.push(`/${citySlug}/${value}`)
  }

  const hasNextNavigation = initialData?.nextSubCategory || initialData?.nextCategoryFirstSubCategory
  const nextButtonTitle = initialData?.nextSubCategory
    ? initialData.nextSubCategory.title
    : initialData?.nextCategoryFirstSubCategory?.title

  const hasPrevNavigation = initialData?.prevSubCategory || initialData?.prevCategoryLastSubCategory
  const prevButtonTitle = initialData?.prevSubCategory
    ? initialData.prevSubCategory.title
    : initialData?.prevCategoryLastSubCategory?.title

  return (
    <>
      {!isLoadingSubCategories && allSubCategories.length > 0 && initialData && (
        <div className="z-20">
          <SubCategories
            sortedProducts={allSubCategories}
            activeSubCategory={initialData.subCategory.value}
            badgesRef={badgesRef}
            sectionsRef={sectionsRef}
            onSubCategoryClick={navigateToSubCategory}
          />
        </div>
      )}

      <section className="products-sub bg-gray-50 shadow-[0_-6px_12px_-4px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl px-4 flex flex-col mx-auto pb-16 pt-8">
          <div className="flex flex-col">
            {/* RichText рендерится сразу */}
            {processedContent && (
              <div className="rich-container">
                <MemoRichText data={processedContent} />
              </div>
            )}

            {/* Filters */}
            {filterConfig && (
              <div className="mb-4">
                <ProductFilters
                  filterConfig={filterConfig}
                  activeFilters={activeFilters}
                  onChange={setActiveFilters}
                  onEffectiveFiltersChange={setEffectiveFilters}
                />
              </div>
            )}

            {isLoadingProducts ? (
              <ProductsSkeleton />
            ) : (
              <>
                {filteredProducts.length === 0 && Object.values(effectiveFilters).flat().length > 0 ? (
                  <p className="text-gray-500 text-sm py-8 text-center">
                    По выбранным фильтрам ничего не найдено
                  </p>
                ) : (
                  <div
                    className={`grid w-full gap-4 ${isLargeText ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard city={initialCity} key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </>
            )}

            {processedContentAfter && (
              <div className="rich-container mt-8">
                <MemoRichText data={processedContentAfter} />
              </div>
            )}

            {!isLoadingProducts && (hasPrevNavigation || hasNextNavigation) && (
              <div className="flex items-center justify-center gap-4 mt-8">
                {hasPrevNavigation && (
                  <button
                    onClick={goToPrev}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <ArrowLeft color="white" size={20} />
                    <p className="text-white text-sm md:text-base font-semibold">"{prevButtonTitle}"</p>
                  </button>
                )}
                {hasNextNavigation && (
                  <button
                    onClick={goToNext}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                  >
                    <p className="text-white text-sm md:text-base font-semibold">"{nextButtonTitle}"</p>
                    <ArrowRight color="white" size={20} />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default SubCategoryClientPage
