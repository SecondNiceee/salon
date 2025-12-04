// app/(frontend)/forgotPassword/page.tsx
import type { Metadata } from "next"
import ForgotPasswordClientPage from "./forgotPasswordClient"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  title: "Восстановление пароля | Академия профессионального образования | Салон красоты",
  description:
    "Сбросьте пароль от личного кабинета салона красоты Академия профессионального образования. Введите email и получите ссылку для восстановления.",
  keywords: ["восстановить пароль", "забыл пароль", "сброс пароля", "Академия профессионального образования", "вход в аккаунт"],

  robots: {
    index: false,
    follow: false,
  },

  openGraph: {
    title: "Восстановление пароля | Академия профессионального образования",
    description: "Страница восстановления доступа к аккаунту в салоне красоты Академия профессионального образования",
    url: siteUrl ? `${siteUrl}/forgotPassword` : undefined,
    type: "website",
    locale: "ru_RU",
    siteName: "Академия профессионального образования",
  },

  twitter: {
    card: "summary_large_image",
    title: "Восстановление пароля | Академия профессионального образования",
    description: "Страница сброса пароля в салоне красоты Академия профессионального образования",
  },

}

export default function ForgotPasswordPage() {
  return <ForgotPasswordClientPage />
}
