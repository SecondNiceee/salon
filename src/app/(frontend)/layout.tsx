import type React from "react"
import AppInit from "@/components/app-init/app-init"
import { SpeechProvider } from "@/components/accessibility/SpeachProdcider"
import { HistoryProvider } from "@/providers/history-provider"

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <HistoryProvider>
      <AppInit />
      <SpeechProvider>{children}</SpeechProvider>
    </HistoryProvider>
  )
}
