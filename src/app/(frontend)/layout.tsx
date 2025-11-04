import type React from "react"
import "./globals.css"
import AppInit from "@/components/app-init/app-init"
import { Header } from "@/components/header/header"
import { PopupProvider } from "@/components/popup/PopupProvider"
import "leaflet/dist/leaflet.css"
import { Toaster } from "sonner"
import { BottomNavigation } from "@/components/bottom-navigation/BottomNavigation"
import { Footer } from "@/components/footer/footer"
import { ContactWidget } from "@/components/contact-widget/contact-widget"
import { Poppins, Inter } from "next/font/google"
import { Metadata } from "next"

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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || 'https://grandbazarr.ru'),
  title: {
    default: "Курсы массажа и косметологии · Запись в спа · Подарочные сертификаты | ГрандБАЗАР",
    template: "%s | ГрандБАЗАР",
  },
  description:
    "Онлайн-курсы по массажу, косметологии и тату. Запись на спа-процедуры и покупка подарочных сертификатов. Профессиональные товары для мастеров красоты и ухода за собой.",
  keywords: [
    "курсы массажа",
    "обучение косметологии",
    "спа-салон запись онлайн",
    "подарочный сертификат спа",
    "курсы тату",
    "товары для косметологов",
    "обучение массажу онлайн",
    "спа услуги",
    "ГрандБАЗАР"
  ],
  authors: [{ name: "ГрандБАЗАР" }],
  creator: "ГрандБАЗАР",
  publisher: "ГрандБАЗАР",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: process.env.NEXT_PUBLIC_URL,
    siteName: "ГрандБАЗАР",
    title: "Курсы массажа и косметологии · Запись в спа · Подарочные сертификаты",
    description: "Онлайн-курсы, запись в спа и подарочные сертификаты для ценителей красоты и профессионалов индустрии.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ГрандБАЗАР — Курсы, спа и подарки",
    description: "Обучение, спа-услуги и подарочные сертификаты в одном месте.",
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


export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="ru" className={`${poppins.variable} ${inter.variable}`}>
      <head></head>
      <body className="min-h-screen bg-background">
        <PopupProvider>
          <AppInit />
            <Header />
            <main className="mx-auto min-h-[60vh]">
              {children}
              <BottomNavigation />
            </main>
            <Footer />
            <Toaster />
            <ContactWidget />
        </PopupProvider>
      </body>
    </html>
  )
}
