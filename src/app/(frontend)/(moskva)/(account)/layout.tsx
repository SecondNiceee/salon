// src/app/(frontend)/(moskva)/(account)/layout.tsx
import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import type { Metadata } from "next"
import AccountLayoutClient from "../../[city]/(account)/account-layout-client"

// 🔒 Запрещаем индексацию этой страницы
export const metadata: Metadata = {
  title: "Личный кабинет — Академия Спа | Салон красоты",
  description:
    "Ваш личный кабинет в салоне красоты Академия Спа: история покупок, подписки на курсы, забронированные услуги",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: undefined,
  twitter: undefined,
}

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const payloadToken = cookieStore.get("payload-token")

  try {
    const apiUrl = `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/api/users/me`

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Cookie: payloadToken ? `payload-token=${payloadToken.value}` : "",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      redirect(routerConfig.home)
    }

    const data = await response.json()

    if (!data.user) {
      redirect(routerConfig.home)
    }
  } catch (e) {
    redirect(routerConfig.home)
  }

  return <AccountLayoutClient>{children}</AccountLayoutClient>
}
