import type React from "react"
import "../globals.css"
import AppInit from "@/components/app-init/app-init"
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

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
})

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
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
      title: "Город не найден",
      robots: { index: false, follow: false },
    }
  }

  const cityName = city.declensions.nominative
  const cityGenitive = city.declensions.genitive
  const cityPrepositional = city.declensions.prepositional
  const citySuffix = city.seoTitle ? ` — ${city.seoTitle}` : ` — ${cityName}`

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://grandbazarr.ru"),
    title: {
      default: `Массаж, спа, косметология, татуировки, курсы в ${cityPrepositional}`,
      template: `%s | Академия Спа`,
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

export default async function CityLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ city: string }>
}) {
  const { city: citySlug } = await params
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound()
  }

  return (
    <html lang="ru" className={`${poppins.variable} ${inter.variable}`}>
      <head></head>
      <body className="min-h-screen bg-background">
        <PopupProvider>
          <AppInit />
          <Header />
          <main className="mx-auto min-h-[60vh]">{children}</main>
          <BottomNavigation />
          <Footer />
          <Toaster />
          <ContactWidget />
        </PopupProvider>
      </body>
    </html>
  )
}
