'use client'

import type React from 'react'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Minus, Plus, Heart, Star } from 'lucide-react'
import type { Media, Product } from '@/payload-types'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/entities/cart/cartStore'
import { useAuthStore } from '@/entities/auth/authStore'
import { useFavoritesStore } from '@/entities/favorites/favoritesStore'
import { toast } from 'sonner'
import { useGuestBenefitsStore } from '../auth/guest-benefits-modal'
import { routerConfig } from '@/config/router.config'
import SmartImage from '../smart-image/SmartImage'

interface IProductCard {
  product: Product
  clickHandler?: () => void
}

export function ProductCard({ product, clickHandler }: IProductCard) {
  const router = useRouter()
  const { increment, dicrement, items } = useCartStore()
  const { addToFavorites, removeFromFavorites, favoriteProductIds } = useFavoritesStore()
  const { user } = useAuthStore()
  const { openDialog: openGuestDialog } = useGuestBenefitsStore()
  const qty = items.find((item) => item.product.id === product.id)?.quantity ?? 0


  const isFavorite = [...favoriteProductIds].find((id) => id === product.id)

  const onProductClick = () => {
    router.push(`${routerConfig.product}?id=${product.id}`)
    if (clickHandler) {
      clickHandler()
    }
  }

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) {
      openGuestDialog('favorites')
      return
    }
    if (isFavorite) {
      try {
        await removeFromFavorites(product.id)
      } catch (e) {
        console.log(e)
        toast('Не удалось удалить товар из избранного, проверьте подключение к интернету')
      }
    } else {
      try {
        await addToFavorites(product.id)
      } catch (e) {
        console.log(e)
        toast('Не удалось добавить товар в избранное, проверьте подключение к интернету')
      }
    }
  }

  return (
    <Card
      onClick={onProductClick}
      className="p-0 cursor-pointer gap-0 justify-between bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Product Image with Heart Icon */}
      <div className="aspect-[4/3] relative overflow-hidden rounded-t-2xl bg-gray-50">
        <SmartImage
          loading="lazy"
          width={400}
          height={300}
          src={(product?.image as Media).url || '/placeholder.svg'}
          alt={(product?.image as Media).alt || 'Изображение товара'}
          className="object-cover w-full h-full"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2 pt-3">
        {/* Brand/Title */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
              {product.title}
            </h3>
          </div>
        </div>

        {product.averageRating &&
        product.averageRating > 0 &&
        product.reviewsCount &&
        product.reviewsCount > 0 ? (
          <div className="flex items-center space-x-1">
            <span className="text-sm font-semibold text-orange-500">
              {product.averageRating.toFixed(1)}
            </span>
            <Star className="w-4 h-4 text-orange-400 fill-current" />
            <span className="text-xs text-gray-500">
              {product.reviewsCount}{' '}
              {product.reviewsCount === 1
                ? 'отзыв'
                : product.reviewsCount < 5
                  ? 'отзыва'
                  : 'отзывов'}
            </span>
          </div>
        ) : (
          <div className="flex items-center">
            <span className="text-xs text-gray-400">Нет отзывов</span>
          </div>
        )}

        {/* Price and Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
          </div>

          {qty === 0 ? (
            <Button
              onClick={(e) => {
                increment(product)
                e.stopPropagation()
              }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl py-2 text-sm font-medium"
            >
              В корзину
            </Button>
          ) : (
            <div className="flex md:h-auto h-[36px] items-center justify-between bg-gray-50 rounded-xl p-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-200 rounded-lg"
                onClick={(e) => {
                  dicrement(product.id)
                  e.stopPropagation()
                }}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{qty} шт</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-gray-200 rounded-lg"
                onClick={(e) => {
                  increment(product)
                  e.stopPropagation()
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
