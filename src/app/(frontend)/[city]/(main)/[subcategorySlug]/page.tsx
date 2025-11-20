import type { Metadata } from "next"
import { getSubCategoryWithProducts } from "@/actions/server/products/getSubCategoryWithProducts"
import { getCityBySlug } from "@/actions/server/cities/getCities"
import { replaceCityVariables } from "@/utils/replaceCityVariables"
import SubCategoryClientPage from "./client-page"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{ subcategorySlug: string; city: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { subcategorySlug, city: citySlug } = await params

  const data = await getSubCategoryWithProducts(subcategorySlug)
  const city = await getCityBySlug(citySlug)

  if (!data) {
    return {
      title: "Подкатегория не найдена",
      description: "Запрошенная подкатегория не найдена",
    }
  }

  const cityDeclensions = city
    ? {
        nominative: city.declensions.nominative,
        genitive: city.declensions.genitive,
        prepositional: city.declensions.prepositional,
      }
    : null

  // Используем SEO поля с заменой переменных города
  const title = data.subCategory.seoTitle
    ? replaceCityVariables(data.subCategory.seoTitle, cityDeclensions)
    : data.subCategory.title

  const description = data.subCategory.seoDescription
    ? replaceCityVariables(data.subCategory.seoDescription, cityDeclensions)
    : `Каталог товаров в категории ${data.subCategory.title}`

  return {
    title,
    description,
  }
}

export default async function SubCategoryPage({ params }: Props) {
  const { subcategorySlug, city: citySlug } = await params

  const data = await getSubCategoryWithProducts(subcategorySlug)

  if (!data) {
    notFound()
  }

  const city = await getCityBySlug(citySlug)

  return (
    <SubCategoryClientPage
      initialData={data}
      subcategorySlug={subcategorySlug}
      citySlug={citySlug}
      initialCity={city}
    />
  )
}
