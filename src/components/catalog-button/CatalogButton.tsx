"use client"
import { Button } from "../ui/button"
import Image from "next/image"
import { useCatalogStore } from "@/entities/catalog/catalogStore"

const CatalogButton = () => {
  const { setPopupCatalogOpened } = useCatalogStore()
  return (
    <Button
      onClick={() => {
        setPopupCatalogOpened(true)
      }}
      variant="outline"
      className="flex h-[53.6px] sm:h-auto md:h-10 lg:h-11 md:min-w-[140px] lg:min-w-[230px] justify-start md:justify-center items-center gap-2 bg-transparent hover:bg-gray-50 transition-colors"
    >
      <Image
        alt="Каталог услуг"
        width={24}
        height={24}
        src={"/catalog.svg"}
        className="lg:w-[30px] lg:min-w-[30px] lg:h-[30px] my-0"
      />
      <span className="text-sm font-medium block md:block lg:block">Каталог</span>
    </Button>
  )
}

export default CatalogButton
