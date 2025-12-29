import type React from "react"
import type { Metadata, Viewport } from "next"
import { Poppins, Inter } from "next/font/google"
import "./(frontend)/globals.css"

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

export const metadata: Metadata = {
  title: "Академия профессионального образования",
  description: "Курсы косметологии и массажа",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={`${poppins.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://kesijuhidipret.begetcdn.cloud" />
      </head>
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  )
}
