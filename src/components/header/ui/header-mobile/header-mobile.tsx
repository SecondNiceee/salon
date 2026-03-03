"use client"
import { Button } from "../../../ui/button"
import { Menu, Home } from "lucide-react"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../../../ui/sheet"
import ProductSearch from "../../../product-search/ProductSearch"
import CatalogButton from "../../../catalog-button/CatalogButton"
import { useMobileStore } from "@/entities/mobileMenu/mobileMenuStore"
import UserLink from "../user-link/user-link"
import { useRouter } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import { useAuthDialogStore } from "@/entities/auth/authDialogStore"
import { useAuthStore } from "@/entities/auth/authStore"
import { useCity } from "@/lib/use-city"
import { CitySelector } from "@/components/city-selector/city-selector"
import Link from "next/link"
import { AccessibilityDropdown } from "@/components/accessibility/AccessibilityDropdown"

const HeaderMobile = () => {
  const { isOpened, setOpened } = useMobileStore()
  const router = useRouter()
  const city = useCity()

  const { user } = useAuthStore()
  const { openDialog } = useAuthDialogStore()

  const clickHandler = () => {
    setOpened(false)
    if (user) {
      router.push(routerConfig.getPath(city, "profile"))
    } else {
      openDialog("login")
    }
  }

  return (
    <div className="md:hidden">
      <div className="text-center space-y-1 pb-3 pt-1">
        <h2 className="text-sm font-semibold text-gray-800 leading-tight">
          Академия профессионального Образования
        </h2>
        <p className="text-xs text-gray-600">Лицензия: Л035-01298-77/01010677</p>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Link href={routerConfig.getPath(city, routerConfig.home)} className="shrink-0">
          <Button variant="outline" size="sm" className="p-2 bg-transparent shrink-0">
            <Home className="h-5 w-5" />
            <span className="sr-only">На главную</span>
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <ProductSearch onProductSelect={() => {}} />
        </div>

        <AccessibilityDropdown />

        <Sheet onOpenChange={setOpened} open={isOpened}>
          <SheetTrigger onClick={() => setOpened(true)} asChild>
            <Button variant="outline" size="sm" className="p-2 bg-transparent shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white">
            <SheetTitle className="sr-only">Меню</SheetTitle>
            <div className="space-y-3 mt-6 flex flex-col">
              <div className="w-full">
                <CitySelector className="w-full" />
              </div>
              <CatalogButton />
              <Button
                variant="outline"
                className="w-full justify-start gap-3 p-4 bg-transparent items-center h-auto"
                onClick={clickHandler}
              >
                <div className="shrink-0 flex items-center justify-center">
                  <UserLink />
                </div>
                <p className="">Аккаунт</p>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

export default HeaderMobile
