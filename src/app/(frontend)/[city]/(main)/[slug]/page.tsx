'use client'
import { getFilteredProducts, ProductsWithSubCategory } from '@/actions/server/products/getFilterProducts'
import ErrorAlert from '@/components/error-alert/ErrorAlert'
import { ProductCard } from '@/components/product-card/ProductCard'
import SubCategories from '@/components/sub-categories/SubCategories'
import { useCategoriesStore } from '@/entities/categories/categoriesStore'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'

const FilterPage = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const {slug} = params as Record<string, string>
  const subCategoryValue = searchParams?.get('sub')

  const [sortedProducts, setSortedProducts] = useState<ProductsWithSubCategory[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setLoading] = useState<boolean>(false)
  const [activeSubCategory, setActiveSubCategory] = useState<string | null>(null);

  const badgesRef = useRef<(HTMLDivElement | null)[]>([])
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
  const badgesContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const {categories} = useCategoriesStore();

  const currentCategoryIndex = categories.findIndex((category) => category.value === slug);

  const toNextCategory = () => {
    if (currentCategoryIndex === categories.length - 1){
      return null
    }
    router.replace(`/${categories[currentCategoryIndex + 1].value}`)
  }

  // Получение с сервера всех подкатегорий
  const getSortedCategories = useCallback(async () => {
    setLoading(true)
    setError(null)
    const data = await getFilteredProducts(slug)
    setLoading(false)
    if (!data) {
      setError('Не удалось найти товары, проверьте подключение.')
    } else {
      setSortedProducts(data)
      setActiveSubCategory(data[0]?.subCategory.value || null)
    }
  }, [slug])

  useEffect(() => {
    getSortedCategories()
  }, [getSortedCategories])

  // Открытие попапа в случае изменения URl
  // useEffect( () => {
  //   if (productValue){
  //     setProductsPopup(true);
  //   }
  // }, [productValue] )

  //  Наблюдение за секциями
  useEffect(() => {
    if (sortedProducts.length === 0) return
    let timeoutId: NodeJS.Timeout
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
              const subCategoryValue = entry.target.getAttribute('data-subcategory-value')
              if (subCategoryValue) {
                setActiveSubCategory(subCategoryValue)
                console.log('Active SubCategory:', subCategoryValue)
              }
            }, 100)
          }
        })
      },
      {
        root: null,
        threshold: 0.1,
        rootMargin: '-70% 0px -20% 0px',
      },
    )
    sectionsRef.current.forEach((el) => {
      if (el) observer.observe(el)
    })
    return () => {
      observer.disconnect()
      clearTimeout(timeoutId)
    }
  }, [sortedProducts])

  // Скролл бейджей при изменении активной подкатегории
useEffect(() => {
    if (!activeSubCategory || !badgesContainerRef.current) return

    const activeIndex = sortedProducts.findIndex(
      (item) => item.subCategory.value === activeSubCategory,
    )
    const activeBadge = badgesRef.current[activeIndex]

    if (activeBadge && badgesContainerRef.current) {
      const container = badgesContainerRef.current
      const badgeOffsetLeft = activeBadge.offsetLeft
      const badgeWidth = activeBadge.offsetWidth
      const containerWidth = container.offsetWidth
      const maxScroll = container.scrollWidth - containerWidth

      // Вычисляем позицию для центрирования активного бейджа
      let scrollPosition = badgeOffsetLeft - containerWidth / 2 + badgeWidth / 2

      // Ограничиваем позицию
      scrollPosition = Math.max(0, Math.min(scrollPosition, maxScroll))

      container.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      })
    }
  }, [activeSubCategory, sortedProducts])

  // Прокрутка к секции при загрузке страницы, если есть параметр sub
  useEffect(() => {
    if (!subCategoryValue || sortedProducts.length === 0) return
    const index = sortedProducts.findIndex((item) => item.subCategory.value === subCategoryValue)
    if (index !== -1) {
      const section = sectionsRef.current[index]
      if (section) {
        setActiveSubCategory(subCategoryValue)
        const sectionRect = section.getBoundingClientRect()
        const scrollTop = window.pageYOffset + sectionRect.top - 305
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth',
        })
      }
    }
  }, [subCategoryValue, sortedProducts])

  if (error) {
    return <ErrorAlert buttonAction={() => getSortedCategories()} errorMessage={error} />
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    )
  }

  return (
    <>
    <section className="products-sub bg-gray-50 shadow-[0_-6px_12px_-4px_rgba(0,0,0,0.05)]">
      <SubCategories ref={badgesContainerRef} activeSubCategory={activeSubCategory} badgesRef={badgesRef} sectionsRef={sectionsRef} sortedProducts={sortedProducts} />
      <div className="max-w-7xl px-4 flex flex-col mx-auto pb-16">
        <div className="flex flex-col gap-5 mt-2">
          {sortedProducts.map((item, index) => (
            <div
              key={item.subCategory.id}
              ref={(el) => {
                sectionsRef.current[index] = el
              }}
              data-subcategory-value={item.subCategory.value}
              className="flex flex-col gap-4 w-full"
            >
              <div className="flex justify-between ml-2 items-start w-full">
                <h2 className="text-2xl text-black opacity-50 font-bold">
                  {item.subCategory.title}
                </h2>
              </div>
              <div className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {item.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </div>
          {
            currentCategoryIndex !== categories.length - 1 &&
            (
          <div className="flex items-center justify-center mt-8">
            <button
              onClick={toNextCategory}
              className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
             <p className='text-white text-sm md:text-base font-semibold'>К разделу "{categories[currentCategoryIndex + 1].title}"</p> 
            <ArrowRight color='white' size={20} />
            </button>
          </div>
            )
          }
      </div>
    </section>
    </>
  )
}

export default FilterPage
