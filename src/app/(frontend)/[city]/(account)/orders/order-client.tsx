"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Package, Clock, CheckCircle, XCircle, RefreshCw, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import useAuth from "@/hooks/useAuth"
import type { Media } from "@/payload-types"
import { toast } from "sonner"
import { useOrdersStore } from "@/entities/orders/ordersStore"
import { formatDate } from "@/utils/formatData"
import { routerConfig } from "@/config/router.config"
import { replaceCityVariables, getCityDeclensions } from "@/utils/replaceCityVariables"
import { useCityStore } from "@/entities/city/cityStore"
import { useCity } from "@/lib/use-city"
import { fixPayloadUrl } from "@/utils/fixPayloadUrl"

const statusConfig = {
  pending: { label: "Подтвержден", color: "bg-green-500", icon: CheckCircle },
  waiting_call: { label: "Скоро позвоним", color: "bg-blue-500", icon: Clock },
  delivered: { label: "Доставлен", color: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Отменен", color: "bg-red-500", icon: XCircle },
}

export default function OrdersClientPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { orders, loading, error, loadOrders, clearOrders, refreshOrder, refreshingOrderId } = useOrdersStore()
  const [hideCancel, setHideCancel] = useState(true)
  const {city} = useCityStore();
  const citySlug = useCity();

  useEffect(() => {
    loadOrders()
  }, [user, clearOrders])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  const handleRefreshOrder = async (orderId: number) => {
    await refreshOrder(orderId)
    toast.success("Статус заказа обновлен")
  }

  const filteredOrders = hideCancel ? orders.filter((order) => order.status !== "cancelled") : orders

  if (loading) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 md:p-10 border border-white/20 shadow-xl">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-3 sm:p-6 md:p-10 border border-white/20 shadow-xl">
      <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-10">
        <div className="p-1.5 sm:p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full">
          <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Заказы
        </h2>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hideCancel}
            onChange={(e) => setHideCancel(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500 cursor-pointer"
          />
          <span className="text-sm sm:text-base text-gray-700 font-medium">Не показывать отмененные</span>
        </label>
      </div>

      {/* Orders List */}
      <div className="space-y-4 sm:space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
            <p className="text-sm sm:text-base text-gray-500 text-center mb-6 px-4">
              Когда вы сделаете первый заказ, он появится здесь
            </p>
            <Button
              onClick={() => router.push(`/${city}`)}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm sm:text-base"
            >
              Перейти к покупкам
            </Button>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon
            const isRefreshing = refreshingOrderId === order.id

            const product = order.product as any
            const media = product?.image as Media

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
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex gap-3 items-center">
                      {media?.url && (
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg bg-white flex-shrink-0">
                          <Image
                            width={80}
                            height={80}
                            src={fixPayloadUrl(media.url) || "/placeholder.svg"}
                            alt={media.alt || product?.title || "Услуга"}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-semibold text-base sm:text-lg text-gray-900">
                          {replaceCityVariables(product?.title || "Услуга", city?.declensions as any )}
                        </h3>
                        <Button
                          onClick={() => router.push(routerConfig.withCity(citySlug, `/product?id=${product?.id}`))}
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto text-xs sm:text-sm bg-white hover:bg-pink-50 border-pink-200 text-pink-600 hover:text-pink-700"
                        >
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Перейти на услугу
                        </Button>
                      </div>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Комментарий:</h4>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{order.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
