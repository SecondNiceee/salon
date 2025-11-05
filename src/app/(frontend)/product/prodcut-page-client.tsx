"use client"

import { ArrowLeft, Heart, Phone, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import ProductImage from "@/components/product-page/ui/ProductImage"
import ReviewSection from "@/components/product-page/ui/ReviewSection"
import type { Product } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"
import jsxConverters from "@/utils/jsx-converters"
import "@/styles/richText.scss"
import { useFavoritesStore } from "@/entities/favorites/favoritesStore"
import { useAuthStore } from "@/entities/auth/authStore"
import { useGuestBenefitsStore } from "@/components/auth/guest-benefits-modal"
import { Button } from "@/components/ui/button"

interface ProductPageClientProps {
  product: Product
  productId: string
}

export default function ProductPageClient({ product, productId }: ProductPageClientProps) {
  const router = useRouter()
  const { addToFavorites, removeFromFavorites, favoriteProductIds } = useFavoritesStore()
  const { user } = useAuthStore()
  const isFavorite = [...favoriteProductIds].find((id) => id === product.id)
  const { openDialog } = useGuestBenefitsStore()
  const [isBooking, setIsBooking] = useState(false)

  const handleGoBack = () => {
    router.back()
  }

  const handleFavoriteClick = async () => {
    if (!user) {
      openDialog("favorites")
      return
    }
    if (isFavorite) {
      await removeFromFavorites(product.id)
    } else {
      await addToFavorites(product.id)
    }
  }

  const handleBooking = async () => {
    setIsBooking(true)
    console.log("[v0] Booking service:", product.title)

    // Simulate API call
    setTimeout(() => {
      setIsBooking(false)
      alert("Спасибо! Мы свяжемся с вами в ближайшее время.")
    }, 1000)
  }

  const handleReviewClick = () => {
    const reviewSection = document.getElementById("reviews-section")
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
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

      <div className="px-3 py-4 sm:px-6">
        <div className="flex items-center justify-center gap-4">
          <div className="flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight text-center">
              {product.title.toUpperCase()}
            </h1>
            <div className="mt-2 h-1 w-32 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"></div>
          </div>
          <button
            onClick={handleFavoriteClick}
            className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-200 hover:border-pink-300 transition-all duration-200 flex items-center justify-center bg-white hover:bg-pink-50"
          >
            <Heart
              className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                isFavorite ? "text-pink-500 fill-pink-500" : "text-gray-400 hover:text-pink-500"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="px-3 py-8 sm:px-6 sm:py-10">
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Description - on the left */}
            <div className="flex flex-col lg:order-1">
              {product.description && (
                <div className="rich-container">
                  <RichText converters={jsxConverters} data={product.description} />
                </div>
              )}
            </div>

            {/* Image - on the right */}
            <div className="w-full lg:order-2">
              <ProductImage product={product} />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleBooking}
            disabled={isBooking}
            className="flex-1 h-14 sm:h-16 text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 animate-gradient"
          >
            <Phone className="w-6 h-6" />
            {isBooking ? "Отправка..." : "Записаться"}
          </Button>

        </div>
      </div>

      <div id="reviews-section">
        <ReviewSection id={productId} product={product} />
      </div>

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
        
        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  )
}
