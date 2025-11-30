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
      <div className="accordion-header relative flex flex-col sm:block p-4 bg-gray-50 gap-3">
        {/* Заголовок - центрирован на десктопе */}
        <div className="accordion-title  text-center mx-auto max-w-[1000px]">
          <RichText converters={jsxConverters} data={title} />
        </div>

          {/* Кнопка - абсолютная справа на десктопе, внизу на мобильных */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="accordion-button sm:absolute sm:right-4 sm:top-1/2 sm:-translate-y-1/2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 whitespace-nowrap w-full sm:w-auto mt-3 sm:mt-0"
        >
          {isOpen ? "Скрыть" : "Читать"}  
        </button>
      </div>

      <div
        className={`accordion-content grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 border-t border-gray-200">
            <RichText converters={jsxConverters} data={content} />
          </div>
        </div>
      </div>
    </div>
  )
}
