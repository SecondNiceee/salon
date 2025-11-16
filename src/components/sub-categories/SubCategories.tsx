'use client'

import type { Category } from '@/payload-types'
import type React from 'react'
import { forwardRef, useRef } from 'react'
import { Badge } from '../ui/badge'
import type { ProductsWithSubCategory } from '@/actions/server/products/getFilterProducts'

interface ISubCategories {
  sortedProducts: ProductsWithSubCategory[]
  activeSubCategory: string | null
  badgesRef: React.RefObject<(HTMLDivElement | null)[]>
  sectionsRef: React.RefObject<(HTMLDivElement | null)[]>
  onSubCategoryClick?: (value: string) => void
}

const SubCategories = forwardRef<HTMLDivElement, ISubCategories>(
  ({ sortedProducts, activeSubCategory, badgesRef, sectionsRef, onSubCategoryClick }, ref) => {
    const localRef = useRef<HTMLDivElement | null>(null)

    const setCombinedRef = (el: HTMLDivElement | null) => {
      localRef.current = el
      if (typeof ref === 'function') {
        ref(el)
      } else if (ref && 'current' in (ref as any)) {
        ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = el
      }
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      if (!localRef.current) return
      e.preventDefault()
      e.stopPropagation()
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      localRef.current.scrollBy({ left: delta, behavior: 'smooth' })
    }

    const handleClick = (value: string, index: number) => {
      if (onSubCategoryClick) {
        // Если есть функция навигации - используем её
        onSubCategoryClick(value)
      } else {
        // Иначе прокручиваем к секции (старое поведение)
        const section = sectionsRef.current[index]
        if (section) {
          const sectionRect = section.getBoundingClientRect()
          const scrollTop = window.pageYOffset + sectionRect.top - 305
          window.scrollTo({
            top: scrollTop,
            behavior: 'smooth',
          })
        }
      }
    }

    return (
      <div className="flex z-20 pb-3 pt-0 mx-auto bg-gray-50 ">
        <div className="max-w-7xl w-full pt-4 px-4 mx-auto">
          <div
            ref={setCombinedRef}
            className="flex gap-4 overflow-x-scroll overflow-y-hidden hide-scrollbar overscroll-x-contain overscroll-y-none touch-pan-x"
            onWheelCapture={handleWheel}
          >
            {sortedProducts.map((item, index) => {
              const isActive = activeSubCategory === (item.subCategory as Category).value
              return (
                <div
                  key={(item.subCategory as Category).id}
                  ref={(el) => {
                    badgesRef.current[index] = el
                  }}
                  onClick={() => handleClick((item.subCategory as Category).value, index)}
                  className="rounded-2xl cursor-pointer flex-shrink-0 whitespace-nowrap"
                >
                  <Badge
                    className={`${isActive ? 'bg-black hover:bg-black' : 'bg-gray-200 hover:bg-gray-200'} py-1 rounded-3xl flex justify-center items-center`}
                  >
                    <p
                      className={`${isActive ? 'text-white hover:text-white' : 'text-black hover:text-black'} text-sm`}
                    >
                      {(item.subCategory as Category).title}
                    </p>
                  </Badge>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  },
)

export default SubCategories
