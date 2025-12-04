"use client"

import type React from "react"
import useAuth from "@/hooks/useAuth"
import AccountSidebar from "./account-sidebar"

export default function AccountLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (loading || !user) {
    return (
      <main className="bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
          <div className="text-center mb-8">
            <div className="flex flex-col items-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent leading-tight">
                Академия профессионального образования аккаунт
              </h1>
              <div className="mt-3 h-1 w-40 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"></div>
            </div>
          </div>

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mb-4"></div>
              <p className="text-gray-600 text-lg">Загрузка профиля...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-gradient-to-br from-slate-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 bg-clip-text text-transparent leading-tight">
              Академия профессионального образования аккаунт
            </h1>
            <div className="mt-3 h-1 w-40 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-10">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3">
            <AccountSidebar />
          </aside>

          {/* Main content */}
          <section className="col-span-12 md:col-span-8 lg:col-span-9">{children}</section>
        </div>
      </div>
    </main>
  )
}
