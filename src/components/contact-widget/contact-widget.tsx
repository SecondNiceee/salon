"use client"
import { useEffect, useState } from "react"
import { MessageCircle, Send, MessageSquare, Mail, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import { useBookingModalStore } from "@/entities/booking/bookingModalStore"

export function ContactWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const { siteSettings } = useSiteSettings()
  const { openModal } = useBookingModalStore()

  const toggleWidget = () => {
    setIsOpen(!isOpen)
  }

  const handleCallRequest = () => {
    openModal(null)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 100)
    }

    // Set initial state on mount
    if (typeof window !== "undefined") {
      setHasScrolled(window.scrollY > 100)
      window.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className="fixed flex flex-col bottom-20 right-6 md:bottom-12 md:right-12 z-50">
      {/* Expanded State */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 min-w-[200px]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Связаться с нами</h3>
            <Button variant="ghost" size="sm" onClick={toggleWidget} className="h-6 w-6 p-0 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleCallRequest}
              className="w-full cursor-pointer flex justify-start items-center h-10 px-3 hover:bg-green-50 text-gray-700 rounded-lg transition-colors"
            >
              <Phone className="h-4 w-4 mr-3 text-green-500" />
              Заказать звонок
            </button>

            {/* Telegram */}
            <a
              href={siteSettings?.socialLinks.telegram || ""}
              className="w-full cursor-pointer flex justify-start items-center h-10 px-3 hover:bg-blue-50 text-gray-700 rounded-lg transition-colors"
            >
              <Send className="h-4 w-4 mr-3 text-blue-500" />
              Telegram
            </a>

            {/* WhatsApp */}
            <a
              href={siteSettings?.socialLinks.whatsApp || ""}
              className="w-full flex cursor-pointer justify-start items-center h-10 px-3 hover:bg-green-50 text-gray-700 rounded-lg transition-colors"
            >
              <MessageSquare className="h-4 w-4 mr-3 text-green-500" />
              WhatsApp
            </a>

            {/* Email */}
            <a
              href={`mailto:${siteSettings?.socialLinks.email}`}
              className="w-full flex cursor-pointer justify-start items-center h-10 px-3 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors"
            >
              <Mail className="h-4 w-4 mr-3 text-gray-500" />
              Email
            </a>
          </div>
        </div>
      )}

      <div className="flex gap-3 items-center">
        <Button
          onClick={handleCallRequest}
          className={`h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:scale-105 flex items-center justify-center font-medium transition-all duration-500 ease-out ${
            hasScrolled ? "px-5 w-auto min-w-fit" : "w-16 px-0"
          }`}
        >
          <Phone className="text-white translate-x-[4px] h-[24px] w-[24px] min-w-[24px] min-h-[24px] flex-shrink-0" />
          <span
            className={`text-white text-sm sm:text-base whitespace-nowrap transition-all duration-500 ease-out overflow-hidden ${
              hasScrolled ? "opacity-100 w-auto ml-2" : "opacity-0 w-0 ml-0"
            }`}
          >
            Заказать звонок
          </span>
        </Button>

        {/* Main Toggle Button */}
        <Button
          onClick={toggleWidget}
          className="h-16 w-16 rounded-full bg-slate-600 hover:bg-slate-700 shadow-lg transition-all duration-200 hover:scale-105 flex-shrink-0"
        >
          <MessageCircle className="text-white h-[24px] w-[24px] min-w-[24px] min-h-[24px]" />
        </Button>
      </div>
    </div>
  )
}
