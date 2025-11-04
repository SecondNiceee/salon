import { CartItem } from "../cartStore"

// Helper: map store items to payload body
export const toPayloadItems = (items: CartItem[]) => {
  return items.map((it) => ({
    product: it.product,
    quantity: it.quantity,
  }))
}
