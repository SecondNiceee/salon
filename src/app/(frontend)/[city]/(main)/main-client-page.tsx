"use client"
import { getCategoriesWithProducts } from "@/actions/server/categories/getCategoriesWithProducts"
import ErrorAlert from "@/components/error-alert/ErrorAlert"
import { ProductCard } from "@/components/product-card/ProductCard"
import type { Category, Product } from "@/payload-types"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { RichText } from "@payloadcms/richtext-lexical/react"
import jsxConverters from "@/utils/jsx-converters"
import "@/styles/richText.scss"
import { replaceCityInRichText, type CityDeclensions } from "@/utils/replaceCityVariables"
import { getCityBySlug } from "@/actions/server/cities/getCities"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import { usePathname } from "next/navigation"

type TCategoryWithProducts = {
  category: Category
  products: Product[]
  productsCounter: number
}
export default function GrandBazarClientApp() {
  const [productsAndCategories, setProductsWithCategories] = useState<TCategoryWithProducts[] | null>()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [cityDeclensions, setCityDeclensions] = useState<CityDeclensions | null>(null)
  const siteSettings = useSiteSettings((state) => state.siteSettings)
  const pathname = usePathname()

  useEffect(() => {
    const loadCity = async () => {
      try {
        const pathSegments = pathname.split("/").filter(Boolean)
        if (pathSegments.length === 0) {
          setCityDeclensions(null)
          return
        }

        const citySlug = pathSegments[0]
        const city = await getCityBySlug(citySlug)

        if (city) {
          setCityDeclensions({
            nominative: city.declensions.nominative,
            genitive: city.declensions.genitive,
            prepositional: city.declensions.prepositional,
          })
        }
      } catch (error) {
        console.error("Failed to load city:", error)
      }
    }

    loadCity()
  }, [pathname])

  // Функция получение данных с сервреа
  const getProductsWithCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const rezult = await getCategoriesWithProducts()
      setProductsWithCategories(rezult)
    } catch (e) {
      if (e instanceof Error) {
        setError(e)
      } else {
        setError({ message: "Internal Server Error", name: "Uncaught Error" })
      }
    }
    setLoading(false)
  }, [setLoading, setError, setProductsWithCategories])

  // Получение данных с сервреа
  useEffect(() => {
    getProductsWithCategories()
  }, [getProductsWithCategories])

  // UI ошибки в случае ошибка загрузка с сервера
  if (error) {
    console.log(error)
    return (
      <ErrorAlert
        buttonAction={() => getProductsWithCategories()}
        errorMessage="Не удалось загрузить товары, проверьте подключение к интернету."
      />
    )
  }

  // UI загрузки
  if (isLoading || !productsAndCategories) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
      </div>
    )
  }

  const processedHomeContent = siteSettings?.homeContent
    ? replaceCityInRichText(siteSettings.homeContent, cityDeclensions)
    : null

  return (
    <>
      <section className="products bg-gray-50">
        <div className="flex flex-col gap-3 px-4 mx-auto mt-1 mb-4 rounded-md bg-gray-50 max-w-7xl">
          {processedHomeContent && (
            <div className="rich-container pt-4">
              <RichText converters={jsxConverters} data={processedHomeContent} />
            </div>
          )}

          {productsAndCategories.map((item) => (
            <div key={item.category.id} className="flex flex-col gap-4 pt-3">
              {item.products.length ? (
                <>
                  <div className="flex items-start justify-between w-full">
                    <h2 className="text-lg font-bold text-black md:text-2xl">{item.category.title}</h2>
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3">
                    {item.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
