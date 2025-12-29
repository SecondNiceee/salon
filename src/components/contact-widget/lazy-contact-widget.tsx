"use client"

import dynamic from "next/dynamic"

const ContactWidget = dynamic(() => import("./contact-widget").then((mod) => ({ default: mod.ContactWidget })), {
  ssr: false,
})

export function LazyContactWidget() {
  return <ContactWidget />
}
