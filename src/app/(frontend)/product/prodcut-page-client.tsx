"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import BreadCrumb from "@/components/product-page/ui/BreadCrumb"
import NutrientInformation from "@/components/product-page/ui/NutrientInformation"
import ProductImage from "@/components/product-page/ui/ProductImage"
import ProductInfo from "@/components/product-page/ui/ProductInfo"
import ReviewSection from "@/components/product-page/ui/ReviewSection"
import type { Product } from "@/payload-types"

interface ProductPageClientProps {
  product: Product
  productId: string
}

export default function ProductPageClient({ product, productId }: ProductPageClientProps) {
  const router = useRouter()

  const handleGoBack = () => {
    router.back()
  }

  return (
    <section className="min-h-screen mx-auto bg-white max-w-7xl">
      <div className="px-3 pt-4 sm:px-6">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 transition-colors duration-200 rounded-lg hover:text-gray-800 hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Вернуться назад</span>
        </button>
      </div>

      <BreadCrumb product={product} />

      <div className="px-3 py-2 sm:px-6 sm:py-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-8">
          <ProductImage product={product} />
          <ProductInfo product={product} />
        </div>
      </div>

      <ReviewSection id={productId} product={product} />
      <NutrientInformation product={product} />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          margin: 12px 0;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #d1d5db transparent;
        }
      `}</style>
    </section>
  )
}
