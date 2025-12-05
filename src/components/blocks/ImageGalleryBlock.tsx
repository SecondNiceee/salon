import type React from "react"
import Image from "next/image"
import type { Media } from "@/payload-types"
import { fixPayloadUrl } from "@/utils/fixPayloadUrl"

interface ImageGalleryBlockProps {
  imagesData: {id : string, image : Media, description?: string}[], // Added description to type
  columns?: 2 | 3 | 4
}

export const ImageGalleryBlock: React.FC<ImageGalleryBlockProps> = ({ imagesData, columns = 3 }) => {
  const getGridClasses = () => {
    switch (Number(columns)) {
      case 2:
        return "grid-cols-1 md:grid-cols-2"
      case 3:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      case 4:
        return "grid-cols-2 md:grid-cols-4"
      default:
        return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    }
  }

  return (
      <div className={`grid my-5 ${getGridClasses()} gap-4`}>
        {imagesData.map((imgData, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-md bg-card group">
              <Image
                src={fixPayloadUrl(imgData.image.url) || "/placeholder.svg"}
                alt={imgData.image.alt || `Gallery image ${index + 1}`}
                fill
                className="object-cover transition-all duration-300 group-hover:scale-110 group-hover:brightness-110"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              /> 
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
            </div>
            {imgData.description && (
              <p className="text-sm text-muted-foreground text-center px-2">
                {imgData.description}
              </p>
            )}
          </div>
        ))}
      </div>
  )
}
