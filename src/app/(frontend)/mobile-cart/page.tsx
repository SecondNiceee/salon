// app/cart/page.tsx
import MobileCartClientPage from "./mobile-client-page";

export const metadata = {
  title: "Корзина | ГрандБАЗАР",
  description: "Ваша корзина покупок в интернет-магазине ГрандБАЗАР. Добавьте товары, проверьте состав заказа и оформите покупку онлайн.",
  keywords: [
    "корзина",
    "оформить заказ",
    "мои товары",
    "интернет-магазин корзина",
    "ГрандБАЗАР корзина"
  ],
  robots: {
    index: false,   // ← не индексировать (правильно!)
    follow: true,   // ← но можно переходить по ссылкам (на товары, главную и т.д.)
  },
  // Open Graph — для случаев, если пользователь скопирует ссылку (редко, но бывает)
  openGraph: {
    title: "Корзина | ГрандБАЗАР",
    description: "Проверьте состав заказа и оформите покупку в интернет-магазине ГрандБАЗАР.",
    type: "website",
    url: `${process.env.NEXT_PUBLIC_URL}/mobile-cart`
  },
  // Защита от дублей
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_URL}/mobile-cart`
  },
};

export default function CartPage() {
  return <MobileCartClientPage />;
}
