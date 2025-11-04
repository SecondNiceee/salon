"use client"
import type { ReactNode } from "react"
import { useCatalogStore } from "@/entities/catalog/catalogStore"
import CategoryPopup from "@/components/category-popup/CategoryPopup"
import GuestBenefitsModal, { useGuestBenefitsStore } from "../auth/guest-benefits-modal"

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const { isCatalogPopupOpened } = useCatalogStore()
  const { open: isGuestPopupOpened } = useGuestBenefitsStore()

  return (
    <>
      {children}
      {/* Глобальные попапы */}
      {isCatalogPopupOpened && <CategoryPopup />}
      {isGuestPopupOpened && <GuestBenefitsModal />}
    </>
  )
}
