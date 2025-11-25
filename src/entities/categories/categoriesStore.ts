"use client"
import { type CategoryWithSubs, getCategoriesWithSubs } from "@/actions/server/categories/getCategorysWithSubs"
import type { RequestError } from "@/utils/request"
import { create } from "zustand"

interface CategoriesStore {
  categories: CategoryWithSubs[]
  isLoading: boolean
  getCategories: () => Promise<void>
  setCategories: (categories: CategoryWithSubs[]) => void
  error: RequestError | null
  currentCategory: CategoryWithSubs | null
}

export const useCategoriesStore = create<CategoriesStore>((set) => ({
  currentCategory: null,
  categories: [],
  error: null,
  isLoading: false,
  getCategories: async () => {
    set({ isLoading: true, error: null })
    const categories = await getCategoriesWithSubs()
    if (!categories) {
      set({ isLoading: false, error: { message: "Internal Error", status: 500 } })
    } else {
      set({ isLoading: false, categories })
    }
  },
  setCategories: (categories: CategoryWithSubs[]) => {
    set({ categories, isLoading: false, error: null })
  },
}))
