"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/entities/auth/authStore"
import { routerConfig } from "@/config/router.config"
import LoginSection from "@/components/auth/login/loginSection"
import RegisterSection from "@/components/auth/registration/registerSection"

export default function LoginPageClient() {
  const router = useRouter()
  const { user } = useAuthStore()
  const [mode, setMode] = useState<"login" | "register">("login")

  useEffect(() => {
    if (user) {
      router.push(routerConfig.profile)
    }
  }, [user, router])

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="bg-gray-50 pb-20">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-9 w-9 p-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{mode === "login" ? "Вход" : "Регистрация"}</h1>
        </div>
      </div>

      <div className="flex-1 bg-white">
        {mode === "login" ? (
          <LoginSection mode={mode} setMode={setMode} />
        ) : (
          <RegisterSection mode={mode} setMode={setMode} />
        )}
      </div>
    </div>
  )
}
