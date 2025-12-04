"use client"

import type { City } from "@/payload-types"
import "@/styles/richText.scss"
import MemoRichText from "@/components/memo-rich-text/MemoRichText"
import { ProductsSectionSkeleton } from "@/components/products-section/ProductsSkeleton"
import { useAccessibilityStore } from "@/entities/accessibility/accessibilityStore"
import dynamic from "next/dynamic"

const ProductsSection = dynamic(() => import("@/components/products-section/ProductsSection"), {
  ssr: false,
  loading: () => <ProductsSectionSkeletonWrapper />,
})

function ProductsSectionSkeletonWrapper() {
  const { isLargeText } = useAccessibilityStore()
  return <ProductsSectionSkeleton categoriesCount={3} isLargeText={isLargeText} />
}

type Props = {
  city: City | null
  homeContent?: any
}

export default function GrandBazarClientApp({ city, homeContent }: Props) {
  return (
    <>
      <section className="products bg-gray-50">
        <div className="flex flex-col gap-3 px-4 mx-auto mt-1 mb-4 rounded-md bg-gray-50 max-w-7xl">
          {/* RichText грузится сразу */}
          {homeContent && (
            <div className="rich-container pt-4">
              <MemoRichText data={homeContent} />
            </div>
          )}

          <ProductsSection city={city} />
        </div>
      </section>
    </>
  )
}
