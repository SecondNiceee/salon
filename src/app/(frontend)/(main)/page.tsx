// src/app/(main)/page.tsx
import React from 'react';
import GrandBazarClientApp from './main-client-page';
import Script from 'next/script';


// SEO: генерация метаданных для продуктового магазина
export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_URL
  return {
    title: 'ГрандБАЗАР — Интернет-магазин продуктов с доставкой на дом',
    description:
      'Свежие овощи, фрукты, молочка, мясо, выпечка и всё для дома — с доставкой в день заказа! Низкие цены, акции, гарантия качества. Закажите онлайн в ГрандБАЗАР!',
    keywords:
      'купить продукты онлайн, доставка продуктов, интернет-магазин продуктов, свежие овощи, молочные продукты, мясо, хлеб, ГрандБАЗАР, продукты с доставкой',

    // Open Graph (для WhatsApp, Telegram, соцсетей)
    openGraph: {
      title: 'ГрандБАЗАР — Продукты с доставкой на дом',
      description: 'Свежие продукты каждый день. Быстро, удобно, по выгодным ценам!',
      url: siteUrl,
      siteName: 'ГрандБАЗАР',
      locale: 'ru_RU',
      type: 'website',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: 'ГрандБАЗАР — Продукты онлайн',
      description: 'Свежие продукты с доставкой в день заказа. Закажите сейчас!',
    },

    // Canonical URL
    alternates: {
      canonical: siteUrl,
    },
  };
}

const GrandBazarApp = () => {
  const siteUrl = process.env.NEXT_PUBLIC_URL

  return (
    <>
      <GrandBazarClientApp />

      {/* JSON-LD: WebSite + Organization (для Google) */}
      <Script id="home-json-ld" type="application/ld+json">
        {JSON.stringify([
          {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'ГрандБАЗАР',
            url: siteUrl,
            description: 'Интернет-магазин свежих продуктов с доставкой на дом.',
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'ГрандБАЗАР',
            url: siteUrl,
            logo: `${siteUrl}/logo.svg`,
            sameAs: [
              // Добавь, если есть: ВК, Telegram, Instagram
              // "https://vk.com/grandbazar",
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+74951234567', // ← замени на реальный номер
              contactType: 'customer support',
              availableLanguage: 'Russian',
            },
          },
          {
            '@context': 'https://schema.org',
            '@type': 'Store',
            name: 'ГрандБАЗАР',
            description: 'Онлайн-магазин продуктов питания с доставкой.',
            url: siteUrl,
            // Если есть регионы доставки:
            areaServed: {
              '@type': 'Place',
              name: 'Россия',
            },
          },
        ])}
      </Script>
    </>
  );
};

export default GrandBazarApp;
