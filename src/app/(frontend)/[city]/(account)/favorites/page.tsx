import FavoritesClientPage from "./favorites-client"
import type { Metadata } from "next"

// 🔒 Запрещаем индексацию — это приватная страница
export const metadata: Metadata = {
  title: "Избранное — Академия Спа | Салон красоты",
  description: "Ваши сохранённые услуги и курсы в салоне красоты Академия Спа",
  robots: {
    index: false, // ← не индексировать
    follow: false, // ← не следовать по ссылкам
  },
  // Убираем соцсетевые метатеги — не нужно для личной страницы
  openGraph: undefined,
  twitter: undefined,
}

const Favorites = () => {
  return <FavoritesClientPage />
}

export default Favorites
