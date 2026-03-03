"use client"
import { routerConfig } from "@/config/router.config"
import Link from "next/link"
import Image from "next/image"
import { useCity } from "@/lib/use-city"

const HeaderLogo = () => {
  const city = useCity() // Get city from hook

  return (
    <Link
      href={routerConfig.getPath(city || "", "/")}
      className="flex items-center flex-shrink-0 group hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white shadow-lg group-hover:shadow-xl transition-shadow">
        <img
          src="/logo-icon.png"
          alt="Академия профессионального образования Логотип"
          width={32}
          height={32}
          className="lg:w-8 lg:h-8 w-7 h-7"
        />
      </div>
      <div className="ml-2 lg:ml-3 flex flex-col">
        <h4 className="text-lg lg:text-2xl font-bold text-gray-900 leading-tight">Академия</h4>
        <p className="text-xs lg:text-sm text-pink-600 font-medium">Профессионального Образования</p>
      </div>
    </Link>
  )
}

export default HeaderLogo
