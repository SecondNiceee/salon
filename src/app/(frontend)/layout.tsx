import type React from "react"
import "./globals.css"
import AppInit from "@/components/app-init/app-init"
import "leaflet/dist/leaflet.css"
import { SpeechProvider } from "@/components/accessibility/SpeachProdcider";
import { HistoryProvider } from "@/providers/history-provider";

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
    <HistoryProvider>
      <AppInit />
      <SpeechProvider>{children}</SpeechProvider>
    </HistoryProvider>
    </>
  )
}
