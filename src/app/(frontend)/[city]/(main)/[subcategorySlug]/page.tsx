"use client"

import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState, useRef } from "react"
import {
  getSubCategoryWithProducts,
  type SubCategoryWithProducts,
} from "@/actions/server/products/getSubCategoryWithProducts"
import ErrorAlert from "@/components/error-alert/ErrorAlert"
import { ProductCard } from "@/components/product-card/ProductCard"
import { ArrowRight, Loader2 } from 'lucide-react'
import SubCategories from "@/components/sub-categories/SubCategories"
import { getFilteredProducts, type ProductsWithSubCategory } from "@/actions/server/products/getFilterProducts"
import type { Category } from "@/payload-types"

const SubCategoryPage = () => {
  const params = useParams()
  const router = useRouter()
  const { subcategorySlug, city } = params as Record<string, string>

  const [data, setData] = useState<SubCategoryWithProducts | null>(null)
  const [allSubCategories, setAllSubCategories] = useState<ProductsWithSubCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(true)

  const badgesRef = useRef<(HTMLDivElement | null)[]>([])
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])

  const fetchSubCategory = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = await getSubCategoryWithProducts(subcategorySlug)

    if (!result) {
      setError("Подкатегория не найдена")
      setLoading(false)
      return
    }

    setData(result)

    if (result.subCategory.parent && typeof result.subCategory.parent === 'object') {
      const parentCategory = result.subCategory.parent as Category
      const allSubs = await getFilteredProducts(parentCategory.value)
      if (allSubs) {
        setAllSubCategories(allSubs)
      }
    }

    setLoading(false)
  }, [subcategorySlug])

  useEffect(() => {
    fetchSubCategory()
  }, [fetchSubCategory])

  const goToNextSubCategory = () => {
    if (data?.nextSubCategory) {
      router.push(`/${city}/${data.nextSubCategory.value}`)
    }
  }

  const navigateToSubCategory = (value: string) => {
    router.push(`/${city}/${value}`)
  }

  if (error) {
    return <ErrorAlert buttonAction={fetchSubCategory} errorMessage={error} />
  }

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <>
      {allSubCategories.length > 0 && (
        <div className="sticky top-[150px] sm:top-[173px] md:top-[200px] z-20">
          <SubCategories
            sortedProducts={allSubCategories}
            activeSubCategory={data.subCategory.value}
            badgesRef={badgesRef}
            sectionsRef={sectionsRef}
            onSubCategoryClick={navigateToSubCategory}
          />
        </div>
      )}

      <section className="products-sub bg-gray-50 shadow-[0_-6px_12px_-4px_rgba(0,0,0,0.05)]">
        <div className="max-w-7xl px-4 flex flex-col mx-auto pb-16 pt-8">
          <div className="flex flex-col gap-5">
            <div className="flex justify-between ml-2 items-start w-full">
              <h1 className="text-3xl text-black font-bold">{data.subCategory.title}</h1>
            </div>

            <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {data.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {data.nextSubCategory && (
              <div className="flex items-center justify-center mt-8">
                <button
                  onClick={goToNextSubCategory}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <p className="text-white text-sm md:text-base font-semibold">
                    К подкатегории "{data.nextSubCategory.title}"
                  </p>
                  <ArrowRight color="white" size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default SubCategoryPage
