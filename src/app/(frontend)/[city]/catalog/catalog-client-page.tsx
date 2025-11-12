"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useCategoriesStore } from "@/entities/categories/categoriesStore"
import Image from "next/image"
import type { Media } from "@/payload-types"
import type { CategoryWithSubs } from "@/actions/server/categories/getCategorysWithSubs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CatalogClientPage() {
  const categories = useCategoriesStore().categories
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={handleBack} className="h-9 w-9 p-0">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Каталог</h1>
        </div>
      </div>

      <div className="overflow-y-auto px-4 py-4">
        <div className="flex flex-col gap-6">
          {categories.map((category: CategoryWithSubs) => (
            <React.Fragment key={category.id}>
              {category.subCategories.length ? (
                <div className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold text-black px-2">{category.title}</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {category.subCategories.map((subCategory) => (
                      <Link
                        href={`/${category.value}?sub=${subCategory.value}`}
                        className="w-full cursor-pointer p-2 relative rounded-xl h-[120px] flex justify-center items-center transition-transform duration-200 hover:scale-105 hover:shadow-lg active:scale-95"
                        key={subCategory.id}
                      >
                        <Image
                          className="absolute left-0 rounded-xl z-[20] top-0 w-full h-full object-cover"
                          width={500}
                          height={500}
                          alt={(subCategory.coverImage as Media)?.alt ?? ""}
                          src={(subCategory.coverImage as Media)?.url ?? ""}
                        />
                        <div className="bg-black rounded-xl absolute z-[30] w-full h-full opacity-50 transition-opacity duration-200 hover:opacity-60" />
                        <p className="text-white text-center text-sm font-medium relative z-[40] px-3 leading-tight">
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
    </div>
  )
}
