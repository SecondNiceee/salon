// app/(frontend)/forgot-password/ForgotPasswordClientPage.tsx
"use client"

import { useSearchParams } from "next/navigation"
import PasswordResetRequest from "@/components/auth/password-reset-page/password-reset-request"
import PasswordResetForm from "@/components/auth/password-reset-page/password-reset-form"

export default function ForgotPasswordClientPage() {
  const params = useSearchParams()
  const token = params?.get("token")

  return (
    <main className="min-h-[90vh] bg-gray-50">
      <div className="max-w-7xl h-full mx-auto px-4 py-10 md:py-16">
        <div className="w-full h-[70vh] flex items-center justify-center">
          {!token ? <PasswordResetRequest /> : <PasswordResetForm token={token} />}
        </div>
      </div>
    </main>
  )
}
