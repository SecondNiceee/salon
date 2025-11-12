"use client"
import { Button } from "../../../ui/button"
import { Menu } from "lucide-react"
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

const HeaderMobile = () => {
  const { isOpened, setOpened } = useMobileStore()
  const router = useRouter()
  const city = useCity() // Get city from hook

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
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <ProductSearch onProductSelect={() => {}} />
        </div>

        <Sheet onOpenChange={setOpened} open={isOpened}>
          <SheetTrigger onClick={() => setOpened(true)} asChild>
            <Button variant="outline" size="sm" className="p-2 bg-transparent shrink-0">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white">
            <SheetTitle className="sr-only">Меню</SheetTitle>
            <div className="space-y-3 mt-6">
              <CatalogButton />

              <Button
                variant="outline"
                className="w-full h-[53.6px] justify-start gap-3 p-4 bg-transparent"
                onClick={clickHandler}
              >
                <UserLink />
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
