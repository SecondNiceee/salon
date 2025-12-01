"use client"

import { useRouter } from "next/navigation"
import { useRef } from "react"
import type { SubCategoryWithProducts } from "@/actions/server/products/getSubCategoryWithProducts"
import { ProductCard } from "@/components/product-card/ProductCard"
import { ArrowRight, ArrowLeft } from "lucide-react"
import SubCategories from "@/components/sub-categories/SubCategories"
import type { City } from "@/payload-types"
import "@/styles/richText.scss"
import type { ProductsWithSubCategory } from "@/actions/server/products/getFilterProducts"
import MemoRichText from "@/components/memo-rich-text/MemoRichText"

type Props = {
  initialData: SubCategoryWithProducts
  citySlug: string
  initialCity: City | null
  processedContent: any
  processedContentAfter: any
  allSubCategories: ProductsWithSubCategory[]
}

const SubCategoryClientPage = ({
  initialData,
  allSubCategories,
  citySlug,
  initialCity,
  processedContent,
  processedContentAfter,
}: Props) => {
  const router = useRouter()

  const badgesRef = useRef<(HTMLDivElement | null)[]>([])
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

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
      {allSubCategories.length > 0 && (
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
            {processedContent && (
              <div className="rich-container">
                <MemoRichText data={processedContent} />
              </div>
            )}

            <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {initialData.products.map((product) => (
                <ProductCard city={initialCity} key={product.id} product={product} />
              ))}
            </div>

            {processedContentAfter && (
              <div className="rich-container mt-8">
                <MemoRichText data={processedContentAfter} />
              </div>
            )}

            {(hasPrevNavigation || hasNextNavigation) && (
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
