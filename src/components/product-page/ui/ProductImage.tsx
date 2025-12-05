import SmartImage from '@/components/smart-image/SmartImage'
import { Media, Product } from '@/payload-types'
import React from 'react'

const ProductImage = ({ product }: { product: Product }) => {
  return (
    <div className="aspect-square shadow-lg relative overflow-hidden rounded-2xl bg-gray-50">
      <SmartImage
        src={(product.image as Media)?.url || '/placeholder.svg'}
        alt={(product.image as Media)?.alt || product.title}
        width={500}
        loading="lazy"
        height={500}
        className="object-cover w-full h-full"
       />
    </div>
  )
}

export default ProductImage
