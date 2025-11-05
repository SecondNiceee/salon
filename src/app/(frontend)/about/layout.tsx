import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "О нас - Академия Спа | Салон красоты",
  description: "О салоне красоты Академия Спа: профессиональные услуги, история и ценности",
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
