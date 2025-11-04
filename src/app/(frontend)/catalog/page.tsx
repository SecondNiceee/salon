// app/catalog/page.tsx
import type { Metadata } from "next";
import CatalogClientPage from './catalog-client-page';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const metadata:Metadata = {
  title: "Каталог товаров | ГрандБАЗАР",
  description: "Полный каталог товаров интернет-магазина ГрандБАЗАР: электроника, бытовая техника, товары для дома и дачи. Выбирайте категории и находите нужные товары легко!",
  keywords: [
    "каталог",
    "каталог товаров",
    "товары ГрандБАЗАР",
    "интернет-магазин каталог",
    "купить онлайн",
    "категории товаров"
  ],
  robots: {
    index: true,   // ← индексировать! Это публичная страница
    follow: true,  // ← переходить по ссылкам (на категории и товары)
  },
  alternates: {
    canonical: siteUrl ? `${siteUrl}/catalog` : undefined,
  },
  openGraph: {
    title: "Каталог товаров | ГрандБАЗАР",
    description: "Полный каталог товаров: выбирайте категории и находите нужные товары.",
    type: "website",
    url: siteUrl ? `${siteUrl}/catalog` : undefined,
  },
  twitter: {
    card: "summary_large_image",
    title: "Каталог товаров | ГрандБАЗАР",
    description: "Полный каталог товаров: выбирайте категории и находите нужные товары.",
  },
};

// ✅ Structured data: CollectionPage или WebPage
function CatalogSchema() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Каталог товаров | ГрандБАЗАР",
          "description": "Полный каталог товаров интернет-магазина ГрандБАЗАР",
          "url": `${siteUrl}/catalog` ,
          "publisher": {
            "@type": "Organization",
            "name": "ГрандБАЗАР",
            "url": siteUrl 
          },
          "about": "Каталог категорий и товаров"
        })
      }}
    />
  );
}

export default function CatalogPage() {
  return (
    <>
      <CatalogSchema />
      <CatalogClientPage />
    </>
  );
}
