"use client"

import { useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { useCartStore } from "@/entities/cart/cartStore"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import { useRouter } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import OrderItemMobile from "../order-item/OrderItemMobile"

export default function CartDrawer() {
  const router = useRouter()
  const { isOpen, toggle, items, totalCount, totalPrice, remove, clear, loadServer, increment, dicrement } =
    useCartStore()

  const { siteSettings } = useSiteSettings()

  useEffect(() => {
    loadServer().catch(() => {})
  }, [loadServer])

  const handleCheckout = () => {
    toggle() // Close cart
    router.push(routerConfig.checkout)
  }

  const deliveryFee = siteSettings?.orderSettings?.deliveryFee || 199

  return (
    <Dialog open={isOpen} onOpenChange={toggle}>
      <DialogContent className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-full">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Корзина</span>
            {totalCount > 0 && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">{totalCount}</span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col h-[70vh]">
          {/* Items */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">Ваша корзина пуста</p>
                <p className="text-gray-400 text-sm mt-1">Добавьте товары для оформления заказа</p>
              </div>
            ) : (
              items.map((it, id) => {
                return <OrderItemMobile item={it} key={id} />
              })
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
              {/* Total */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Товары ({totalCount})</span>
                  <span className="font-semibold">{totalPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Доставка</span>
                  <span>{deliveryFee} ₽</span>
                </div>
                <div className="border-t border-gray-200 mt-2 pt-2">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Итого</span>
                    <span className="text-green-600">{totalPrice + deliveryFee}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={clear}
                  className="flex-1 border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  Очистить
                </Button>
                <Button
                  onClick={handleCheckout}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold shadow-lg"
                >
                  Оформить заказ
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
