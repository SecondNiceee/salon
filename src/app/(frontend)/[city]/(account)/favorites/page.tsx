import { getCityBySlug } from "@/actions/server/cities/getCities"
import FavoritesClientPage from "./favorites-client"
import type { Metadata } from "next"

// 🔒 Запрещаем индексацию — это приватная страница
export const metadata: Metadata = {
  title: "Избранное — Академия профессионального образования | Салон красоты",
  description: "Ваши сохранённые услуги и курсы в салоне красоты Академия профессионального образования",
  robots: {
    index: false, // ← не индексировать
    follow: false, // ← не следовать по ссылкам
  },
  // Убираем соцсетевые метатеги — не нужно для личной страницы
  openGraph: undefined,
  twitter: undefined,
}

type Props = {
  params: Promise<{ city: string }>
}
const Favorites = async ({ params }: Props) => {
  const {city : citySlug} = await params;
  const city = await getCityBySlug(citySlug);
  return <FavoritesClientPage city={city} />
}

export default Favorites
