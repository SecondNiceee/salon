"use client"

import { usePathname } from "next/navigation"
import HeroSlider from "./hero-slider"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import { ImageLoader } from "./image-loader"

export default function ConditionalHeroSlider() {
  const pathname = usePathname()
  const isSettingsLoading = useSiteSettings((state) => state.isLoading)

  // Check if pathname is "/" or matches /[city] pattern (single segment with no additional paths)
  const isHomePage = pathname === "/"
  const pathSegments = pathname.split("/").filter(Boolean)
  const isCityPage = pathSegments.length === 1 // Only city slug, no other segments

  const shouldShowSlider = isHomePage || isCityPage

  if (!shouldShowSlider) {
    return null
  }

  if (isSettingsLoading) {
    return (
      <section className="relative max-w-7xl mx-auto px-4 md:py-4 py-2 w-full overflow-hidden">
        <ImageLoader />
      </section>
    )
  }

  return <HeroSlider />
}
