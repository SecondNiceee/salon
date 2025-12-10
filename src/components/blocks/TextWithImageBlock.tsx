"use client"

import type React from "react"
import Image from "next/image"
import type { Media } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"
import { fixPayloadUrl } from "@/utils/fixPayloadUrl"

interface TextWithImageBlockProps {
  text: any
  image: Media | null | undefined
  imagePosition: "left" | "right"
}

export const TextWithImageBlock: React.FC<TextWithImageBlockProps> = ({ text, image, imagePosition }) => {
  const imageUrl = image?.url ? fixPayloadUrl(image.url) : null

  const layoutClasses = imagePosition === "right" ? "lg:flex-row-reverse" : "lg:flex-row"

  return (
    <div className={`rich-imageWithTextBlok flex flex-col gap-6 items-stretch ${layoutClasses}`}>
      {/* Изображение - теперь растягивается по высоте текста */}
      <div className="w-full lg:w-1/2 rounded-lg overflow-hidden bg-muted relative min-h-[250px]">
        {imageUrl ? (
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={image.alt || ""}
            fill
            className="object-cover"
            quality={90}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">Нет изображения</div>
        )}
      </div>

      {/* Текст */}
      <div className="w-full lg:w-1/2 shadow-lg rounded-lg p-1 md:p-4">
        <RichText data={text} />
      </div>
    </div>
  )
}
