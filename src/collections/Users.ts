import { isAdmin } from "@/utils/accessUtils"
import { createEmail } from "@/utils/createEmail"
import type { CollectionConfig, PayloadRequest } from "payload"

const DEFAULT_CITY = "moskva"

export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    group: "Пользователи",
  },
  defaultPopulate: {
    email: true,
    id: true,
  },
  access: {
    create: () => false,
    admin: ({ req: { user } }) => {
      return Boolean(user?.role === "admin" || user?.role === "manager")
    },
    read: () => true,
    delete: isAdmin,
    update: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === "admin") return true
      return {
        id: {
          equals: req.user.id,
        },
      }
    },
  },
  auth: {
    forgotPassword: {
      expiration: 1000 * 60 * 20,
      generateEmailHTML: (args) => {
        const typedArgs = args as {
          req?: PayloadRequest | undefined
          token?: string
          user?: any
        }
        const { token, user } = typedArgs
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${DEFAULT_CITY}/forgotPassword?token=${token}`
        return createEmail({ mode: "forgetPassword", url, userEmail: user.email }).html
      },
    },
    tokenExpiration: Number(process.env.AUTH_TOKEN_EXPIRATION) || 60 * 60 * 24 * 7, // 7 дней в секундах
    verify: {
      generateEmailHTML: ({ token, user }) => {
        const url = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/${DEFAULT_CITY}/verify?token=${token}`
        return createEmail({ mode: "verify", url: url, userEmail: user?.email }).html
      },
    },
    maxLoginAttempts: 5,
    lockTime: 6000,
    cookies: {
      sameSite: "Lax",
      secure: false,
      domain: process.env.DOMAIN,
    },
  },
  hooks: {},
  fields: [
    // Email added by default
    {
      name: "name",
      type: "text",
      label: "Имя пользователя",
      required: false,
    },
    {
      name: "phone",
      type: "text",
      label: "Phone",
      required: false,
      admin: {
        description: "Phone number for delivery contact",
      },
      validate: (value: string | string[] | null | undefined) => {
        if (!value) return true // null, undefined, пустая строка — ок (по твоей логике)

        // Если это массив — можно отклонить или взять первый элемент — зависит от контекста
        // Допустим, мы ожидаем строку, а не массив
        if (Array.isArray(value)) {
          // console.log("Error here")
          return "Телефон должен быть строкой, а не массивом"
        }

        // Теперь TypeScript знает, что value — string
        const phoneRegex = /^8\d{10}$/
        console.log(value)
        if (!phoneRegex.test(value)) {
          console.log("Error here")
          return "Invalid phone format. Use format: +7 (XXX) XXX-XX-XX"
        }

        return true
      },
    },
    {
      name: "role",
      type: "select",
      options: [
        { label: "Admin", value: "admin" },
        { label: "User", value: "user" },
        { label: "Manager", value: "manager" },
      ],
      defaultValue: "user",
      access: {
        read: () => true,
        create: () => false,
        update: ({ req: { user } }) => user?.role === "admin",
      },
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "accessCollections",
      type: "select",
      hasMany: true,
      defaultValue: [],
      options: [
        { label: "Пользователи", value: "users" },
        { label: "Категории", value: "categories" },
        { label: "Товары", value: "products" },
        { label: "Медиа", value: "media" },
        { label: "Заказы", value: "orders" },
        { label: "Отзывы", value: "reviews" },
        { label: "Страницы", value: "pages" },
      ],
      access: {
        read: () => true,
        create: ({ req: { user } }) => user?.role === "admin",
        update: ({ req: { user } }) => user?.role === "admin",
      },
      admin: {
        position: "sidebar",
        description:
          "Выберите коллекции, к которым пользователь будет иметь доступ. Если не выбрано ничего, доступ ко всем коллекциям (только для админов).",
        condition: (data, siblingData) => {
          return siblingData?.role === "manager"
        },
      },
    },
  ],
}
