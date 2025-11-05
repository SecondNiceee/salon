import GrandBazarClientApp from "./main-client-page"
import Script from "next/script"

// SEO: генерация метаданных для салона красоты
export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_URL
  return {
    title: "Академия Спа — Салон красоты и спа | Массаж, косметология, татуировки",
    description:
      "Профессиональный салон красоты с услугами массажа, спа, косметологии и татуировок. Онлайн-курсы по массажу и косметологии. Подарочные сертификаты. Запись онлайн!",
    keywords:
      "салон красоты, массаж, спа услуги, косметология, татуировки, курсы массажа, курсы косметологии, подарочный сертификат, Академия Спа",

    // Open Graph (для WhatsApp, Telegram, соцсетей)
    openGraph: {
      title: "Академия Спа — Салон красоты и спа",
      description: "Массаж, спа, косметология, татуировки и курсы. Запись онлайн!",
      url: siteUrl,
      siteName: "Академия Спа",
      locale: "ru_RU",
      type: "website",
    },

    // Twitter
    twitter: {
      card: "summary_large_image",
      title: "Академия Спа — Салон красоты",
      description: "Профессиональные услуги красоты и спа. Запись сейчас!",
    },

    // Canonical URL
    alternates: {
      canonical: siteUrl,
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
