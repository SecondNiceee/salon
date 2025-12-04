import type { Metadata } from "next"
import { getSubCategoryWithProducts } from "@/actions/server/products/getSubCategoryWithProducts"
import { getCityBySlug } from "@/actions/server/cities/getCities"
import { replaceCityVariables } from "@/utils/replaceCityVariables"
import SubCategoryClientPage from "./client-page"
import { notFound } from "next/navigation"
import { getCachedSubCategoryContent } from "@/actions/server/getHomeContent"
import { getSubCategoryBySlug } from "@/actions/server/products/getSubCategoryBySlug"

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
    : {
        nominative: "Москва",
        genitive: "Москвы",
        prepositional: "Москве",
      }

  // Используем SEO поля с заменой переменных города
  const title = data.subCategory.seoTitle
    ? replaceCityVariables(data.subCategory.seoTitle, cityDeclensions)
    : data.subCategory.title

  const description = data.subCategory.seoDescription
    ? replaceCityVariables(data.subCategory.seoDescription, cityDeclensions)
    : `Каталог товаров в категории ${data.subCategory.title}`

  const currentUrl = `${process.env.NEXT_PUBLIC_URL}/${citySlug}/${subcategorySlug}`

  return {
    title,
    description,
    keywords: [
      data.subCategory.title,
      `${data.subCategory.title} ${city?.declensions.nominative || ""}`,
      "салон красоты",
      "Академия профессионального образования",
      city?.declensions.nominative || "",
    ],
    authors: [{ name: "Академия профессионального образования" }],
    creator: "Академия профессионального образования",
    publisher: "Академия профессионального образования",
    alternates: {
      canonical: currentUrl,
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: currentUrl,
      siteName: "Академия профессионального образования",
      title: title as string,
      description: description,
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_URL}/api/media/file/face-massage.png`,
          width: 630,
          height: 630,
          alt: `Академия профессионального образования ${cityDeclensions?.nominative}. Записаться на массаж, спа и косметологию ${cityDeclensions?.prepositional}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: title as string,
      description: description,
      images: [`${process.env.NEXT_PUBLIC_URL}/api/media/file/face-massage.png`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// SubCategoryPage (server component)
export default async function SubCategoryPage({ params }: Props) {
  const { subcategorySlug, city: citySlug } = await params

  // Только базовая проверка существования подкатегории (легкий запрос)
  const subCategory = await getSubCategoryBySlug(subcategorySlug)
  if (!subCategory) notFound()

  // Эти запросы быстрые - только city и richText контент
  const city = await getCityBySlug(citySlug)
  const { processedContent, processedContentAfter } = await getCachedSubCategoryContent(subcategorySlug, city)

  return (
    <SubCategoryClientPage
      subcategorySlug={subcategorySlug}
      citySlug={citySlug}
      initialCity={city}
      processedContent={processedContent}
      processedContentAfter={processedContentAfter}
    />
  )
}
