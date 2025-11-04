import type { Media } from "@/payload-types"
import Image from "next/image"
import type { FC } from "react"

interface IArticle {
  bg: Media
  title: string
}
const Article: FC<IArticle> = ({ bg, title }) => {
  return (
    <div className="w-full p-2 flex flex-col rounded-xl gap-2 bg-gray-100 shadow-lg">
      <Image
        className="w-full rounded-xl"
        width={200}
        height={200}
        src={String(bg.url) || "/placeholder.svg"}
        alt={bg.alt}
      />
      <h5 className="md:text-lg text-base font-semibold">{title}</h5>
    </div>
  )
}

export default Article
