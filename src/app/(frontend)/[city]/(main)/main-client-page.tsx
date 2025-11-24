"use client"
import { getCategoriesWithProducts } from "@/actions/server/categories/getCategoriesWithProducts"
import ErrorAlert from "@/components/error-alert/ErrorAlert"
import { ProductCard } from "@/components/product-card/ProductCard"
import type { Category, Product, City } from "@/payload-types"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { RichText } from "@payloadcms/richtext-lexical/react"
import jsxConverters from "@/utils/jsx-converters"
import "@/styles/richText.scss"
import { useCityStore } from "@/entities/city/cityStore"

type TCategoryWithProducts = {
  category: Category
  products: Product[]
  productsCounter: number
}

type Props = {
  city: City | null
  homeContent?: any
}

export default function GrandBazarClientApp({ city, homeContent }: Props) {
  const [productsAndCategories, setProductsWithCategories] = useState<TCategoryWithProducts[] | null>()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const { setCity } = useCityStore()

  useEffect(() => {
    if (city) {
      setCity(city)
    }
  }, [city, setCity])

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

  useEffect(() => {
    getProductsWithCategories()
  }, [getProductsWithCategories])

  return (
    <>
      <section className="products bg-gray-50">
        <div className="flex flex-col gap-3 px-4 mx-auto mt-1 mb-4 rounded-md bg-gray-50 max-w-7xl">
          {homeContent && (
            <div className="rich-container pt-4">
              <RichText converters={jsxConverters} data={homeContent} />
            </div>
          )}

          {error ? (
            <ErrorAlert
              buttonAction={() => getProductsWithCategories()}
              errorMessage="Не удалось загрузить товары, проверьте подключение к интернету."
            />
          ) : isLoading || !productsAndCategories ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
            </div>
          ) : (
            productsAndCategories.map((item) => (
              <div key={item.category.id} className="flex flex-col gap-4 pt-3">
                {item.products.length ? (
                  <>
                    <div className="flex items-start justify-between w-full">
                      <h2 className="text-lg font-bold text-black md:text-2xl">{item.category.title}</h2>
                    </div>
                    <div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-4 md:grid-cols-4">
                      {item.products.map((product) => (
                        <ProductCard city={city} key={product.id} product={product} />
                      ))}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  )
}
