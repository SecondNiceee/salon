// app/catalog/page.tsx
import type { Metadata } from "next"
import CatalogClientPage from "./catalog-client-page"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export const metadata: Metadata = {
  title: "Каталог услуг | Академия Спа | Салон красоты",
  description:
    "Полный каталог услуг салона красоты Академия Спа: массаж, спа, косметология, татуировки, подарочные сертификаты и курсы. Выбирайте и записывайтесь онлайн!",
  keywords: [
    "каталог услуг",
    "услуги красоты",
    "салон красоты",
    "массаж",
    "спа услуги",
    "косметология",
    "татуировки",
    "подарочный сертификат",
    "курсы массажа",
    "Академия Спа",
  ],
  robots: {
    index: true, // ← индексировать! Это публичная страница
    follow: true, // ← переходить по ссылкам (на категории и услуги)
  },
  alternates: {
    canonical: siteUrl ? `${siteUrl}/catalog` : undefined,
  },
  openGraph: {
    title: "Каталог услуг | Академия Спа",
    description: "Полный каталог услуг салона красоты: массаж, спа, косметология, курсы и подарки.",
    type: "website",
    url: siteUrl ? `${siteUrl}/catalog` : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог услуг | Академия Спа",
    description: "Полный каталог услуг: выбирайте услуги красоты и записывайтесь онлайн.",
  },
}

// ✅ Structured data: CollectionPage для услуг салона
function CatalogSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Каталог услуг | Академия Спа",
          description: "Полный каталог услуг салона красоты Академия Спа",
          url: `${siteUrl}/catalog`,
          publisher: {
            "@type": "Organization",
            name: "Академия Спа",
            url: siteUrl,
          },
          about: "Каталог услуг красоты: массаж, спа, косметология, татуировки, подарочные сертификаты и курсы",
        }),
      }}
    />
  )
}

export default function CatalogPage() {
  return (
    <>
      <CatalogSchema />
      <CatalogClientPage />
    </>
  )
}
