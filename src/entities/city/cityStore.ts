"use client"

import { create } from "zustand"

export type TCity = {
  name: string;
  slug: string;
  declensions: {
      nominative: string;
      genitive: string;
      prepositional: string;
  };
  seoTitle?: string | null;
  metaDescription?: string | null;
  isDefault?: boolean | null;
  id?: string | null;
}

type CityState = {
  city: TCity | null
  setCity: (city: any | null) => void
}

export const useCityStore = create<CityState>((set) => ({
  city: null,
  setCity: (city) => set({ city }),
}))
