import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { productId } = await request.json()

    // Получаем пользователя из cookies
    const { user } = await payload.auth({ headers: request.headers })

    if (!user) {
      return NextResponse.json({ error: "Необходимо войти в систему" }, { status: 401 })
    }

    if (!productId) {
      return NextResponse.json({ error: "ID товара не указан" }, { status: 400 })
    }

    // так как в схеме Orders поле product - это обычный relationship, а не массив items
    const orders = await payload.find({
      collection: "orders",
      where: {
        and: [{ user: { equals: user.id } }, { product: { equals: productId } }],
      },
      limit: 1,
      overrideAccess: true,
    })

    const hasPurchased = orders.docs.length > 0

    return NextResponse.json({
      hasPurchased,
      message: hasPurchased ? "Товар был приобретен" : "Товар не был приобретен",
    })
  } catch (error) {
    console.error("Ошибка проверки покупки:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
