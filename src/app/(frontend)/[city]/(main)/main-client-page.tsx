"use client"
import { getCategoriesWithProducts } from "@/actions/server/categories/getCategoriesWithProducts"
import ErrorAlert from "@/components/error-alert/ErrorAlert"
import { ProductCard } from "@/components/product-card/ProductCard"
import { Badge } from "@/components/ui/badge"
import type { Category, Product } from "@/payload-types"
import { Loader2, MoveRight } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"

type TCategoryWithProducts = {
  category: Category
  products: Product[]
  productsCounter: number
}
export default function GrandBazarClientApp() {
  const [productsAndCategories, setProductsWithCategories] = useState<TCategoryWithProducts[] | null>()
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)

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
  return (
    <>
      <section className="products bg-gray-50">
        <div className="flex flex-col gap-3 px-4 mx-auto mt-1 mb-4 rounded-md bg-gray-50 max-w-7xl">
          {productsAndCategories.map((item) => (
            <div key={item.category.id} className="flex flex-col gap-4 pt-3">
              {item.products.length ? (
                <>
                  <div className="flex items-start justify-between w-full">
                    <h2 className="text-lg font-bold text-black md:text-2xl">{item.category.title}</h2>
                    {item.productsCounter - 6 > 0 && (
                      <Link href={`/${item.category.value}`} className="flex items-center self-end">
                        <Badge className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 cursor-pointer transition-colors">
                          <p className="text-sm text-white">Еще {item.productsCounter - 6}</p>
                          <MoveRight color="white" size={15} />
                        </Badge>
                      </Link>
                    )}
                  </div>
                  <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
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
