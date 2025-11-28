"use client"
import { ProductCard } from "@/components/product-card/ProductCard"
import type { Category, Product, City } from "@/payload-types"
import "@/styles/richText.scss"
import MemoRichText from "@/components/memo-rich-text/MemoRichText"

type TCategoryWithProducts = {
  category: Category
  products: Product[]
  productsCounter: number
}

type Props = {
  city: City | null
  homeContent?: any,
  productsAndCategories : TCategoryWithProducts[]
}

export default function GrandBazarClientApp({ city, homeContent, productsAndCategories }: Props) {

  return (
    <>
      <section className="products bg-gray-50">
        <div className="flex flex-col gap-3 px-4 mx-auto mt-1 mb-4 rounded-md bg-gray-50 max-w-7xl">
          {homeContent && (
            <div className="rich-container pt-4">
              <MemoRichText data={homeContent} />
            </div>
          )}

          { 
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
          }
        </div>
      </section>
    </>
  )
}
