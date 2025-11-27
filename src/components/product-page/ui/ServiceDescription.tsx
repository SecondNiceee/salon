"use client"

import { RichText } from "@payloadcms/richtext-lexical/react"
import jsxConverters from "@/utils/jsx-converters"
import "@/styles/richText.scss"
import type { Product } from "@/payload-types"
import MemoRichText from "@/components/memo-rich-text/MemoRichText"

interface ServiceDescriptionProps {
  product: Product
}

const ServiceDescription = ({ product }: ServiceDescriptionProps) => {
  if (!product.description) {
    return null
  }

  return (
    <div className="px-3 py-6 sm:px-6 sm:py-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-4">Описание услуги</h3>
      <div className="rich-container bg-gray-50 rounded-lg p-4 sm:p-6">
        <MemoRichText data={product.description} />
      </div>
    </div>
  )
}

export default ServiceDescription
