"use client"

import { Button } from "@/components/ui/button"
import { useFavoritesStore } from "@/entities/favorites/favoritesStore"
import { useAuthStore } from "@/entities/auth/authStore"
import type { Product } from "@/payload-types"
import { Minus, Plus, Heart } from "lucide-react"
import { useGuestBenefitsStore } from "@/components/auth/guest-benefits-modal"

const ProductInfo = ({ product }: { product: Product }) => {
  const { addToFavorites, removeFromFavorites, favoriteProductIds } = useFavoritesStore()
  const { user } = useAuthStore()
  const isFavorite = [...favoriteProductIds].find((id) => id === product.id)
  const { openDialog } = useGuestBenefitsStore()


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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 leading-tight">
          {product.title.toUpperCase()}
        </h1>
      </div>

      <div className="space-y-4">
        {/* Price Section */}
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
          </div>
        </div>

        {/* Actions Section */}
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

          {/* Counter or Add to Cart */}
            <div className="flex items-center gap-2 sm:gap-3 justify-between bg-white rounded-lg p-2 border border-gray-200 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="sm"
                className="shadow-sm w-10 h-10 sm:w-12 sm:h-12 p-0 hover:bg-gray-200 rounded-lg flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="shadow-sm w-10 h-10 sm:w-12 sm:h-12 p-0 hover:bg-gray-200 rounded-lg flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
        </div>
      </div>

    </div>
  )
}

export default ProductInfo
