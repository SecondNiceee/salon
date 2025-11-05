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
import type { Metadata } from "next"

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL || "https://grandbazarr.ru"),
  title: {
    default: "Академия Спа — Салон красоты | Массаж, спа, косметология, татуировки, курсы",
    template: "%s | Академия Спа",
  },
  description:
    "Салон красоты Академия Спа: профессиональный массаж, спа-услуги, косметология, татуировки. Онлайн-курсы по массажу и косметологии. Подарочные сертификаты. Запись онлайн!",
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
    url: process.env.NEXT_PUBLIC_URL,
    siteName: "Академия Спа",
    title: "Академия Спа — Салон красоты | Массаж, спа и косметология",
    description:
      "Профессиональный салон красоты с услугами массажа, спа, косметологии и онлайн-курсами. Запись онлайн!",
  },
  twitter: {
    card: "summary_large_image",
    title: "Академия Спа — Салон красоты",
    description: "Массаж, спа-услуги, косметология и курсы. Запись онлайн!",
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
