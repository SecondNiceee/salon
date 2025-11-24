"use client"
import CatalogButton from "@/components/catalog-button/CatalogButton"
import ProductSearch from "@/components/product-search/ProductSearch"
import UserLink from "../user-link/user-link"
import HeaderLogo from "../header-logo/header-logo"

const HeaderDesktop = () => {
  return (
    <div className="hidden md:block w-full">
      <div className="flex items-center justify-between w-full gap-6 lg:gap-8 mb-3">
        {/* Logo on the left */}
        <div className="flex-shrink-0">
          <HeaderLogo />
        </div>

        {/* Search in the center */}
        <div className="flex-1 max-w-md lg:max-w-lg">
          <ProductSearch />
        </div>
        {/* Catalog and User on the right */}
        <div className="flex items-center gap-3 lg:gap-4 flex-shrink-0">
          <CatalogButton />

          {/* <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden w-10 h-10 p-2 bg-transparent">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 bg-white">
            <SheetTitle className="text-sm font-semibold mt-6">Меню</SheetTitle>
          </SheetContent>
        </Sheet> */}
        </div>

        <UserLink />
      </div>
    </div>
  )
}

export default HeaderDesktop
