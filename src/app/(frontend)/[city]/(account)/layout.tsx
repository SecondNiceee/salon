// src/app/(frontend)/[city]/(account)/layout.tsx
import type React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import AccountLayoutClient from "./account-layout-client"
import type { Metadata } from "next"

// 🔒 Запрещаем индексацию этой страницы
export const metadata: Metadata = {
  title: "Личный кабинет — Академия профессионального образования | Салон красоты",
  description:
    "Ваш личный кабинет в салоне красоты Академия профессионального образования: история покупок, подписки на курсы, забронированные услуги",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: undefined,
  twitter: undefined,
}

export default async function AccountLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ city: string }>
}) {
  const { city } = await params
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
      redirect(routerConfig.getPath(city, "home"))
    }

    const data = await response.json()

    if (!data.user) {
      redirect(routerConfig.getPath(city, "home"))
    }
  } catch (e) {
    redirect(routerConfig.getPath(city, "home"))
  }

  return <AccountLayoutClient>{children}</AccountLayoutClient>
}
