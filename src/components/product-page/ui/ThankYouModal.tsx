"use client"

import { X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ThankYouModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ThankYouModal({ isOpen, onClose }: ThankYouModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Заявка отправлена</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="px-4 sm:px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Спасибо за заявку!</h3>
          <p className="text-gray-600 mb-6">Мы свяжемся с вами в ближайшее время</p>
          <Button onClick={onClose} className="bg-lime-500 hover:bg-lime-600 text-white min-h-[44px] w-full">
            Закрыть
          </Button>
        </div>
      </div>
    </div>
  )
}
