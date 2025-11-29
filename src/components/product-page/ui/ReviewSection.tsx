"use client"

import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/entities/auth/authStore"
import { useProductsStore } from "@/entities/products/productsStore"
import type { Product, Review } from "@/payload-types"
import { reviewService } from "@/services/review/reviewsService"
import { Star, MessageCircle, Loader2, Send, User, Edit2 } from "lucide-react"
import { type FC, useEffect, useState } from "react"
import { toast } from "sonner"
import StarJSX from "./Star"

interface IReviewSection {
  product: Product
  id: string | null
}
const ReviewSection: FC<IReviewSection> = ({ product, id }) => {
  const [newReview, setNewReview] = useState({ rating: 4, comment: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [editingReview, setEditingReview] = useState<number | null>(null)
  const [editReviewData, setEditReviewData] = useState({ rating: 4, comment: "" })
  const [hasPurchased, setHasPurchased] = useState<boolean | null>(null)
  const [showPurchaseWarning, setShowPurchaseWarning] = useState(false)
  const { user } = useAuthStore()

  const loadReviews = async (productId: number) => {
    setReviewsLoading(true)
    try {
      const reviews = await reviewService.loadReviews(productId)
      setReviews(reviews)
    } catch (e) {
      console.error("Error loading reviews:", e)
      toast("Не удалось загрузить отзывы, проверьте подключение.")
      setReviews([])
    } finally {
      setReviewsLoading(false)
    }
  }

  const checkPurchase = async () => {
    if (!user || !product) return
    try {
      const response = await fetch("/api/check-purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      })
      const data = await response.json()
      setHasPurchased(data.hasPurchased)
    } catch (error) {
      console.error("Error checking purchase:", error)
      setHasPurchased(false)
    }
  }

  useEffect(() => {
    loadReviews(Number(id))
  }, [id, user])

  useEffect(() => {
    if (user && product) {
      checkPurchase()
    } else {
      setHasPurchased(null)
    }
  }, [user, product])

  const handleReviewSubmit = async () => {
    if (!product) {
      toast("Товар не загружен, перезагрузите страницу.")
      return
    }
    if (!user) {
      toast("Нужно быть зарегестрированным, чтобы оставить отзыв")
      return
    }

    if (reviewsLoading) {
      toast("Подождите, загружаются отзывы...")
      return
    }
    setIsSubmitting(true)
    try {
      const review = await reviewService.createReview({
        comment: newReview.comment,
        productId: product.id,
        rating: newReview.rating,
      })
      if (review) {
        const newReviewWithUser = {
          ...review,
          user: user,
          createdAt: new Date().toISOString(),
        }
        setReviews((prev) => [newReviewWithUser, ...prev])

        const newReviewsCount = (product.reviewsCount || 0) + 1
        const newAverageRating =
          ((product.averageRating || 0) * (product.reviewsCount || 0) + newReview.rating) / newReviewsCount

        useProductsStore.setState((state) => ({
          ...state,
          product: {
            ...product,
            averageRating: Math.round(newAverageRating * 10) / 10,
            reviewsCount: newReviewsCount,
          },
        }))
        setNewReview({ rating: 5, comment: "" })
        setShowReviewForm(false)
        toast("Отзыв успешно добавлен!")
      }
    } catch (error: any) {
      console.error("Error submitting review:", error)
      toast(error?.message || "Ошибка при отправке отзыва")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShowReviewForm = async () => {
    if (!user) {
      toast("Нужно быть зарегестрированным, чтобы оставить отзыв")
      return
    }

    if (hasPurchased === null) {
      await checkPurchase()
    }

    if (hasPurchased === false) {
      setShowPurchaseWarning(true)
      return
    }

    setShowPurchaseWarning(false)
    setShowReviewForm(!showReviewForm)
  }

  const handleEditReview = async (reviewId: number) => {
    if (!product) {
      toast("Продукт не загрузился, пожалуйста перезагрузите страничку")
      return
    }
    if (!user) return
    setIsSubmitting(true)
    try {
      const review = await reviewService.changeReview({
        comment: editReviewData.comment,
        rating: editReviewData.rating,
        reviewId,
      })
      if (review) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId ? { ...r, rating: editReviewData.rating, comment: editReviewData.comment } : r,
          ),
        )

        const updatedReviews = reviews.map((r) => (r.id === reviewId ? { ...r, rating: editReviewData.rating } : r))
        const newAverageRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length

        useProductsStore.setState((state) => ({
          ...state,
          product: {
            ...product,
            averageRating: Math.round(newAverageRating * 10) / 10,
          },
        }))

        setEditingReview(null)
        setEditReviewData({ rating: 5, comment: "" })
        toast("Отзыв успешно обновлен!")
      }
    } catch (error: any) {
      console.error("Error updating review:", error)
      toast(error?.message || "Ошибка при обновлении отзыва")
    } finally {
      setIsSubmitting(false)
    }
  }

  const startEditReview = (review: Review) => {
    setEditingReview(review.id)
    setEditReviewData({
      rating: review.rating,
      comment: review.comment || "",
    })
  }

  const userReview = user
    ? reviews.find((review) => (typeof review.user === "object" ? review.user.id === user.id : review.user === user.id))
    : null

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-8 border-t border-gray-50">
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4 sm:mb-6">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <h3 className="text-lg sm:text-2xl font-semibold text-gray-900">Отзывы покупателей</h3>
          {product.averageRating && product.averageRating > 0 && product.reviewsCount && product.reviewsCount > 0 ? (
            <div className="flex items-center space-x-2 bg-orange-50 px-2 py-1 sm:px-3 sm:py-2 rounded-lg self-start">
              <span className="text-lg sm:text-xl font-bold text-orange-600">{product.averageRating.toFixed(1)}</span>
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 fill-current" />
              <span className="text-sm sm:text-base text-gray-600 font-medium">
                {product.reviewsCount}{" "}
                {product.reviewsCount === 1 ? "отзыв" : product.reviewsCount < 5 ? "отзыва" : "отзывов"}
              </span>
            </div>
          ) : (
            <></>
          )}
        </div>

        {!userReview && !reviewsLoading && (
          <Button
            onClick={handleShowReviewForm}
            className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 py-2 sm:px-4 sm:py-2 min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4 flex-shrink-0" />
            <span>Написать отзыв</span>
          </Button>
        )}
      </div>

      {showPurchaseWarning && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4 sm:mb-6 animate-in slide-in-from-top-2 duration-300">
          <p className="text-amber-800 text-sm sm:text-base text-center font-medium">
            Вам нужно приобрести эту услугу, чтобы оставить отзыв
          </p>
        </div>
      )}

      {Boolean(showReviewForm && user && !userReview && !reviewsLoading) && (
        <div className="bg-gray-50 rounded-xl p-3 sm:p-6 mb-4 sm:mb-6 animate-in slide-in-from-bottom-2 duration-300">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Оставить отзыв</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleReviewSubmit()
            }}
            className="space-y-3 sm:space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ваша оценка</label>
              <div className="flex gap-2 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full relative transition-all flex items-center justify-center touch-manipulation ${
                      star <= newReview.rating
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                    }`}
                  >
                    <StarJSX />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ваш отзыв</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white text-sm sm:text-base"
                placeholder="Поделитесь своим опытом использования товара..."
                required
                minLength={10}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowReviewForm(false)}
                className="text-gray-500 hover:text-gray-700 min-h-[44px]"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !newReview.comment.trim() || newReview.comment.length < 10}
                className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center space-x-2 min-h-[44px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Отправка...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Отправить отзыв</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3 sm:space-y-6">
        {reviewsLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-orange-500 mr-2" />
            <span className="text-gray-500 text-sm sm:text-base">Загрузка отзывов...</span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 text-sm sm:text-base">Пока нет отзывов об этом товаре.</p>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">Будьте первым, кто оставит отзыв!</p>
          </div>
        ) : (
          reviews.map((review) => {
            const reviewUser = typeof review.user === "object" ? review.user : null
            const isOwnReview =
              user && (typeof review.user === "object" ? review.user.id === user.id : review.user === user.id)

            return (
              <div
                key={review.id}
                className="bg-white border border-gray-100 rounded-xl p-3 sm:p-6 hover:shadow-md transition-shadow"
              >
                {editingReview === review.id ? (
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ваша оценка</label>
                      <div className="flex gap-2 items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setEditReviewData({ ...editReviewData, rating: star })}
                            className={`w-10 h-10 sm:w-8 sm:h-8 rounded-full relative transition-all flex items-center justify-center touch-manipulation ${
                              star <= editReviewData.rating
                                ? "bg-yellow-400 text-white"
                                : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                            }`}
                          >
                            <StarJSX />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ваш отзыв</label>
                      <textarea
                        value={editReviewData.comment}
                        onChange={(e) => setEditReviewData({ ...editReviewData, comment: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white text-sm sm:text-base"
                        required
                        minLength={10}
                      />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end space-y-2 space-y-reverse sm:space-y-0 sm:space-x-3">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setEditingReview(null)
                          setEditReviewData({ rating: 5, comment: "" })
                        }}
                        className="text-gray-500 hover:text-gray-700 min-h-[44px]"
                      >
                        Отмена
                      </Button>
                      <Button
                        onClick={() => handleEditReview(review.id)}
                        disabled={isSubmitting || !editReviewData.comment.trim() || editReviewData.comment.length < 10}
                        className="bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center space-x-2 min-h-[44px]"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Сохранение...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Сохранить</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-start sm:justify-between sm:space-y-0 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {reviewUser?.email || "Пользователь"}
                          </h4>
                          <p className="text-xs sm:text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString("ru-RU", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end space-x-2 sm:flex-col sm:items-end sm:space-x-0 sm:space-y-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        {isOwnReview && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditReview(review)}
                            className="h-8 w-8 p-0 hover:bg-gray-100 touch-manipulation"
                          >
                            <Edit2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{review.comment}</p>
                  </>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default ReviewSection
  