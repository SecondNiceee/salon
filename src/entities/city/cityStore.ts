"use client"

import { create } from "zustand"
import type { City } from "@/payload-types"

type CityState = {
  city: City | null
  setCity: (city: City | null) => void
}

export const useCityStore = create<CityState>((set) => ({
  city: null,
  setCity: (city) => set({ city }),
}))
