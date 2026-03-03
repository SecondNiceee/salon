import { getSiteSettings } from "@/actions/server/globals/getSiteSettings"
import { routerConfig } from "@/config/router.config"
import type { Media } from "@/payload-types"
import Image from "next/image"
import Link from "next/link"
export const dynamic = "auto"

export const revalidate = 31536000 // 1 год
export async function Footer({city} : {city : any}) {
  const siteSettings = await getSiteSettings();
  return (
    <footer className="px-4 md:pt-8 md:pb-8 pt-5 pb-[160px] bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Logo and Social Icons */}
          <div className="md:col-span-1">
            <h3 className="mb-4 text-2xl font-bold text-pink-600">Академия профессионального образования</h3>
            <div className="flex mb-4 space-x-3">
              {/* VK Icon */}
              <Link
                rel="noopener norreferrer"
                target="_blank"
                href={siteSettings?.socialLinks?.vk || "#"}
                className="text-gray-600 hover:text-gray-800"
              >
                <img className="w-6 h-6" alt="Вк Академия профессионального образования" src={"/vk-icon.svg"} width={24} height={24} />
              </Link>

              {/* Telegram Icon */}
              <Link
                rel="noopener norreferrer"
                target="_blank"
                href={siteSettings?.socialLinks?.telegram || "#"}
                className="text-gray-600 hover:text-gray-800"
              >
                <img
                  width={24}
                  height={24}
                  className="w-6 h-6"
                  alt="Telegram Академия профессионального образования"
                  src={"/telegram-icon.svg"}
                />
              </Link>

              {/* Instagram Icon */}
              <Link
                rel="noopener norreferrer"
                target="_blank"
                href={siteSettings?.socialLinks?.instagram || "#"}
                className="text-gray-600 hover:text-gray-800"
              >
                <img
                  className="w-6 h-6"
                  width={24}
                  height={24}
                  alt="Instagram ICON Академия профессионального образования"
                  src={"/instagram-icon.svg"}
                />
              </Link>
            </div>
            <p className="mt-2 text-[10px] text-gray-400 leading-tight">
              * Instagram принадлежит компании Meta, признанной экстремистской организацией и запрещённой в РФ
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8 md:col-span-3 md:grid-cols-3">
            {/* Column 1 */}
            <div>
              <ul className="space-y-3">
                <li>
                  <Link href={routerConfig.withCity(city.slug, routerConfig.home)} className="text-sm text-gray-600 hover:text-gray-800">
                    Главная
                  </Link>
                </li>
              </ul>
            </div>  

            {/* Column 2 */}
            <div>
              <ul className="space-y-3">
                <li>
                  {siteSettings?.companyInfo?.privacyPolicyDocument &&
                  typeof siteSettings.companyInfo.privacyPolicyDocument !== "string" ? (
                    <a
                      href={(siteSettings.companyInfo.privacyPolicyDocument as Media).url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 hover:text-gray-800"
                    >
                      Политика конфиденциальности
                    </a>
                  ) : (
                    <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-800">
                      Политика конфиденциальности
                    </Link>
                  )}
                </li>
                <li>
                  <Link href={routerConfig.withCity(city.slug, routerConfig.contacts)} className="text-sm text-gray-600 hover:text-gray-800">
                    Контакты
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
