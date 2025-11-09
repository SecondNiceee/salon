"use client"
import type { ReactNode } from "react"
import { useCatalogStore } from "@/entities/catalog/catalogStore"
import CategoryPopup from "@/components/category-popup/CategoryPopup"
import GuestBenefitsModal, { useGuestBenefitsStore } from "../auth/guest-benefits-modal"
import { useBookingModalStore } from "@/entities/booking/bookingModalStore"
import BookingModal from "@/components/product-page/ui/BookingModal"
import { useAuthStore } from "@/entities/auth/authStore"

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const { isCatalogPopupOpened } = useCatalogStore()
  const { open: isGuestPopupOpened } = useGuestBenefitsStore()
  const { isOpen: isBookingModalOpen } = useBookingModalStore()
  const { user: authUser } = useAuthStore()

  return (
    <>
      {children}
      {/* Глобальные попапы */}
      {isCatalogPopupOpened && <CategoryPopup />}
      {isGuestPopupOpened && <GuestBenefitsModal />}
      {isBookingModalOpen &&  <BookingModal  />}
    </>
  )
}
