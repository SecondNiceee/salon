import { getCityBySlug } from "@/actions/server/cities/getCities"
import GrandBazarClientApp from "./main-client-page"
import Script from "next/script"
import { Metadata } from "next"

// SEO: генерация метаданных для салона красоты
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)

  if (!city) {
    return {
      title: "Город не найден",
      robots: { index: false, follow: false },
    }
  }

  const cityName = city.declensions.nominative
  const cityPrepositional = city.declensions.prepositional
  const citySuffix = city.seoTitle ? ` — ${city.seoTitle}` : ` — ${cityName}`

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://grandbazarr.ru"),
    title: {
      default: `Академия Спа — Салон красоты | Массаж, спа, косметология, татуировки, курсы в ${cityPrepositional}`,
      template: `%s`,
    },
    description:
      city.metaDescription ||
      `Салон красоты Академия Спа ${cityPrepositional}: профессиональный массаж, спа-услуги, косметология, татуировки. Онлайн-курсы по массажу и косметологии. Подарочные сертификаты. Запись онлайн!`,
    keywords: [
      "салон красоты",
      "массаж",
      "спа",
      "косметология",
      "татуировки",
      "курсы массажа",
      "обучение косметологии",
      "подарочный сертификат",
      "спа-услуги",
      "Академия Спа",
      cityName,
    ],
    authors: [{ name: "Академия Спа" }],
    creator: "Академия Спа",
    publisher: "Академия Спа",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: `${process.env.NEXT_PUBLIC_URL}/${citySlug}`,
      siteName: "Академия Спа",
      title: `Академия Спа — Салон красоты | Массаж, спа и косметология${citySuffix}`,
      description: `Профессиональный салон красоты ${cityPrepositional} с услугами массажа, спа, косметологии и онлайн-курсами. Запись онлайн!`,
    },
    twitter: {
      card: "summary_large_image",
      title: `Академия Спа — Салон красоты${citySuffix}`,
      description: `Массаж, спа-услуги, косметология и курсы ${cityPrepositional}. Запись онлайн!`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
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
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Академия Спа",
            url: siteUrl,
            description: "Салон красоты с услугами массажа, спа, косметологии и татуировок.",
          },
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Академия Спа",
            url: siteUrl,
            logo: `${siteUrl}/logo.svg`,
            sameAs: [
              // Добавь, если есть: ВК, Telegram, Instagram
              // "https://vk.com/grandbazar",
            ],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+74951234567", // ← замени на реальный номер
              contactType: "customer support",
              availableLanguage: "Russian",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BeautySalon",
            name: "Академия Спа",
            description: "Салон красоты с услугами массажа, спа, косметологии и онлайн-курсами.",
            url: siteUrl,
            // Если есть регионы обслуживания:
            areaServed: {
              "@type": "Place",
              name: "Россия",
            },
          },
        ])}
      </Script>
    </>
  )
}

export default GrandBazarApp
