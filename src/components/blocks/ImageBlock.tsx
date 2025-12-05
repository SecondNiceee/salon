import type React from "react"
import { Media } from "@/payload-types"

interface ImageBlockProps {
  image: Media,
}

export const ImageBlock: React.FC<ImageBlockProps> = ({ image }) => {
  return (
    <div className="relative w-full h-auto">
      <img className="w-full object-cover h-auto my-5"  src={image.url || ""} alt={image.alt} />
    </div>
  )
}
