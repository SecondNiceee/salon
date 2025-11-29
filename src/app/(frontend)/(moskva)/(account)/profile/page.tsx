import ProfileClientPage from "@/app/(frontend)/[city]/(account)/profile/profile-client"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Профиль — Академия Спа | Салон красоты",
  description: "Ваш профиль в салоне красоты Академия Спа: личные данные, история заказов, подписки на услуги",
  robots: {
    index: false, // ← не индексировать
    follow: false, // ← не переходить по ссылкам
  },
  // Убираем OG и Twitter — не нужно для приватной страницы
  openGraph: undefined,
  twitter: undefined,
}

const ProfilePage = () => {
  return <ProfileClientPage />
}

export default ProfilePage
