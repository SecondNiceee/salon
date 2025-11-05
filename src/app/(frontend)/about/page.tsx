import { RichText } from "@payloadcms/richtext-lexical/react"
import { notFound } from "next/navigation"
import { getAbout } from "@/actions/server/pages/getAbout"
import jsxConverters from "@/utils/jsx-converters"
import "@/styles/richText.scss"
import Script from "next/script"

export const revalidate = 86400

export default async function AboutPage() {
  try {
    const about = await getAbout()
    if (!about) {
      notFound()
    }
    const siteUrl = process.env.NEXT_PUBLIC_URL
    return (
      <>
        <div className="rich-container">
          <RichText converters={jsxConverters} data={about.content} />
        </div>

        {/* JSON-LD для SEO */}
        <Script id="about-json-ld" type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Академия Спа",
            url: siteUrl,
            description:
              about.description ||
              "Академия Спа — салон красоты с профессиональными услугами массажа, спа, косметологии и курсами.",
            address: {
              "@type": "PostalAddress",
              addressCountry: "RU",
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              telephone: "+74951234567", // ← замени на реальный номер
              availableLanguage: "Russian",
            },
          })}
        </Script>
      </>
    )
  } catch (error) {
    console.error("Error loading about page:", error)
    notFound()
  }
}

// Генерация метаданных с использованием NEXT_PUBLIC_URL
export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_URL
  const aboutPageUrl = `${siteUrl}/about`

  try {
    const aboutData = await getAbout()

    const title = aboutData?.title || "О нас — Академия Спа | Салон красоты"
    const description =
      aboutData?.description ||
      "О салоне красоты Академия Спа: история, услуги, миссия. Профессиональный массаж, спа, косметология и татуировки."

    return {
      title,
      description,
      keywords: "Академия Спа, салон красоты, массаж, спа, косметология, о нас, история салона",

      openGraph: {
        title,
        description,
        url: aboutPageUrl,
        siteName: "Академия Спа",
        locale: "ru_RU",
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title,
        description,
      },

      alternates: {
        canonical: aboutPageUrl,
      },
    }
  } catch (error) {
    // Fallback
    return {
      title: "О нас — Академия Спа",
      description: "О салоне красоты Академия Спа: услуги, миссия и ценности.",
      openGraph: {
        title: "О нас — Академия Спа",
        description: "О салоне красоты Академия Спа: услуги, миссия и ценности.",
        url: aboutPageUrl,
        siteName: "Академия Спа",
        locale: "ru_RU",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "О нас — Академия Спа",
        description: "О салоне красоты Академия Спа: услуги, миссия и ценности.",
      },
    }
  }
}
