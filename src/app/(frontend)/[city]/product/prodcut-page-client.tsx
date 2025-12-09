"use client"

import { ArrowLeft, Phone, ChevronRight, ChevronLeft, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import ReviewSection from "@/components/product-page/ui/ReviewSection"
import type { Product } from "@/payload-types"
import type { City } from "@/payload-types"
import { replaceCityVariables, replaceCityInRichText } from "@/utils/replaceCityVariables"
import "@/styles/richText.scss"
import { useFavoritesStore } from "@/entities/favorites/favoritesStore"
import { useAuthStore } from "@/entities/auth/authStore"
import { useGuestBenefitsStore } from "@/components/auth/guest-benefits-modal"
import { Button } from "@/components/ui/button"
import ThankYouModal from "@/components/product-page/ui/ThankYouModal"
import { toast } from "sonner"
import { useBookingModalStore } from "@/entities/booking/bookingModalStore"
import { useCityStore } from "@/entities/city/cityStore"
import MemoRichText from "@/components/memo-rich-text/MemoRichText"
import { useHistory } from "@/providers/history-provider"

interface ProductPageClientProps {
  product: Product
  productId: string
  city: City | null
}

export default function ProductPageClient({ product, productId, city }: ProductPageClientProps) {
  const router = useRouter()
  const { addToFavorites, removeFromFavorites, favoriteProductIds } = useFavoritesStore()
  const { user } = useAuthStore()
  const isFavorite = [...favoriteProductIds].find((id) => id === product.id)
  const { openDialog } = useGuestBenefitsStore()
  const { openModal: openBookingModal } = useBookingModalStore()
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false)
  const [isShortDescription, setIsShortDescription] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const { setIsSubmitting, isSubmitting } = useBookingModalStore.getState()
  const { city: storedCity, setCity } = useCityStore()
  const { goBack } = useHistory()

  useEffect(() => {
    if (city) {
      setCity(city)
    }
  }, [city, setCity])

  useEffect(() => {
    if (descriptionRef.current) {
      const height = descriptionRef.current.offsetHeight
      setIsShortDescription(height < 240)
    }
  }, [product])

  const handleGoBack = () => {
    const url = goBack()
    router.push(url)
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
    if (user && user.name && user.phone) {
      try {
        setIsSubmitting(true)

        const currentCity = storedCity || city
        const response = await fetch("/api/booking/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            productId: product.id,
            city: currentCity?.declensions?.nominative || currentCity?.title,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          toast.error(result.message || "Ошибка при отправке заявки")
          setIsSubmitting(false)
          return
        }

        setIsSubmitting(false)
        openBookingModal(user, product.id, "success") // Open modal in success mode
      } catch (error) {
        console.error("Error submitting booking:", error)
        toast.error("Ошибка при отправке заявки. Попробуйте еще раз.")
        setIsSubmitting(false)
      }
    } else {
      openBookingModal(user, product.id)
    }
  }

  const cityDeclensions = city
    ? {
        nominative: city.declensions.nominative,
        genitive: city.declensions.genitive,
        prepositional: city.declensions.prepositional,
      }
    : null

  const processedTitle = replaceCityVariables(String(product.pageTitle), cityDeclensions)
  const processedContent = product.content ? replaceCityInRichText(product.content, cityDeclensions) : null

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
          <div className="flex flex-col items-center justify-center w-full">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight text-center">
              {processedTitle.toUpperCase()}
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

      <div className="px-3 py-4 sm:px-6 sm:py-10">
        <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6">
          <div className="flex">
            <div className="flex flex-col items-center justify-center w-full">
              {processedContent && (
                <div
                  ref={descriptionRef}
                  className={`rich-container w-full ${
                    isShortDescription ? "text-center pt-6 pb-3 px-4 border-t-2 border-b-2 border-gray-300" : ""
                  }`}
                >
                  <MemoRichText data={processedContent} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleBooking}
            disabled={isSubmitting}
            className={`h-14 px-8 sm:px-12 text-base sm:text-lg font-bold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 animate-gradient ${
              isSubmitting ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <Phone className="w-5 h-5 animate-pulse" />
                <span>Отправляется...</span>
              </>
            ) : (
              <>
                <ChevronRight className="w-5 h-5" />
                <Phone className="w-5 h-5" />
                <span>Записаться</span>
                <ChevronLeft className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </div>

      <div id="reviews-section">
        <ReviewSection id={productId} product={product} />
      </div>

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
