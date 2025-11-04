// app/(frontend)/forgotPassword/page.tsx
import type { Metadata } from "next"
import ForgotPasswordClientPage from "./forgotPasswordClient"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  title: "Восстановление пароля | ГрандБАЗАР",
  description: "Сбросьте пароль от личного кабинета в интернет-магазине ГрандБАЗАР. Введите email, и мы вышлем ссылку для восстановления доступа.",
  keywords: ["восстановить пароль", "забыл пароль", "сброс пароля", "ГрандБАЗАР", "вход в аккаунт"],

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Восстановление пароля | ГрандБАЗАР",
    description: "Страница восстановления доступа к аккаунту в ГрандБАЗАР",
    url: siteUrl ? `${siteUrl}/forgotPassword` : undefined,
    type: "website",
    locale: "ru_RU",
    siteName: "ГрандБАЗАР",

  },

  twitter: {
    card: "summary_large_image",
    title: "Восстановление пароля | ГрандБАЗАР",
    description: "Страница сброса пароля в ГрандБАЗАР",
  },

  alternates: {
    canonical: siteUrl ? `${siteUrl}/forgotPassword` : undefined,
  },
}

export default function ForgotPasswordPage() {
  return <ForgotPasswordClientPage />
}
