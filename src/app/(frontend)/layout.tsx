import type React from "react"
import "./globals.css"
import AppInit from "@/components/app-init/app-init"
import "leaflet/dist/leaflet.css"
import { SpeechProvider } from "@/components/accessibility/SpeachProdcider";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AppInit />
      <SpeechProvider>{children}</SpeechProvider>
    </>
  )
}
