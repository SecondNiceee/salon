"use client"

import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useCallback, useEffect, useState, useRef } from "react"
import Autoplay from "embla-carousel-autoplay"
import { useSiteSettings } from "@/entities/siteSettings/SiteSettingsStore"
import type { Media } from "@/payload-types"
import { getTextColorClass } from "./utils/getTextColorClass"
import { getOverlayClass } from "./utils/getOverlayClass"
import { useRouter, usePathname } from "next/navigation"
import { ImageLoader } from "./image-loader"
import { Lobster, Comfortaa } from "next/font/google"
import SmartImage from "../smart-image/SmartImage"

// Fonts for the hero slider: stylish script title + rounded modern subtitle (both with Cyrillic)
const heroTitleFont = Lobster({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  display: "swap",
})

const heroSubtitleFont = Comfortaa({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  display: "swap",
})

export default function HeroSlider() {
  const siteSettings = useSiteSettings((state) => state.siteSettings)
  const slides = siteSettings?.slider?.slides || []
  const pathname = usePathname()
  const router = useRouter()

  const [imagesLoaded, setImagesLoaded] = useState<Record<number, boolean>>({})
  const [firstImageLoaded, setFirstImageLoaded] = useState(false)
  const [preloadImages, setPreloadImages] = useState(false)
  const [visibleSlides, setVisibleSlides] = useState(new Set([0]))
  const [cityDeclensions, setCityDeclensions] = useState<any>(null)

  const autoplayRef = useRef(Autoplay({ delay: 10000, stopOnInteraction: true }))

  useEffect(() => {
    const loadCity = async () => {
      try {
        const pathSegments = pathname.split("/").filter(Boolean)
        if (pathSegments.length === 0) {
          setCityDeclensions(null)
          return
        }

        const citySlug = pathSegments[0]
        const { getCityBySlug } = await import("@/actions/server/cities/getCities")
        const city = await getCityBySlug(citySlug)

        if (city) {
          setCityDeclensions({
            nominative: city.declensions.nominative,
            genitive: city.declensions.genitive,
            prepositional: city.declensions.prepositional,
          })
        }
      } catch (error) {
        console.error("[v0] Failed to load city:", error)
      }
    }

    loadCity()
  }, [pathname])

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      containScroll: "trimSnaps",
      skipSnaps: false,
      dragFree: false,
    },
    [autoplayRef.current],
  )

  const [prevBtnDisabled, setPrevBtnDisabled] = useState(false)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleImageLoad = useCallback((index: number) => {
    setImagesLoaded((prev) => {
      const newState = { ...prev, [index]: true }
      if (index === 0) {
        setFirstImageLoaded(true)
      }
      return newState
    })
  }, [])

  const handleImageError = useCallback((index: number) => {
    setImagesLoaded((prev) => {
      const newState = { ...prev, [index]: true }
      if (index === 0) {
        setFirstImageLoaded(true)
      }
      return newState
    })
  }, [])

  // Запускаем preload остальных изображений после загрузки первого
  useEffect(() => {
    if (firstImageLoaded && !preloadImages) {
      const timer = setTimeout(() => setPreloadImages(true), 200)
      return () => clearTimeout(timer)
    }
  }, [firstImageLoaded, preloadImages])

  // Обновляем видимые слайды при смене
  useEffect(() => {
    if (!emblaApi) return

    const updateVisibleSlides = () => {
      const currentIndex = emblaApi.selectedScrollSnap()
      const newVisibleSlides = new Set([currentIndex])

      // Добавляем соседние слайды для предзагрузки
      if (currentIndex > 0) newVisibleSlides.add(currentIndex - 1)
      if (currentIndex < slides.length - 1) newVisibleSlides.add(currentIndex + 1)

      setVisibleSlides(newVisibleSlides)
    }

    updateVisibleSlides()
    emblaApi.on("select", updateVisibleSlides)

    return () => {
      emblaApi.off("select", updateVisibleSlides)
    }
  }, [emblaApi, slides.length])

  // Предзагрузка при наведении на кнопки навигации
  const handleNavHover = useCallback(
    (direction: "prev" | "next") => {
      if (!emblaApi) return

      const currentIndex = emblaApi.selectedScrollSnap()
      let targetIndex: number

      if (direction === "prev") {
        targetIndex = currentIndex > 0 ? currentIndex - 1 : slides.length - 1
      } else {
        targetIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0
      }

      setVisibleSlides((prev) => new Set([...prev, targetIndex]))
    },
    [emblaApi, slides.length],
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      autoplayRef.current.reset()
      emblaApi.scrollPrev()
    }
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      autoplayRef.current.reset()
      emblaApi.scrollNext()
    }
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        autoplayRef.current.reset()
        emblaApi.scrollTo(index)
      }
    },
    [emblaApi],
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  if (!slides || slides.length === 0) {
    return null
  }

  if (!firstImageLoaded) {
    return (
      <section className="relative max-w-7xl mx-auto px-4 md:py-4 py-2 w-full overflow-hidden">
        <ImageLoader />
        <div className="hidden">
          {slides.map((slide, index) => {
            const imageUrl = (slide.image as Media).url
            if (index === 0) {
              return (
                <img
                  key={index}
                  src={imageUrl || "/placeholder.svg"}
                  alt={(slide.image as Media).alt}
                  onLoad={() => handleImageLoad(index)}
                  onError={() => handleImageError(index)}
                  loading="eager"
                />
              )
            }
            return null
          })}
        </div>
      </section>
    )
  }

  return (
    <section className="relative max-w-7xl mx-auto px-4 md:py-4 py-2 w-full overflow-hidden">
      <div className="embla w-full overflow-hidden" ref={emblaRef}>
        <div className="embla__container w-full flex">
          {slides.map((slide, index) => {
            const imageUrl = (slide.image as Media).url
            const titleColor = getTextColorClass(slide.titleColor || "white")
            const subtitleColor = getTextColorClass(slide.subtitleColor || "white")
            const hasContent = slide.title || slide.subtitle
            const overlayClass = getOverlayClass(slide.imageOverlay || "none")
            const clickHandler = () => {
              if (slide.link) router.push(slide.link)
            }

            const { replaceCityVariables } = require("@/utils/replaceCityVariables")
            const processedTitle = slide.title ? replaceCityVariables(slide.title, cityDeclensions) : ""
            const processedSubtitle = slide.subtitle ? replaceCityVariables(slide.subtitle, cityDeclensions) : ""

            const shouldLoadImage = index === 0 || preloadImages || visibleSlides.has(index)

            return (
              <div
                key={index}
                onClick={clickHandler}
                className="embla__slide cursor-pointer flex-[0_0_100%] min-w-0 relative"
              >
                <div className="relative w-full h-[150px] md:h-[200px] rounded-lg overflow-hidden">
                  {shouldLoadImage ? (
                    <>
                      <SmartImage
                        src={imageUrl || "/placeholder.svg"}
                        alt={(slide.image as Media).alt || "Изображение слайда"}
                        className="w-full h-full object-cover"
                        onLoad={() => handleImageLoad(index)}
                        onError={() => handleImageError(index)}
                        loading={index === 0 ? "eager" : "lazy"}
                        width={960}
                        height={300}
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                  {shouldLoadImage && !imagesLoaded[index] && (
                    <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {overlayClass && <div className={`absolute z-20 inset-0 rounded-lg ${overlayClass}`} />}

                {hasContent && (
                  <div className="absolute z-50 inset-0 flex items-center justify-start">
                    <div className="px-4 sm:px-6 md:px-12 max-w-4xl">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-8">
                        <div className="flex flex-col">
                          {processedTitle && (
                            <h2
                              className={`${heroTitleFont.className} text-3xl md:text-4xl lg:text-6xl font-bold mb-2 ${titleColor} leading-tight md:leading-[1.1] tracking-wider drop-shadow-2xl`}
                              style={{ fontFamily: heroTitleFont.style.fontFamily }}
                            >
                              {processedTitle}
                            </h2>
                          )}

                          {processedSubtitle && (
                            <p
                              className={`${heroSubtitleFont.className} text-base md:text-2xl lg:text-3xl font-normal mb-0 ${subtitleColor} max-w-2xl tracking-normal drop-shadow-2xl`}
                              style={{ fontFamily: heroSubtitleFont.style.fontFamily }}
                            >
                              {processedSubtitle}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Custom Navigation Arrows */}
      <button
        className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={scrollPrev}
        onMouseEnter={() => handleNavHover("prev")}
        disabled={prevBtnDisabled}
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform duration-200" />
      </button>

      <button
        className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={scrollNext}
        onMouseEnter={() => handleNavHover("next")}
        disabled={nextBtnDisabled}
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 md:h-6 md:w-6 text-white group-hover:scale-110 transition-transform duration-200" />
      </button>

      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 sm:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 border-2 ${
              index === selectedIndex
                ? "bg-white border-white shadow-lg shadow-white/50 scale-110"
                : "bg-white/30 border-white/50 hover:bg-white/50 hover:border-white/70 hover:scale-105"
            }`}
            onClick={() => scrollTo(index)}
          />
        ))}
      </div>
    </section>
  )
}
