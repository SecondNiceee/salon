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
    <div className={`rich-imageWithTextBlok flex flex-col gap-6 ${layoutClasses}`}>
      {/* Изображение */}
      <div className="w-full aspect-video rounded-lg overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image.alt || ""}
            width={800}        // обязательно при fill={false}
            height={450}       // обязательно при fill={false}
            className="w-full h-full object-cover"
            quality={90}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Нет изображения
          </div>
        )}
      </div>

      {/* Текст */}
      <div className="w-full shadow-lg rounded-lg p-1 md:p-4">
        <RichText data={text} />
      </div>
    </div>
  )
}