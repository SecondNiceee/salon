"use client"

import { create } from "zustand"

type TCity = {
  id : string,
  name : string,
  slug : string,
  declensions : {
    genitive : string,
    nominative : string,
    prepositional : string
  }
}

type CityState = {
  city: TCity | null
  setCity: (city: any | null) => void
}

export const useCityStore = create<CityState>((set) => ({
  city: null,
  setCity: (city) => set({ city }),
}))
