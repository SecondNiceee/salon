import type React from "react"
import { RichText } from "@payloadcms/richtext-lexical/react"
import jsxConverters from "@/utils/jsx-converters"

interface TextBlockProps {
  text: any // Rich text content from PayloadCMS
  size: "base" | "lg" | "xl" | "2xl" | "3xl"
}

export const TextBlock: React.FC<TextBlockProps> = ({ text, size }) => {
//   const sizeClasses = {
//     base: "text-base",
//     lg: "text-base md:text-lg",
//     xl: "text-base md:text-lg lg:text-xl",
//     "2xl": "text-lg md:text-xl lg:text-2xl",
//     "3xl": "text-xl md:text-2xl lg:text-3xl",
//   }

  return (
    <div className="text-block-wrapper" data-text-size={size}>
      <RichText converters={jsxConverters} data={text} />
    </div>
  )
}
