"use client"

import { useEffect, useRef } from "react"
import { useCategoriesStore } from "@/entities/categories/categoriesStore"
import { useAuthStore } from "@/entities/auth/authStore"
import { useFavoritesStore } from "@/entities/favorites/favoritesStore"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"

/**
 * AppInit runs once on the client to bootstrap session, cart, and other app data.
 * It renders nothing.
 */
export default function AppInit() {
  const didBoot = useRef(false)
  const fetchMe = useAuthStore((s) => s.fetchMe)
  const getCategories = useCategoriesStore((s) => s.getCategories)
  const loadFavoritiesIds = useFavoritesStore((s) => s.loadFavoritiesIds)
  const loadSiteSettings = useSiteSettings((s) => s.getSiteSettings)

  useEffect(() => {
    if (didBoot.current) return
    didBoot.current = true
    ;(async () => {
      try {
        // 1) Fetch current user session
        await fetchMe()
      } catch {}


      try {
        // 3) Prefetch categories (optional, improves UX of header/catalog)
        await getCategories()
      } catch {}

      try {
        await loadFavoritiesIds()
      } catch (e) {
        console.log(e)
      }

      try {
        await loadSiteSettings()
      } catch {}
    })()
  }, [fetchMe, getCategories])

  return null
}
