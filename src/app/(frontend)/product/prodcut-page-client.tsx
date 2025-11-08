"use client"

import { ArrowLeft, Heart, Phone, ChevronRight, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
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
import BookingModal from "@/components/product-page/ui/BookingModal"
import ThankYouModal from "@/components/product-page/ui/ThankYouModal"
import { toast } from "sonner"

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false)
  const [isShortDescription, setIsShortDescription] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (descriptionRef.current) {
      const height = descriptionRef.current.offsetHeight
      // Если высота меньше ~240px (примерно 8 строк текста), то это короткое описание
      setIsShortDescription(height < 240)
    }
  }, [product])

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
    // Check if user is authenticated and has both name and phone
    if (user && user.name && user.phone) {
      setIsBooking(true)
      try {
        const response = await fetch("/api/booking/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            productId: product.id,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          toast.error(result.message || "Ошибка при отправке заявки")
          return
        }

        // Show thank you modal instead of toast
        setIsThankYouModalOpen(true)
      } catch (error) {
        console.error("Error submitting booking:", error)
        toast.error("Ошибка при отправке заявки. Попробуйте еще раз.")
      } finally {
        setIsBooking(false)
      }
    } else {
      // If user doesn't have complete data, show the booking modal
      setIsModalOpen(true)
    }
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
          <span className="-translate-y-0.5">Вернуться назад</span>
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
          <div className="flex">
            {/* Description - on the left, centered */}
            <div className="flex flex-col items-center justify-center w-full">
              {product.content && (
                <div
                  ref={descriptionRef}
                  className={`rich-container w-full ${
                    isShortDescription ? "text-center pt-6 pb-3 px-4 border-t-2 border-b-2 border-gray-300" : ""
                  }`}
                >
                  <RichText converters={jsxConverters} data={product.content} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleBooking}
            disabled={isBooking}
            className="h-14 px-8 sm:px-12 text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 animate-gradient"
          >
            <ChevronRight className="w-5 h-5" />
            <Phone className="w-5 h-5" />
            <span>{isBooking ? "Отправка..." : "Записаться"}</span>
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div id="reviews-section">
        <ReviewSection id={productId} product={product} />
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productTitle={product.title}
        user={user}
        productId={product.id}
      />

      <ThankYouModal isOpen={isThankYouModalOpen} onClose={() => setIsThankYouModalOpen(false)} />

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
