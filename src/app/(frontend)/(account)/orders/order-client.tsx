"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Package, Clock, CheckCircle, XCircle, RefreshCw, ChevronDown, ChevronUp, MapPin } from "lucide-react"
import { useRouter } from "next/navigation"
import useAuth from "@/hooks/useAuth"
import type { Media } from "@/payload-types"
import { toast } from "sonner"
import { useOrdersStore } from "@/entities/orders/ordersStore"
import { formatDate } from "@/utils/formatData"

const statusConfig = {
  pending: { label: "Принят", color: "bg-yellow-500", icon: Clock },
  waiting_call: { label: "Ожидаем звонок", color: "bg-blue-500", icon: Clock },
  delivered: { label: "Доставлен", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Отменен", color: "bg-red-500", icon: XCircle },
}

export default function OrdersClientPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { orders, loading, error, loadOrders, clearOrders, refreshOrder, refreshingOrderId } = useOrdersStore()

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadOrders()
  }, [user, clearOrders])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  // функции для управления раскрытием
  const toggleItems = (orderId: number) => {
    setExpandedItems((prev) => ({ ...prev, [orderId]: !prev[orderId] }))
  }

  const handleRefreshOrder = async (orderId: number) => {
    await refreshOrder(orderId)
    toast.success("Статус заказа обновлен")
  }

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 sm:p-6 md:p-10 border border-white/20 shadow-xl">
      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-10">
        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          История заказов
        </h2>
      </div>

      {/* Orders List */}
      <div className="space-y-4 sm:space-y-6">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
            <p className="text-sm sm:text-base text-gray-500 text-center mb-6 px-4">
              Когда вы сделаете первый заказ, он появится здесь
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white text-sm sm:text-base"
            >
              Перейти к покупкам
            </Button>
          </div>
        ) : (
          orders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon
            const isItemsExpanded = expandedItems[order.id] || false
            const isRefreshing = refreshingOrderId === order.id

            return (
              <Card key={order.id} className="shadow-lg border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                <CardHeader className="pb-3 sm:pb-4 px-3 sm:px-6 pt-3 sm:pt-6">
                  <div className="flex flex-col items-start justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base">
                      <StatusIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
                      <span className="truncate">Заказ #{order.orderNumber}</span>
                    </CardTitle>
                    <div className="flex xs:flex-row items-end xs:items-center gap-2 flex-shrink-0">
                      <Badge
                        className={`${status.color} text-white text-center hover:${status.color} text-xs px-2 py-1`}
                      >
                        {status.label}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefreshOrder(order.id)}
                        disabled={isRefreshing}
                        className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                      >
                        <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{formatDate(order.createdAt)}</p>
                </CardHeader>

                <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6 pb-3 sm:pb-6">
                  {/* Order Items */}
                  <div className="space-y-2 sm:space-y-3">
                    {order.items?.slice(0, isItemsExpanded ? undefined : 2).map((item, index) => {
                      const product = item.product as any
                      const media = product?.image as Media

                      return (
                        <div key={index} className="flex gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                          <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 overflow-hidden rounded-lg bg-white flex-shrink-0">
                            <Image
                              width={48}
                              height={48}
                              src={
                                media?.url ||
                                "/placeholder.svg?height=48&width=48&query=product-thumbnail" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg" ||
                                "/placeholder.svg"
                              }
                              alt={media?.alt || product?.title || "Товар"}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-xs sm:text-sm text-gray-900 truncate leading-tight">
                              {product?.title || "Товар"}
                            </h4>
                            <div className="flex justify-between items-center mt-0.5 sm:mt-1">
                              <span className="text-xs text-gray-500">
                                {item.quantity} × {item.price} ₽
                              </span>
                              <span className="font-semibold text-xs sm:text-sm text-emerald-600">
                                {(item.price || 0) * (item.quantity || 0)} ₽
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {order.items && order.items.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleItems(order.id)}
                        className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-xs sm:text-sm py-2"
                      >
                        {isItemsExpanded ? (
                          <>
                            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Скрыть товары
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Ещё товары ({order.items.length - 2})
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  {/* Delivery Address */}
                  {order.address && (
                    <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                      <div className="flex items-center gap-1 sm:gap-2 mb-1">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 flex-shrink-0" />
                        <h4 className="font-medium text-xs sm:text-sm text-gray-900">Адрес доставки:</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 leading-tight">{order.address}</p>
                    </div>
                  )}

                  {/* Order Total */}
                  <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center text-xs sm:text-sm mb-1">
                      <span>Товары:</span>
                      <span>{(order.totalAmount || 0) - (order.deliveryFee || 0)} ₽</span>
                    </div>
                    <div className="flex justify-between items-center text-xs sm:text-sm mb-2">
                      <span>Доставка:</span>
                      <span>{order.deliveryFee} ₽</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-sm sm:text-base">Итого:</span>
                        <span className="text-base sm:text-lg text-emerald-600">{order.totalAmount} ₽</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
