"use client"
import Link from "next/link"
import { Phone } from "lucide-react"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import { useMobileStore } from "@/entities/mobileMenu/mobileMenuStore"
import { CitySelector } from "@/components/city-selector/city-selector"

const TopBar = () => {
  const { siteSettings } = useSiteSettings()
  const { setOpened } = useMobileStore()

  const onLinkClick = () => {
    setOpened(false)
  }

  return (
    <div className={`bg-gray-50 border-b border-gray-200 transition-transform duration-300 `}>
      <div className="px-4 py-2 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-0 justify-between text-sm">
          {/* Левая часть - ссылки */}
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <Link onClick={onLinkClick} href={`/`} className="text-gray-600 transition-colors hover:text-gray-900">
              Главная
            </Link>
            <div className="text-gray-600 text-xs md:text-sm">
              Академия профессионального Образования | Лицензия: Л035-01298-77/01010677
            </div>
          </div>

          <div className="flex items-center gap-4">
            <CitySelector />

            {/* Правая часть - номер телефона */}
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="w-4 h-4" />
              <a href="tel:+74951599009" className="font-medium transition-colors hover:text-gray-900">
                {siteSettings?.companyInfo.phone}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
