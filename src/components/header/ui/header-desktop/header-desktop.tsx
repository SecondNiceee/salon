"use client"
import CatalogButton from "@/components/catalog-button/CatalogButton"
import ProductSearch from "@/components/product-search/ProductSearch"
import UserLink from "../user-link/user-link"
import HeaderLogo from "../header-logo/header-logo"
import { AccessibilityButton } from "@/components/accessibility/AccessibilityButton"

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
          <AccessibilityButton mode="largeText" />
          <AccessibilityButton mode="highContrast" />
          <AccessibilityButton mode="speech" />
          <CatalogButton />
        </div>

        <UserLink />
      </div>
    </div>
  )
}

export default HeaderDesktop
