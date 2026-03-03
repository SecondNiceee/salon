"use client"

import { Button } from "@/components/ui/button"
import { useBookingModalStore } from "@/entities/booking/bookingModalStore"
import { useAuthStore } from "@/entities/auth/authStore"
import { useCityStore } from "@/entities/city/cityStore"
import { toast } from "sonner"

interface BookingButtonBlockProps {
  buttonText?: string
  variant?: "default" | "secondary" | "accent"
  size?: "sm" | "default" | "lg"
  alignment?: "left" | "center" | "right"
}

export function BookingButtonBlock({
  buttonText = "Забронировать",
  variant = "default",
  size = "default",
  alignment = "left",
}: BookingButtonBlockProps) {
  const { openModal, setIsSubmitting, isSubmitting } = useBookingModalStore()
  const { user } = useAuthStore()
  const { city } = useCityStore()

  const handleClick = async () => {
    if (user && user.name && user.phone) {
      try {
        setIsSubmitting(true)

        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: user.name,
            phone: user.phone,
            city: city?.declensions?.nominative || city?.title,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          toast.error(result.message || "Ошибка при отправке заявки")
          setIsSubmitting(false)
          return
        }

        setIsSubmitting(false)
        toast.success("Заявка успешно отправлена! Мы скоро свяжемся с вами.")
      } catch (error) {
        console.error("Error submitting feedback:", error)
        toast.error("Ошибка при отправке заявки. Попробуйте еще раз.")
        setIsSubmitting(false)
      }
    } else {
      openModal(user, null as any)
    }
  }

  const alignmentClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }

  const variantClasses = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    accent: "bg-green-600 hover:bg-green-700 text-white",
  }

  const sizeClasses = {
    sm: "h-9 px-4 text-sm",
    default: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  }

  return (
    <div className={`flex w-full ${alignmentClasses[alignment]}`}>
      <Button
        onClick={handleClick}
        disabled={isSubmitting}
        className={`${variantClasses[variant]} ${sizeClasses[size]} shadow-md hover:shadow-lg transition-all duration-200`}
      >
        {isSubmitting ? "Загрузка..." : buttonText}
      </Button>
    </div>
  )
}
