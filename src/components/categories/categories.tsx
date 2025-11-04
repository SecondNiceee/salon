"use client"

import type React from "react"

import { useCategoriesStore } from "@/entities/categories/categoriesStore"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import ErrorAlert from "../error-alert/ErrorAlert"
import type { Media } from "@/payload-types"
import { Button } from "../ui/button"
import Link from "next/link"
import { useParams } from "next/navigation"

export function Categories() {
  const { categories, getCategories, error, isLoading } = useCategoriesStore()
  const isCategoriesFetched = useRef<boolean>(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const params = useParams()
  const slug = params?.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : ""

  useEffect(() => {
    if (!categories.length && !isCategoriesFetched.current) {
      getCategories()
      isCategoriesFetched.current = true
    }
  }, [categories])

  // Проверяем возможность прокрутки
  const checkScrollability = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth)
    }
  }

  // Проверяем при загрузке категорий и изменении размера окна
  useEffect(() => {
    checkScrollability()
    const handleResize = () => checkScrollability()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [categories])

  // Функции прокрутки
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

  // Горизонтальная прокрутка колесиком мыши
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return
    // Блокируем вертикальную прокрутку страницы при взаимодействии с категориями
    e.preventDefault()
    e.stopPropagation()
    // Преобразуем вертикальную прокрутку в горизонтальную (или используем горизонтальную, если она есть)
    const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
    scrollContainerRef.current.scrollBy({ left: delta, behavior: "smooth" })
  }

  if (isLoading && !categories.length) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  // 🔽 Показываем ошибку, если есть
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

  return (
    <div className="bg-white md:py-4 py-2">
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Кнопка прокрутки влево */}
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

        {/* Кнопка прокрутки вправо */}
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

        {/* Контейнер с категориями */}
        <div
          ref={scrollContainerRef}
          className="flex items-start gap-1 sm:gap-3 md:gap-5 overflow-x-scroll hide-scrollbar overflow-y-hidden overscroll-x-contain overscroll-y-none touch-pan-x"
          onScroll={checkScrollability}
          onWheelCapture={handleWheel}
        >
          {categories.map((category, index) => {
            const imageUrl = (category.icon as Media).url ?? ""
            console.log("[v0] Category icon URL:", imageUrl)
            console.log("[v0] Full media object:", category.icon)

            return (
              <Link
                href={category.value}
                key={index}
                className={`flex flex-col items-center gap-2 min-w-[90px] max-w-[90px] cursor-pointer hover:text-green-600 transition-colors`}
              >
                <div
                  className={`sm:w-12 sm:h-12 w-7 h-7 ${slug === category.value ? "bg-green-400" : "bg-gray-100"}  rounded-full flex items-center justify-center hover:bg-green-50`}
                >
                  <img
                    alt={"shop"}
                    src={imageUrl || "/placeholder.svg"}
                    className="sm:h-6 sm:w-6 h-4 w-4 text-black"
                    onError={(e) => {
                      console.error("[v0] Image failed to load:", imageUrl, e)
                    }}
                  />
                </div>
                <span
                  className={`text-xs ${slug === category.value ? "text-green-400 font-semibold" : ""} text-center leading-tight`}
                >
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
