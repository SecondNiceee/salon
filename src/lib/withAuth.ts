import type React from "react"
// lib/withAuth.tsx
import { getPayload } from "payload"
import config from "@payload-config"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { routerConfig } from "@/config/router.config"

// Тип для Server Component (асинхронная функция, возвращающая JSX)
type ServerComponent = () => Promise<React.ReactNode>

/**
 * Обёртка для страниц, требующих авторизации
 * Added city parameter for proper redirect
 */
export function withAuth(WrappedComponent: ServerComponent, options: { role?: string; city?: string } = {}) {
  return async function AuthenticatedComponent() {
    const payload = await getPayload({ config })
    const headersList = await headers()
    const user = await payload.auth({ headers: headersList })

    const redirectPath = options.city ? routerConfig.getPath(options.city, "home") : routerConfig.home

    if (!user.user) {
      redirect(redirectPath)
    }

    if (options.role && user.user.role !== options.role) {
      redirect(redirectPath)
    }

    return await WrappedComponent()
  }
}
