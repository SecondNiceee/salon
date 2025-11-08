import type React from "react"
import Image from "next/image"
import { Media } from "@/payload-types"
import { RichText } from "@payloadcms/richtext-lexical/react"

interface TextWithImageBlockProps {
  text: any // Rich text content
  image: Media,
  imagePosition: "left" | "right" 
}

export const TextWithImageBlock: React.FC<TextWithImageBlockProps> = ({ text, image, imagePosition }) => {
  const getLayoutClasses = () => {
    switch (imagePosition) {
      case "left":
        return "lg:flex-row"
      case "right":
        return "lg:flex-row-reverse"
  }
}

  return (
<div className={`rich-imageWithTextBlok flex flex-col gap-6 ${getLayoutClasses()}`}>
  {/* Картинка — сверху на мобильных */}
  <div className="w-full h-auto image-container">
    <div className="relative w-full h-full aspect-video rounded-lg overflow-hidden">
      <Image
        src={image.url || "/placeholder.svg"}
        alt={image.alt || ""}
        fill
        className="object-cover h-full"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  </div>

  {/* Текст — снизу на мобильных */}
  <div style={{ height: 'stretch' }} className="w-full self-start flex justify-center items-center shadow-lg rounded-lg p-1 md:p-4">
    <RichText data={text} />
  </div>
</div>
  )
}
