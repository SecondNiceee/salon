import jsxConverters from "@/utils/jsx-converters"
import { RichText } from "@payloadcms/richtext-lexical/react"
import type React from "react"

interface BoxContentBlockProps {
  content: any // Rich text content from PayloadCMS
}

export const BoxContentBlock: React.FC<BoxContentBlockProps> = ({ content }) => {
  return (
    <div className="box-content-block bg-white rounded-lg shadow-md p-6 md:p-8">
      <RichText converters={jsxConverters} data={content} />
    </div>
  )
}
