"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Minus, Plus, Heart, Star, ImageIcon } from 'lucide-react'
import type { Media, Product } from "@/payload-types"
import { useRouter } from 'next/navigation'
import { useAuthStore } from "@/entities/auth/authStore"
import { useFavoritesStore } from "@/entities/favorites/favoritesStore"
import { toast } from "sonner"
import { useGuestBenefitsStore } from "../auth/guest-benefits-modal"
import { routerConfig } from "@/config/router.config"
import SmartImage from "../smart-image/SmartImage"
import { useCity, useCityData } from "@/lib/use-city"
import { useBookingModalStore } from "@/entities/booking/bookingModalStore"

interface IProductCard {
  product: Product
  clickHandler?: () => void
}

export function ProductCard({ product, clickHandler }: IProductCard) {
  const router = useRouter()
  const { addToFavorites, removeFromFavorites, favoriteProductIds } = useFavoritesStore()
  const { user } = useAuthStore()
  const { openDialog: openGuestDialog } = useGuestBenefitsStore()
  const { openModal: openBookingModal, setIsSubmitting, isSubmitting } = useBookingModalStore()

  const isFavorite = [...favoriteProductIds].find((id) => id === product.id)
  const city = useCity();
  const cityData = useCityData();
  
  const onProductClick = async () => {
    // If product doesn't have a dedicated page, open booking modal
    if (product.hasProductPage === false) {
      handleBooking()
      return
    }

    // Otherwise navigate to product page as usual
    router.push(routerConfig.getPath(city, `${routerConfig.product}?id=${product.id}`) )
    if (clickHandler) {
      clickHandler()
    }
  }

  const handleBooking = async () => {
    // Check if user is authenticated and has both name and phone
    if (user && user.name && user.phone) {
      try {
        setIsSubmitting(true)

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
      // If user doesn't have complete data, show the booking modal
      openBookingModal(user, product.id)
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      openGuestDialog("favorites")
      return
    }
    if (isFavorite) {
      try {
        await removeFromFavorites(product.id)
      } catch (e) {
        console.log(e)
        toast("Не удалось удалить товар из избранного, проверьте подключение к интернету")
      }
    } else {
      try {
        await addToFavorites(product.id)
      } catch (e) {
        console.log(e)
        toast("Не удалось добавить товар в избранное, проверьте подключение к интернету")
      }
    }
  }

  const hasImage = product.image && typeof product.image === 'object' && (product.image as Media).url

  return (
    <Card
      onClick={onProductClick}
      className="p-0 cursor-pointer gap-0 justify-between bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Product Image with Heart Icon or Placeholder */}
      {hasImage && (
        <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl bg-gradient-to-br from-orange-50 to-orange-100">
          <SmartImage
            loading="lazy"
            width={400}
            height={300}
            src={(product.image as Media).url}
            alt={(product.image as Media).alt || "Изображение товара"}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-200 shadow-md"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>
        </div>
      )}

      {/* Product Info */}
      <div className="p-5 flex flex-col gap-3 pt-4">
        {/* Brand/Title */}
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 line-clamp-2 leading-snug">{product.title}</h3>
          </div>
          {!hasImage && (
            <button
              onClick={handleFavoriteClick}
              className="ml-2 w-9 h-9 flex items-center justify-center hover:bg-orange-50 rounded-full transition-all duration-200 flex-shrink-0"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${
                  isFavorite ? "text-red-500 fill-red-500" : "text-gray-600 hover:text-red-500"
                }`}
              />
            </button>
          )}
        </div>

        {cityData && (
          <div className="flex items-center">
            <span className="text-xs text-gray-500">{cityData.declensions.nominative}</span>
          </div>
        )}

        {product.averageRating && product.averageRating > 0 && product.reviewsCount && product.reviewsCount > 0 ? (
          <div className="flex items-center space-x-1.5">
            <span className="text-sm font-semibold text-orange-500">{product.averageRating.toFixed(1)}</span>
            <Star className="w-4 h-4 text-orange-400 fill-current" />
            <span className="text-xs text-gray-500">
              {product.reviewsCount}{" "}
              {product.reviewsCount === 1 ? "отзыв" : product.reviewsCount < 5 ? "отзыва" : "отзывов"}
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-xs text-gray-400">Нет отзывов</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="space-y-2.5 mt-1">
          <div className="flex items-center gap-2">
            {product.price && <span className="text-base font-semibold text-gray-800">От {product.price} ₽</span>}
          </div>
          <Button
            className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            disabled={isSubmitting && product.hasProductPage === false}
          >
            {product.hasProductPage === false 
              ? (isSubmitting ? "Загрузка..." : "Записаться") 
              : "Подробнее"
            }
          </Button>
        </div>
      </div>
    </Card>
  )
}
