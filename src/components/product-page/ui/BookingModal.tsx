"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { X, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPhoneNumber, validatePhone } from "@/utils/phone"
import { toast } from "sonner"
import { useAuthStore } from "@/entities/auth/authStore"
import { useBookingModalStore } from "@/entities/booking/bookingModalStore"
import { useCityStore } from "@/entities/city/cityStore"

export default function BookingModal() {
  const [formData, setFormData] = useState({ name: "", phone: "" })
  const [errors, setErrors] = useState({ name: "", phone: "" })
  const [saveToAccount, setSaveToAccount] = useState(true)
  const { updateProfile } = useAuthStore()
  const { isOpen, closeModal, mode, setMode, isSubmitting, setIsSubmitting, user, productId } = useBookingModalStore()
  const { city } = useCityStore()

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

      if (productId) {
        const response = await fetch("/api/booking/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            productId: productId,
            city: city?.declensions?.nominative || city?.title,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          toast.error(result.message || "Ошибка при отправке заявки")
          setIsSubmitting(false)
          return
        }
      } else {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            city: city?.declensions?.nominative || city?.title,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          toast.error(result.message || "Ошибка при отправке заявки")
          setIsSubmitting(false)
          return
        }
      }

      setFormData({ name: "", phone: "" })
      setIsSubmitting(false)
      setMode("success")
    } catch (error) {
      console.error("Error submitting booking:", error)
      toast.error("Ошибка при отправке заявки. Попробуйте еще раз.")
      setIsSubmitting(false)
    }
  }

  const hasIncompleteData = user && (!user.name || !user.phone)
  const showSaveCheckbox = user && hasIncompleteData

  if (!isOpen) return null

  return (
    <div className="fixed z inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {mode === "form" ? (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {productId ? "Записаться на услугу" : "Заказать звонок"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm sm:text-base text-green-800">
                  {productId
                    ? "Наш менеджер свяжется с Вами в ближайшее время."
                    : "Оставьте ваши контакты, и мы позвоним вам в ближайшее время."}
                </p>
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

                {showSaveCheckbox && (
                  <div className="flex items-center gap-2">
                    <input
                      id="saveToAccount"
                      type="checkbox"
                      checked={saveToAccount}
                      onChange={(e) => setSaveToAccount(e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <label htmlFor="saveToAccount" className="text-sm text-gray-700 cursor-pointer">
                      Запомнить для этого пользователя
                    </label>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={closeModal}
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
                    ) : productId ? (
                      "Отправить"
                    ) : (
                      "Заказать звонок"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {productId ? "Заявка отправлена" : "Спасибо за заявку"}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="px-4 sm:px-6 py-8 text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {productId ? "Спасибо за заявку!" : "Мы вас позовем!"}
              </h3>
              <p className="text-gray-600 mb-6">
                {productId ? "Мы свяжемся с вами в ближайшее время" : "Наш менеджер позвонит вам в ближайшее время"}
              </p>
              <Button onClick={closeModal} className="bg-lime-500 hover:bg-lime-600 text-white min-h-[44px] w-full">
                Закрыть
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
