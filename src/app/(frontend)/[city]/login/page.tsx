// app/(frontend)/login/page.tsx
import type { Metadata } from "next"
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

export default function LoginPage() {
  return <LoginPageClient />
}
