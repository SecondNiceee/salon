"use client"

import React, { useCallback, useEffect } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Media } from "@/payload-types"
import { Button } from "@/components/ui/button"
import { fixPayloadUrl } from "@/utils/fixPayloadUrl"

interface ImageSliderBlockProps {
  images: { id: string; image: Media; caption?: string }[]
  autoplay?: boolean
  autoplayDelay?: number
  showArrows?: boolean
  showDots?: boolean
}

export const ImageSliderBlock: React.FC<ImageSliderBlockProps> = ({
  images,
  autoplay = false,
  autoplayDelay = 3000,
  showArrows = true,
  showDots = true,
}) => {
  const autoplayPlugin = autoplay
    ? Autoplay({ delay: autoplayDelay, stopOnInteraction: true })
    : undefined

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, autoplayPlugin ? [autoplayPlugin] : [])
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  if (!images || images.length === 0) return null

  return (
    <div className="relative my-8 w-full group">
      <div className="overflow-hidden rounded-3xl shadow-xl" ref={emblaRef}>
        <div className="flex">
          {images.map((imgData, index) => (
            <div key={imgData.id || index} className="flex-[0_0_100%] relative">
              <div className="relative w-full bg-muted h-[600px] max-h-[600px]">
                <Image
                  src={fixPayloadUrl(imgData.image.url) || "/placeholder.svg"}
                  alt={imgData.image.alt || imgData.caption || `Slide ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
                {imgData.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <p className="text-white text-sm md:text-base font-medium text-center">
                      {imgData.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showArrows && images.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-lg h-10 w-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-900" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full shadow-lg h-10 w-10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-900" />
          </Button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-gray-900"
                  : "w-2 bg-gray-400 hover:bg-gray-600"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
