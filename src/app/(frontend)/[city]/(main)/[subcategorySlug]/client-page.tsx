"use client"

import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState, useRef } from "react"
import {
  getSubCategoryWithProducts,
  type SubCategoryWithProducts,
} from "@/actions/server/products/getSubCategoryWithProducts"
import ErrorAlert from "@/components/error-alert/ErrorAlert"
import { ProductCard } from "@/components/product-card/ProductCard"
import { ArrowRight, Loader2 } from "lucide-react"
import SubCategories from "@/components/sub-categories/SubCategories"
import { getFilteredProducts, type ProductsWithSubCategory } from "@/actions/server/products/getFilterProducts"
import type { Category, City } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"
import jsxConverters from "@/utils/jsx-converters"
import "@/styles/richText.scss"
import { replaceCityInRichText } from "@/utils/replaceCityVariables"

type Props = {
  initialData: SubCategoryWithProducts
  subcategorySlug: string
  citySlug: string
  initialCity: City | null
}

const SubCategoryClientPage = ({ initialData, subcategorySlug, citySlug, initialCity }: Props) => {
  const router = useRouter()

  console.log(initialCity);

  const [data, setData] = useState<SubCategoryWithProducts>(initialData)
  const [allSubCategories, setAllSubCategories] = useState<ProductsWithSubCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)

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

    if (result.subCategory.parent && typeof result.subCategory.parent === "object") {
      const parentCategory = result.subCategory.parent as Category
      const allSubs = await getFilteredProducts(parentCategory.value)
      if (allSubs) {
        setAllSubCategories(allSubs)
      }
    }

    setLoading(false)
  }, [subcategorySlug])

  useEffect(() => {
    if (initialData.subCategory.parent && typeof initialData.subCategory.parent === "object") {
      const parentCategory = initialData.subCategory.parent as Category
      getFilteredProducts(parentCategory.value).then((allSubs) => {
        if (allSubs) {
          setAllSubCategories(allSubs)
        }
      })
    }
  }, [initialData])

  const goToNextSubCategory = () => {
    if (data?.nextSubCategory) {
      router.push(`/${citySlug}/${data.nextSubCategory.value}`)
    }
  }

  const navigateToSubCategory = (value: string) => {
    router.push(`/${citySlug}/${value}`)
  }

  if (error) {
    return <ErrorAlert buttonAction={fetchSubCategory} errorMessage={error} />
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  const processedContent = data.subCategory.content
    ? replaceCityInRichText(data.subCategory.content, initialCity.declensions)
    : null

  const processedContentAfter = data.subCategory.contentAfter
    ? replaceCityInRichText(data.subCategory.contentAfter, initialCity.declensions)
    : null

  return (
    <>
      {allSubCategories.length > 0 && (
        <div className="z-20">
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
          <div className="flex flex-col">
            {processedContent && (
              <div className="rich-container">
                <RichText converters={jsxConverters} data={processedContent} />
              </div>
            )}

            <div className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {data.products.map((product) => (
                <ProductCard city={initialCity} key={product.id} product={product} />
              ))}
            </div>

            {processedContentAfter && (
              <div className="rich-container mt-8">
                <RichText converters={jsxConverters} data={processedContentAfter} />
              </div>
            )}

            {data.nextSubCategory && (
              <div className="flex items-center justify-center mt-8">
                <button
                  onClick={goToNextSubCategory}
                  className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  <p className="text-white text-sm md:text-base font-semibold">"{data.nextSubCategory.title}"</p>
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

export default SubCategoryClientPage
