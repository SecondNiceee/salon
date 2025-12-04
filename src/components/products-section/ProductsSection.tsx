"use client"

import useSWR from "swr"
import { ProductCard } from "@/components/product-card/ProductCard"
import type { Category, Product, City } from "@/payload-types"
import { useAccessibilityStore } from "@/entities/accessibility/accessibilityStore"
import { getCategoriesWithProducts } from "@/actions/server/categories/getCategoriesWithProducts"
import { ProductsSectionSkeleton } from "./ProductsSkeleton"

type TCategoryWithProducts = {
  category: Category
  products: Product[]
  productsCounter: number
}

interface ProductsSectionProps {
  city: City | null
}

const fetcher = () => getCategoriesWithProducts()

export default function ProductsSection({ city }: ProductsSectionProps) {
  const { isLargeText } = useAccessibilityStore()

  const { data: productsAndCategories, isLoading } = useSWR<TCategoryWithProducts[]>(
    "categories-with-products",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  if (isLoading || !productsAndCategories) {
    return <ProductsSectionSkeleton categoriesCount={3} isLargeText={isLargeText} />
  }

  let globalProductIndex = 0

  return (
    <>
      {productsAndCategories.map((item) => (
        <div key={item.category.id} className="flex flex-col gap-4 pt-3">
          {item.products.length ? (
            <>
              <div className="flex items-start justify-between w-full">
                <h2 className="text-xl font-bold text-black md:text-2xl">{item.category.title}</h2>
              </div>
              <div
                className={`grid w-full gap-4 ${isLargeText ? "grid-cols-1" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"}`}
              >
                {item.products.map((product) => {
                  const isPriority = globalProductIndex < 8
                  globalProductIndex++
                  return <ProductCard city={city} key={product.id} product={product} priority={isPriority} />
                })}
              </div>
            </>
          ) : null}
        </div>
      ))}
    </>
  )
}
