"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useCatalogStore } from "@/entities/catalog/catalogStore"
import { useCategoriesStore } from "@/entities/categories/categoriesStore"
import Image from "next/image"
import type { Media } from "@/payload-types"
import type { CategoryWithSubs } from "@/actions/server/categories/getCategorysWithSubs"
import { X } from "lucide-react"
import Link from "next/link"
import { useMobileStore } from "@/entities/mobileMenu/mobileMenuStore"
import { useParams } from "next/navigation"
import { fixPayloadUrl } from "@/utils/fixPayloadUrl"

const CategoryPopup = () => {
  const { isCatalogPopupOpened, setPopupCatalogOpened } = useCatalogStore()
  const categories = useCategoriesStore().categories
  const { setOpened } = useMobileStore()
  const params = useParams()
  const city = params?.city as string

  return (
    <Dialog
      open={isCatalogPopupOpened}
      onOpenChange={() => {
        setPopupCatalogOpened(false)
      }}
    >
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden rounded-3xl bg-white">
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-2xl font-bold text-gray-900">Каталог</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPopupCatalogOpened(false)
            }}
            className="h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* Scrollable Content with custom scrollbar */}
        <div className="overflow-y-auto px-6 pb-6 custom-scrollbar" style={{ maxHeight: "calc(85vh - 80px)" }}>
          <div className="flex flex-col gap-8 py-4">
            {categories.map((category: CategoryWithSubs) => (
              <React.Fragment key={category.id}>
                {category.subCategories.length ? (
                  <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-black">{category.title}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {category.subCategories.map((subCategory) => (
                        <Link
                          href={`/${city}/${subCategory.value}`}
                          onClick={() => {
                            setPopupCatalogOpened(false)
                            setOpened(false)
                          }}
                          className="w-full cursor-pointer p-2 relative rounded-xl h-[100px] flex justify-center items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg"
                          key={subCategory.id}
                        >
                          <Image
                            className="absolute left-0 rounded-xl z-[20] top-0 w-full h-full object-cover"
                            width={200}
                            height={100}
                            quality={45}
                            loading="eager"
                            alt={(subCategory.coverImage as Media)?.alt ?? ""}
                            src={fixPayloadUrl((subCategory.coverImage as Media)?.url) ?? ""}
                          />
                          <div className="bg-black rounded-xl absolute z-[30] w-full h-full opacity-50 transition-opacity duration-200 hover:opacity-60" />
                          <p className="text-white text-center text-sm md:text-base font-medium relative z-[40] px-2 leading-tight">
                            {subCategory.title}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Custom scrollbar styles */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            margin: 12px 0;
            margin-top:20px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 3px;
            margin-top:20px;
          }
          
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          
          .custom-scrollbar::-webkit-scrollbar-corner {
            background: transparent;
          }
          
          /* Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #d1d5db transparent;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryPopup
