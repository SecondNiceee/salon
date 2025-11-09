"use client"
import { create } from "zustand"
import type { User } from "@/payload-types"

interface BookingModalStore {
  isOpen: boolean
  mode: "form" | "success" // Added mode to track form or success state
  user: User | null
  productId: string | number | null
  isSubmitting: boolean
  openModal: (user: User | null, productId: string | number, form? : "form" | "success") => void
  closeModal: () => void
  setMode: (mode: "form" | "success") => void // New method to change mode
  setUser: (user: User | null) => void
  setIsSubmitting: (value: boolean) => void
}

export const useBookingModalStore = create<BookingModalStore>((set) => ({
  isOpen: false,
  mode: "form",
  user: null,
  productId: null,
  isSubmitting: false,
  openModal: (user, productId, form) => set({ isOpen: true, user, productId, mode: form ?? "form" }), // Reset mode to form when opening
  closeModal: () => set({ isOpen: false, mode: "form" }), // Reset mode when closing
  setMode: (mode) => set({ mode }),
  setUser: (user) => set({ user }),
  setIsSubmitting: (value) => set({ isSubmitting: value }),
}))
