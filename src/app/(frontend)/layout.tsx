import type React from "react"
import "./globals.css"
import AppInit from "@/components/app-init/app-init"
import { PopupProvider } from "@/components/popup/PopupProvider"
import "leaflet/dist/leaflet.css"
import { Toaster } from "sonner"
import { Poppins, Inter } from "next/font/google"

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

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <AppInit />
    {
        children
    }
    </>
  )
}
