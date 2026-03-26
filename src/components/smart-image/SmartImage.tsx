import { fixPayloadUrl } from "@/utils/fixPayloadUrl"
import Image from "next/image"

interface SmartImageProps {
  src: string
  alt?: string
  width: number
  height: number
  className?: string
  loading?: "eager" | "lazy"
  priority?: boolean
  sizes?: string
  quality?: number
  onLoad?: () => void
  onError?: () => void
}

export default function SmartImage({
  src,
  alt = "Изображение",
  width,
  height,
  className = "w-full h-full object-cover",
  loading = "lazy",
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px",
  quality = 65, // Сжатие по умолчанию 65% для быстрой загрузки
  onLoad,
  onError,
}: SmartImageProps) {
  const finalSrc = src || "/placeholder.svg"

  return (
    <Image
      src={fixPayloadUrl(finalSrc) || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? undefined : loading}
      priority={priority}
      sizes={sizes}
      quality={quality}
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
      onLoad={onLoad}
      onError={onError}
    />
  )
}
