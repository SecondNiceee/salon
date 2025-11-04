interface OrderData {
  orderNumber: string
  user?:
    | {
        email?: string
      }
    | string
  customerPhone: string
  items?: Array<{
    product?:
      | {
          title?: string
        }
      | string
    quantity: number
    price: number
  }>
  address?: string
  totalAmount: number
  deliveryFee: number
  notes?: string
  adminOrderUrl?: string
}

const escapeHtml = (text: string | null | undefined): string => {
  if (!text) return ""
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

export function formatOrderMessage(data: OrderData): string {
  // Форматируем список товаров
  const itemsText =
    data.items && data.items.length > 0
      ? data.items
          .map((item) => {
            const productTitle = typeof item.product === "string" ? item.product : item.product?.title || "Без названия"
            return `- ${escapeHtml(productTitle)} ×${item.quantity} (${item.price}₽)`
          })
          .join("\n")
      : "Нет товаров"

  const deliveryAddressText = data.address ? escapeHtml(data.address) : "Не указан"

  // 👇 Формируем блок "Ссылка на админку" с проверкой на http(s)
  let adminLink = ""
  if (data.adminOrderUrl) {
    const url = data.adminOrderUrl
    if (url.includes("https://")) {
      // Это полный URL — делаем ссылку
      adminLink = `\n<b>🔗 Ссылка на админку:</b> <a href="${escapeHtml(url)}">${url}</a>`
    } else {
      // Это не URL — выводим как обычный текст
      adminLink = `\n<b>🔗 Ссылка на админку:</b> ${url}`
    }
  }

  return `<b>🛒 Новый заказ!</b>

<b>📋 Номер заказа:</b> ${escapeHtml(data.orderNumber)}
<b>📞 Телефон:</b> ${escapeHtml(data.customerPhone)}

<b>📦 Товары:</b>
${itemsText}

<b>📍 Адрес доставки:</b> ${deliveryAddressText}

<b>💰 Сумма заказа:</b> ${data.totalAmount - data.deliveryFee}₽
<b>🚚 Доставка:</b> ${data.deliveryFee}₽
<b>💳 Итого:</b> ${data.totalAmount}₽${data.notes ? `\n<b>📝 Примечания:</b> ${escapeHtml(data.notes)}` : ""}

<b>🕐 Время заказа:</b> ${escapeHtml(new Date().toLocaleString("ru-RU"))}${adminLink}`
}
