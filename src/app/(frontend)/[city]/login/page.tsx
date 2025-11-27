// app/(frontend)/login/page.tsx
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import LoginPageClient from "./login-client-page"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  title: "Вход в аккаунт | Академия Спа | Салон красоты",
  description:
    "Войдите в личный кабинет салона красоты Академия Спа, чтобы управлять заказами услуг и забронированными процедурами.",

  robots: {
    index: false,
    follow: false,
  },

  verification: {
    google: "",
  },

  openGraph: {
    title: "Вход в аккаунт | Академия Спа",
    description: "Войдите в личный кабинет салона красоты Академия Спа",
    type: "website",
    url: siteUrl ? `${siteUrl}/login` : undefined,
  },

  // Canonical — защита от дублей
  alternates: {
    canonical: siteUrl ? `${siteUrl}/login` : undefined,
  },
}

export default async function LoginPage() {
  const cookieStore = await cookies()
  const payloadToken = cookieStore.get("payload-token")

  // Если есть токен, проверяем авторизацию
  if (payloadToken) {
    try {
      const response = await fetch(`${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/me`, {
        method: "GET",
        headers: {
          Cookie: `payload-token=${payloadToken.value}`,
        },
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        // Если пользователь авторизован - редиректим на главную
        if (data.user) {
          redirect(routerConfig.home)
        }
      }
    } catch (e) {
      // Ошибка - продолжаем показывать страницу логина
      console.log("[v0] Login page auth check error:", e)
    }
  }

  return <LoginPageClient />
}
