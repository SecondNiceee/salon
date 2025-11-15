"use client"

import type React from "react"

import { useCategoriesStore } from "@/entities/categories/categoriesStore"
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useEffect, useRef, useState } from "react"
import ErrorAlert from "../error-alert/ErrorAlert"
import type { Media } from "@/payload-types"
import { Button } from "../ui/button"
import Link from "next/link"
import { useParams } from 'next/navigation'
import { useCity } from "@/lib/use-city"

export function Categories() {
  const { categories, getCategories, error, isLoading } = useCategoriesStore()
  const isCategoriesFetched = useRef<boolean>(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const params = useParams()
  const subcategorySlug = params?.subcategorySlug
    ? Array.isArray(params.subcategorySlug)
      ? params.subcategorySlug[0]
      : params.subcategorySlug
    : ""

  const city = useCity()

  useEffect(() => {
    if (!categories.length && !isCategoriesFetched.current) {
      getCategories()
      isCategoriesFetched.current = true
    }
  }, [categories])

  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  useEffect(() => {
    checkScrollability()
    const handleResize = () => checkScrollability()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [categories])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      })
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return
    e.preventDefault()
    e.stopPropagation()
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" })
  }

  if (isLoading && !categories.length) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
      </div>
    )
  }

  if (error) {
    console.log(error)
    return (
      <ErrorAlert
        buttonAction={() => {
          getCategories()
        }}
        errorMessage="Не удалось загрузить категории. Проверьте подключение к интернету."
      />
    )
  }

  const isSubCategoryActive = (categoryValue: string) => {
    const category = categories.find((cat) => cat.value === categoryValue)
    if (!category) return false
    return category.subCategories.some((sub) => sub.value === subcategorySlug)
  }

  return (
    <div className="bg-white md:py-4 pt-2 pb-1">
      <div className="max-w-7xl mx-auto px-4 relative">
        {canScrollLeft && (
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50 rounded-full w-5 h-5 sm:w-8 sm:h-8"
            onClick={scrollLeft}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}

        {canScrollRight && (
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md hover:bg-gray-50 rounded-full w-5 h-5 sm:w-8 sm:h-8"
            onClick={scrollRight}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        <div
          ref={scrollContainerRef}
          className="flex items-start gap-1 sm:gap-3 md:gap-5 overflow-x-scroll hide-scrollbar overflow-y-hidden overscroll-x-contain overscroll-y-none touch-pan-x"
          onScroll={checkScrollability}
          onWheelCapture={handleWheel}
        >
          {categories.map((category, index) => {
            const imageUrl = (category.icon as Media).url ?? ""
            const isActive = isSubCategoryActive(category.value)
            
            const firstSubCategory = category.subCategories[0]
            const href = firstSubCategory 
              ? `/${city}/${firstSubCategory.value}` 
              : `/${city}/catalog`

            return (
              <Link
                href={href}
                key={index}
                className={`flex flex-col items-center gap-2 min-w-[90px] max-w-[90px] cursor-pointer hover:text-brand-600 transition-colors`}
              >
                <div
                  className={`sm:w-12 sm:h-12 w-7 h-7 ${isActive ? "border-pink-500 border-2 border-solid" : "border-black border-[1px] border-solid"}  rounded-full flex items-center justify-center hover:bg-brand-50`}
                >
                  <img
                    alt={"shop"}
                    src={imageUrl || "/placeholder.svg"}
                    className="sm:h-6 sm:w-6 h-4 w-4 text-black"
                  />
                </div>
                <span className={`text-xs ${isActive ? "text-brand-400 font-semibold" : ""} text-center leading-tight`}>
                  {category.title}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
