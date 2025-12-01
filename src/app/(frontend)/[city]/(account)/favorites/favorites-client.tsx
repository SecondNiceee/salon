"use client"

import { Heart } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { useFavoritesStore } from "@/entities/favorites/favoritesStore"
import { ProductCard } from "@/components/product-card/ProductCard"
import { Button } from "@/components/ui/button"
import type { Product } from "@/payload-types"
import { getCityDeclensions } from "@/utils/replaceCityVariables"
import { useAccessibilityStore } from "@/entities/accessibility/accessibilityStore"

export default function FavoritesClientPage({ city }: { city: any }) {
  const {
    favorites,
    loading,
    loadFavorites,
    favoriteProductIds,
    loadMoreFavorites,
    removeFromFavorites,
    hasMore,
    isLoadingMore,
  } = useFavoritesStore()
  const [isLoading, setIsLoading] = useState(true)
  const [loadMoreElement, setLoadMoreElement] = useState<HTMLDivElement | null>(null)


  const { isLargeText } = useAccessibilityStore()

  useEffect(() => {
    const loadData = async () => {
      await loadFavorites()
      setIsLoading(false)
    }
    loadData()
  }, [loadFavorites])

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isLoadingMore) {
        loadMoreFavorites()
      }
    },
    [hasMore, isLoadingMore, loadMoreFavorites],
  )

  useEffect(() => {
    if (!loadMoreElement) return
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: "50px 0px",
      threshold: 0.1,
    })
    observer.observe(loadMoreElement)
    return () => observer.disconnect()
  }, [handleObserver, loadMoreElement])


  if (isLoading || loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
            <p className="text-gray-600 text-lg">Загрузка избранного...</p>
          </div>
        </div>
      </div>
    )
  }

  if (favorites.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
        <h2 className="md:text-2xl text-lg text-black font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-10">
          Избранное
        </h2>

        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-red-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Пока пусто</h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Добавляйте товары в избранное, нажимая на сердечко в карточке товара
          </p>
          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-8 py-3 text-lg rounded-xl"
          >
            Перейти к покупкам
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
      <div className="flex items-center justify-between mb-10">
        <h2 className="md:text-2xl text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Избранное
        </h2>
        <div className="flex items-center gap-2 text-gray-600">
          <Heart className="w-5 h-5 text-red-500" />
          <span className="text-base sm:text-lg font-medium">{[...favoriteProductIds].length} товаров</span>
        </div>
      </div>

      <div className={`grid grid-cols-1 gap-6 ${!isLargeText && "sm:grid-cols-2 lg:grid-cols-3"}`}>
        {favorites.map((favorite) => {
          const product = typeof favorite.product === "string" ? null : (favorite.product as Product)

          if (!product) return null

          return (
            <div key={favorite.id} className="relative group">
              <ProductCard city={city} product={product} />
            </div>
          )
        })}
      </div>

      <div ref={setLoadMoreElement} className="flex items-center justify-center h-[40px] mt-[20px]">
        {hasMore && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mb-2"></div>
            <p className="text-gray-600">Загружаем еще товары...</p>
          </div>
        )}
        {!hasMore && favorites.length > 0 && (
          <p className="text-gray-500 text-center">Все избранные товары загружены</p>
        )}
      </div>
    </div>
  )
}
