import ErrorAlert from "@/components/error-alert/ErrorAlert"
import { routerConfig } from "@/config/router.config"
import { getProductById } from "@/actions/server/products/getProductById"
import type { Metadata } from "next"
import type { Category, Media } from "@/payload-types"
import ProductPageClient from "./prodcut-page-client"
import { ProductSchema } from "./productSchema"

export async function generateMetadata({
  searchParams,
  params,
}: {
  searchParams: Promise<{ id?: string }>
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { id } = await searchParams
  const { city: citySlug } = await params

  if (!id) {
    return {
      title: "Услуга не найдена",
      description: "Услуга не найдена",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  try {
    const response = await getProductById(id)
    const product = response.product

    if (!product || !product.category[0] || !product.subCategory) {
      return {
        title: "Услуга не найдена",
        description: "Запрашиваемая услуга не найдена",
        robots: {
          index: false,
          follow: false,
        },
      }
    }

    const { getCityBySlug } = await import("@/actions/server/cities/getCities")
    const { replaceCityVariables } = await import("@/utils/replaceCityVariables")
    const city = await getCityBySlug(citySlug)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

    const cityDeclensions = city
      ? {
          nominative: city.declensions.nominative,
          genitive: city.declensions.genitive,
          prepositional: city.declensions.prepositional,
        }
      : null

    const media = product.image as Media
    const category = product.category as Category[]
    const subCategory = product.subCategory as Category

    const processedSeoTitle = replaceCityVariables(product.pageTitle || product.title, cityDeclensions)
    const processedDescription = product.description
      ? replaceCityVariables(product.description, cityDeclensions)
      : `Забронировать ${processedSeoTitle} в салоне красоты Академия профессионального образования. ${(category[0] as Category).title || ""} ${subCategory.title || ""}`

    return {
      title: processedSeoTitle,
      description: processedDescription,
      keywords: [processedSeoTitle, category[0].title || "", subCategory.title || "", "забронировать", "запись онлайн"],
      alternates: {
        canonical: siteUrl ? `${siteUrl}/${citySlug}/product?id=${id}` : undefined,
      },
      openGraph: {
        title: `${processedSeoTitle} | Академия профессионального образования`,
        description: processedDescription,
        images: media?.url
          ? [
              {
                url: media.url,
                width: 800,
                height: 600,
                alt: media.alt || processedSeoTitle,
              },
            ]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: processedSeoTitle,
        description: processedDescription,
        images: media?.url ? [media.url] : [],
      },
    }
  } catch (error) {
    return {
      title: "Ошибка загрузки услуги",
      description: "Не удалось загрузить информацию об услуге",
      robots: {
        index: false,
        follow: false,
      },
    }
  }
}

export default async function ProductPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ id?: string }>
  params: Promise<{ city: string }>
}) {
  const { id } = await searchParams
  const { city: citySlug } = await params

  if (!id) {
    return (
      <ErrorAlert buttonAction={() => (window.location.href = `/${citySlug}/${routerConfig.home}`)} errorMessage="Услуга не найдена" />
    )
  }

  try {
    const product = await getProductById(id)

    if (!product?.product) {
      return (
        <ErrorAlert
          buttonAction={() => (window.location.href = `${citySlug}/${routerConfig.home}`)}
          errorMessage="Услуга не найдена или была удалена"
        />
      )
    }

    const { getCityBySlug } = await import("@/actions/server/cities/getCities")
    const city = await getCityBySlug(citySlug)

    return (
      <>
        <ProductSchema product={product.product} />
        <ProductPageClient product={product.product} productId={id} city={city} />
      </>
    )
  } catch (error) {
    return <ErrorAlert buttonAction={() => window.location.reload()} errorMessage="Не удалось загрузить услугу" />
  }
}
