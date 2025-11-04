"use client"
import { create } from "zustand";

interface CatalogStore{
    isCatalogPopupOpened : boolean,
    setPopupCatalogOpened : (value : boolean) => void
}

export const useCatalogStore = create<CatalogStore>((set) => ({
    isCatalogPopupOpened : false,
    setPopupCatalogOpened : (value) => {
        set({isCatalogPopupOpened : value});
    }
}))
