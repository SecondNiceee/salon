"use client"

import type React from "react"
import { RichText } from "@payloadcms/richtext-lexical/react"
import jsxConverters from "@/utils/jsx-converters"
import { useState } from "react"

interface AccordionBlockProps {
  title: any // Rich text content from PayloadCMS
  content: any // Rich text content from PayloadCMS
}

export const AccordionBlock: React.FC<AccordionBlockProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="accordion-block border border-gray-200 rounded-lg overflow-hidden my-4">
      <div className="accordion-header relative flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 gap-3 min-h-[72px]">
        <div className="accordion-title flex-1 text-center sm:text-left">
          <RichText converters={jsxConverters} data={title} />
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="accordion-button relative z-10 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap w-full sm:w-auto flex-shrink-0"
        >
          {isOpen ? "Скрыть" : "Читать"}
        </button>
      </div>

      <div
        className={`accordion-content transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4 border-t border-gray-200">
          <RichText converters={jsxConverters} data={content} />
        </div>
      </div>
    </div>
  )
}
