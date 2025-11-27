// app/api/auth/register/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "../../../../payload.config"
import { emailRegex } from "@/constants/email-schema"
import { sendEmail } from "@/utils/sendEmail"
import { createEmail } from "@/utils/createEmail"

type RegisterBody = {
  email: string
  password: string
}

export async function POST(req: NextRequest) {
  try {
    // 1. Получаем тело запроса
    const body = (await req.json()) as RegisterBody
    const { email, password } = body

    // 2. Валидация входных данных
    if (!email || !password) {
      return NextResponse.json({ message: "Email и пароль обязательны" }, { status: 400 })
    }

    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Неверный формат email" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Пароль должен быть не менее 8 символов" }, { status: 400 })
    }

    // 3. Подключаем Payload
    const payload = await getPayload({ config })

    // 4. Проверяем, существует ли пользователь
    const existingUsers = await payload.find({
      collection: "users",
      where: {
        email: { equals: email },
      },
      limit: 1,
      showHiddenFields: true,
      req,
    })

    const candidate = existingUsers.docs[0]

    const DEFAULT_CITY = "moskva"

    if (candidate) {
      if (candidate._verified) {
        return NextResponse.json(
          { message: "Пользователь с таким email уже существует" },
          { status: 409 }, // 409 Conflict
        )
      } else {
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${DEFAULT_CITY}/verify?token=${candidate._verificationToken}`
        await sendEmail({
          message: createEmail({ mode: "verify", url, userEmail: candidate.email }).html,
          to: candidate.email,
        })
        return NextResponse.json({ message: "Подтвердите почту перед входом в аккаунт" }, { status: 200 })
      }
    }

    // 5. Создаём пользователя
    await payload.create({
      collection: "users",
      data: {
        email,
        password, // Payload сам хэширует
      },
      req,
    })

    // 6. Возвращаем успешный ответ

    return NextResponse.json({ message: "Подтвердите почту перед входом в аккаунт." }, { status: 200 })
  } catch (error: unknown) {
    // Логируем ошибку на сервере
    console.error("Ошибка при регистрации:", error)
    console.log("Ошибка" + error)
    // Если ошибка от Payload (например, валидация)
    if (error instanceof Error && "data" in error) {
      return NextResponse.json({ message: "Ошибка валидации данных" }, { status: 400 })
    }

    // Общая ошибка сервера
    return NextResponse.json({ message: "Не удалось зарегистрировать пользователя" }, { status: 500 })
  }
}
