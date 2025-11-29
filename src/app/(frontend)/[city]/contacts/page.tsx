// app/[city]/contacts/page.tsx
import { notFound } from "next/navigation"
import { getContacts } from "@/actions/server/pages/getContacts"
import { getCityBySlug } from "@/actions/server/cities/getCities"
import MemoRichText from "@/components/memo-rich-text/MemoRichText"

// ✅ Кэширование: 1 день
export const revalidate = 86400

// ✅ Schema.org для контактов с учётом города
async function ContactsSchema({
  citySlug,
  title,
  description,
}: {
  citySlug: string
  title: string
  description: string
}) {
  const city = await getCityBySlug(citySlug)
  if (!city) return null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://grandbazarr.ru"
  const cityName = city.declensions.nominative

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: title,
            url: `${siteUrl}/${citySlug}/contacts`,
            logo: `${siteUrl}/logo.svg`,
            description: description,
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "Customer Support",
              address: {
                "@type": "PostalAddress",
                addressLocality: cityName,
                addressCountry: "RU",
              },
              availableLanguage: ["Russian"],
            },
          },
          null,
          2,
        ),
      }}
    />
  )
}

export default async function ContactsPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)
  if (!city) notFound()

  const contacts = await getContacts()
  if (!contacts) notFound()

  const cityName = city.declensions.nominative

  const title = contacts.title
    ? `${contacts.title} | ГрандБАЗАР | Салон красоты ${cityName}`
    : `Контакты | ГрандБАЗАР | Салон красоты ${cityName}`

  const description =
    contacts.description ||
    `Свяжитесь с салоном красоты ГрандБАЗАР в г. ${cityName}: телефон, email, адрес и форма обратной связи!`

  return (
    <>
      <ContactsSchema citySlug={citySlug} title={title} description={description} />
      <div className="rich-container">
        <MemoRichText data={contacts.content} />
      </div>
    </>
  )
}

// ✅ Динамические метаданные с учётом города
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)
  if (!city) {
    return {
      title: "Город не найден",
      robots: { index: false, follow: false },
    }
  }

  const contactsData = await getContacts()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://grandbazarr.ru"
  const cityName = city.declensions.nominative
  const canonicalUrl = `${siteUrl}/${citySlug}/contacts`

  const title = contactsData?.title
    ? `${contactsData.title} | ГрандБАЗАР | Салон красоты ${cityName}`
    : `Контакты | ГрандБАЗАР | Салон красоты ${cityName}`

  const description =
    contactsData?.description ||
    `Свяжитесь с салоном красоты ГрандБАЗАР в г. ${cityName}: телефон, email, адрес и форма обратной связи!`

  return {
    title,
    description,
    keywords: [
      "контакты",
      "связаться с нами",
      "телефон",
      "email",
      "адрес салона",
      "ГрандБАЗАР",
      "поддержка",
      "обратная связь",
      cityName,
      `контакты ${cityName}`,
      `салон красоты ${cityName}`,
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}