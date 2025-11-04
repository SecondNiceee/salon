import { CartItem } from "../cartStore"

// Вспомогательная функция для подсчета общей цены и количества товаров
export const calcTotal = (items: CartItem[]) => {
  const totalCount = items.reduce((acc, it) => acc + it.quantity, 0)
  const totalPrice = items.reduce((acc, it) => acc + (it.product.price || 0) * it.quantity, 0)
  return { totalCount, totalPrice }
}
