import type React from "react"
import { Categories } from "@/components/categories/categories"

export default async function MainLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div>
      <div className="z-50 flex flex-col">
        <Categories />
      </div>
      {children}
    </div>
  )
}
