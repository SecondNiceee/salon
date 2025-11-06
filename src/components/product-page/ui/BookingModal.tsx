"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPhoneNumber, validatePhone } from "@/utils/phone"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/authStore"
import type { User } from "@/payload-types"
import ThankYouModal from "./ThankYouModal"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
  productId: string | number // Added productId prop
}

export default function BookingModal({ isOpen, onClose, user, productId }: BookingModalProps) {
  const [formData, setFormData] = useState({ name: "", phone: "" })
  const [errors, setErrors] = useState({ name: "", phone: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveToAccount, setSaveToAccount] = useState(true)
  const [isThankYouModalOpen, setIsThankYouModalOpen] = useState(false)
  const { updateProfile } = useAuthStore()

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
      })
    }
  }, [isOpen, user])

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setFormData((prev) => ({ ...prev, phone: formatted }))
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, name: e.target.value }))
    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }))
  }

  const validateForm = () => {
    const newErrors = { name: "", phone: "" }

    if (!formData.name.trim()) {
      newErrors.name = "Пожалуйста, введите ваше имя"
    }

    const phoneValidation = validatePhone(formData.phone)
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.error || "Неверный номер телефона"
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.phone
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (user && saveToAccount) {
        try {
          await updateProfile({
            name: formData.name,
            phone: formData.phone,
          })
        } catch (error) {
          console.error("Error updating profile:", error)
          // Continue with booking even if profile update fails
        }
      }

      const response = await fetch("/api/booking/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          productId: productId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        toast.error(result.message || "Ошибка при отправке заявки")
        return
      }

      setFormData({ name: "", phone: "" })
      onClose()
      setIsThankYouModalOpen(true)
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error("Ошибка при отправке заявки. Попробуйте еще раз.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed z inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Записаться на услугу</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="px-4 sm:px-6 py-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm sm:text-base text-green-800">Наш менеджер свяжется с Вами в ближайшее время.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Имя <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="Ваше имя"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.name ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="+7 (999) 999-99-99"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors ${
                    errors.phone ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
              </div>

              {user && (
                <div className="flex items-center gap-2">
                  <input
                    id="saveToAccount"
                    type="checkbox"
                    checked={saveToAccount}
                    onChange={(e) => setSaveToAccount(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="saveToAccount" className="text-sm text-gray-700 cursor-pointer">
                    Сохранить для этого аккаунта
                  </label>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="text-gray-600 hover:text-gray-900 min-h-[44px]"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-lime-500 hover:bg-lime-600 text-white min-h-[44px] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Отправка...</span>
                    </>
                  ) : (
                    "Отправить"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <ThankYouModal isOpen={isThankYouModalOpen} onClose={() => setIsThankYouModalOpen(false)} />
    </>
  )
}
