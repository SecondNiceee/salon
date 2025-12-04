// app/[city]/catalog/page.tsx
import type { Metadata } from "next"
import CatalogClientPage from "./catalog-client-page"
import { getCityBySlug } from "@/actions/server/cities/getCities"
import { notFound } from "next/navigation"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)

  if (!city) {
    notFound()
  }

  const cityName = city.declensions.nominative
  const canonicalUrl = `${siteUrl}/${citySlug}/catalog`

  return {
    title: `Каталог услуг | Академия профессионального образования | Салон красоты ${cityName}`,
    description:
      `Полный каталог услуг салона красоты Академия профессионального образования в г. ${cityName}: массаж, спа, косметология, татуировки, подарочные сертификаты и курсы. Выбирайте и записывайтесь онлайн!`,
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
      "Академия профессионального образования",
      cityName,
      `салон красоты ${cityName}`,
      `массаж ${cityName}`,
    ],
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Каталог услуг | Академия профессионального образования | ${cityName}`,
      description: `Полный каталог услуг салона красоты в ${cityName}: массаж, спа, косметология, курсы и подарки.`,
      type: "website",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `Каталог услуг | Академия профессионального образования | ${cityName}`,
      description: `Полный каталог услуг в ${cityName}: выбирайте услуги красоты и записывайтесь онлайн.`,
    },
  }
}

// ✅ Structured data: CollectionPage для услуг салона (с учётом города)
async function CatalogSchema({ citySlug }: { citySlug: string }) {
  const city = await getCityBySlug(citySlug)
  if (!city) return null

  const canonicalUrl = `${siteUrl}/${citySlug}/catalog`
  const cityName = city.declensions.nominative

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Каталог услуг | Академия профессионального образования | ${cityName}`,
          description: `Полный каталог услуг салона красоты Академия профессионального образования в г. ${cityName}`,
          url: canonicalUrl,
          publisher: {
            "@type": "Organization",
            name: "Академия профессионального образования",
            url: siteUrl,
          },
          about: `Каталог услуг красоты в ${cityName}: массаж, спа, косметология, татуировки, подарочные сертификаты и курсы`,
        }),
      }}
    />
  )
}

export default async function CatalogPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)

  if (!city) {
    notFound()
  }

  return (
    <>
      <CatalogSchema citySlug={citySlug} />
      <CatalogClientPage />
    </>
  )
}