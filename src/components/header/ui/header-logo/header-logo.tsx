import { routerConfig } from "@/config/router.config"
import Link from "next/link"

const HeaderLogo = () => {
  return (
    <Link
      href={routerConfig.home}
      className="flex items-center flex-shrink-0 group hover:opacity-80 transition-opacity"
    >
      <div className="flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gradient-to-br from-pink-300 to-pink-500 text-white font-bold text-sm lg:text-base shadow-md group-hover:shadow-lg transition-shadow">
        ✨
      </div>
      <div className="ml-2 lg:ml-3 flex flex-col">
        <h1 className="text-lg lg:text-2xl font-bold text-gray-900 leading-tight">Академия Спа</h1>
        <p className="text-xs lg:text-sm text-pink-600 font-medium">Красота и релаксация</p>
      </div>
    </Link>
  )
}

export default HeaderLogo
