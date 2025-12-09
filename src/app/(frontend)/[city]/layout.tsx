import type React from "react"
import "../globals.css"
import { Header } from "@/components/header/header"
import { PopupProvider } from "@/components/popup/PopupProvider"
import "leaflet/dist/leaflet.css"
import { Toaster } from "sonner"
import { BottomNavigation } from "@/components/bottom-navigation/BottomNavigation"
import { Footer } from "@/components/footer/footer"
import { ContactWidget } from "@/components/contact-widget/contact-widget"
import { Poppins, Inter } from "next/font/google"
import type { Metadata } from "next"
import { getCityBySlug } from "@/actions/server/cities/getCities"
import { notFound } from "next/navigation"
import Script from "next/script"
import { CityInit } from "@/components/city-init/CityInit"

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
  preload: true,
})

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)

  if (!city) {
    return {
      title: `Курсы косметологии и массажа в Москве | Спа и косметология`,
      robots: { index: false, follow: false },
    }
  }

  const cityName = city.declensions.nominative
  const cityPrepositional = city.declensions.prepositional
  const currentUrl = `${process.env.NEXT_PUBLIC_URL}/${citySlug}`

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://grandbazarr.ru"),
    title: {
      default: `Курсы косметологии и массажа ${cityPrepositional} | Спа и косметология`,
      template: `%s | Академия профессионального образования ${cityName}`,
    },
    description:
      city.metaDescription ||
      `Салон красоты Академия профессионального образования ${cityPrepositional}: профессиональный массаж, спа-услуги, косметология, татуировки. Онлайн-курсы по массажу и косметологии. Подарочные сертификаты. Запись онлайн!`,
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
      "Академия профессионального образования",
      cityName,
      `салон красоты ${cityName}`,
      `массаж ${cityName}`,
      `спа ${cityName}`,
      `косметология ${cityName}`,
    ],
    authors: [{ name: "Академия профессионального образования" }],
    creator: "Академия профессионального образования",
    publisher: "Академия профессионального образования",
    alternates: {
      canonical: currentUrl,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: currentUrl,
      siteName: "Академия профессионального образования",
      title: `Курсы косметологии и массажа ${cityPrepositional} | Спа и косметология`,
      description: `Профессиональный салон красоты ${cityPrepositional} с услугами массажа, спа, косметологии и онлайн-курсами. Запись онлайн!`,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL}/api/media/file/face-massage.png`,
          width: 630,
          height: 630,
          alt: `Академия профессионального образования ${cityName}. Записаться на массаж, спа и косметологию ${cityPrepositional}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Курсы косметологии и массажа ${cityPrepositional} | Спа и косметология`,
      description: `Массаж, спа-услуги, косметология и курсы ${cityPrepositional}. Запись онлайн!`,
      images: [`${process.env.NEXT_PUBLIC_URL}/api/media/file/face-massage.png`],
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

export default async function CityLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug)

  if (!city) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_URL
  const cityName = city.declensions.nominative

  return (
    <html lang="ru" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            ym(49347352, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true
            });
          `}
        </Script>
        <Script id="city-json-ld" type="application/ld+json">
          {JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Академия профессионального образования",
              url: siteUrl,
              description: "Салон красоты с услугами массажа, спа, косметологии и татуировок.",
            },
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Академия профессионального образования",
              url: siteUrl,
              logo: `${siteUrl}/logo-icon.png`,
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: "Russian",
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BeautySalon",
              name: `Академия профессионального образования - ${cityName}`,
              description: `Салон красоты в г. ${cityName} с услугами массажа, спа, косметологии и онлайн-курсами.`,
              url: `${siteUrl}/${citySlug}`,
              areaServed: {
                "@type": "City",
                name: cityName,
              },
              address: {
                "@type": "PostalAddress",
                addressLocality: cityName,
                addressCountry: "RU",
              },
            },
          ])}
        </Script>
      </head>
      <body className="min-h-screen bg-background">
        <PopupProvider>
          <Header />
          <CityInit city={city} />
          <main className="mx-auto min-h-[60vh]">{children}</main>
          <BottomNavigation />
          <Footer city={city} />
          <Toaster />
          <ContactWidget />
        </PopupProvider>
      </body>
    </html>
  )
}
