import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { cookies } from "next/headers"
import { getUserFromCookie } from "@/utils/getUserFromCookie"

// POST - добавить товар в избранное
export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { productId } = await request.json()

    // Получаем пользователя из cookies
    const user = await getUserFromCookie()

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!productId) {
      return NextResponse.json({ error: "ID товара не указан" }, { status: 400 })
    }

    // Добавляем товар в избранное
    const favorite = await payload.create({
      collection: "favorites",
      user : user.id,
      data: {
        user: user.id,
        product: productId
      },
      select : {product : true},
      depth : 2,
      overrideAccess: true,
    })

    return NextResponse.json(
      {
        doc:favorite,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Ошибка добавления в избранное:", error)
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 })
  }
}
