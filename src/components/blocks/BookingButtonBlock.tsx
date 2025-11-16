"use client"

import { Button } from "@/components/ui/button"
import { useBookingModalStore } from "@/entities/booking/bookingModalStore"

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
  const { openModal } = useBookingModalStore()

  const handleClick = () => {
    openModal(null, null as any)
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
        className={`${variantClasses[variant]} ${sizeClasses[size]} shadow-md hover:shadow-lg transition-all duration-200`}
      >
        {buttonText}
      </Button>
    </div>
  )
}
