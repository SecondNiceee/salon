"use client"

import { Button } from "@/components/ui/button"
import { useFavoritesStore } from "@/entities/favorites/favoritesStore"
import { useAuthStore } from "@/entities/auth/authStore"
import type { Product } from "@/payload-types"
import { Heart, Phone } from "lucide-react"
import { useGuestBenefitsStore } from "@/components/auth/guest-benefits-modal"
import { useState } from "react"

const ProductInfo = ({ product }: { product: Product }) => {
  const { addToFavorites, removeFromFavorites, favoriteProductIds } = useFavoritesStore()
  const { user } = useAuthStore()
  const isFavorite = [...favoriteProductIds].find((id) => id === product.id)
  const { openDialog } = useGuestBenefitsStore()
  const [isBooking, setIsBooking] = useState(false)

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
    // TODO: Implement callback request logic
    console.log("[v0] Booking service:", product.title)

    // Simulate API call
    setTimeout(() => {
      setIsBooking(false)
      alert("Спасибо! Мы свяжемся с вами в ближайшее время.")
    }, 1000)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {product.title.toUpperCase()}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Favorites Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavoriteClick}
            className="w-12 h-12 sm:w-14 sm:h-14 p-0 hover:bg-gray-100 rounded-full border border-gray-200 flex-shrink-0"
          >
            <Heart
              className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            />
          </Button>

          {/* Booking Button */}
          <Button
            onClick={handleBooking}
            disabled={isBooking}
            className="flex-1 h-12 sm:h-14 text-base sm:text-lg font-semibold bg-primary hover:bg-primary/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Phone className="w-5 h-5" />
            {isBooking ? "Отправка..." : "Забронировать"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductInfo
