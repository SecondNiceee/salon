import ErrorAlert from "@/components/error-alert/ErrorAlert"
import { routerConfig } from "@/config/router.config"
import { getProductById } from "@/actions/server/products/getProductById"
import type { Metadata } from "next"
import type { Category, Media } from "@/payload-types"
import ProductPageClient from "./prodcut-page-client"
import { ProductSchema } from "./productSchema"

export async function generateMetadata({
  searchParams,
}: { searchParams: Promise<{ id?: string }> }): Promise<Metadata> {
  const { id } = await searchParams

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

    const media = product.image as Media
    const category = product.category as Category[]
    const subCategory = product.subCategory as Category

    return {
      title: product.title,
      description:
        product.description ||
        `Забронировать ${product.title} в салоне красоты Академия Спа. ${(category[0] as Category).title || ""} ${subCategory.title || ""}`,
      keywords: [product.title, category[0].title || "", subCategory.title || "", "забронировать", "запись онлайн"],
      openGraph: {
        title: `${product.title} | Академия Спа`,
        description: product.description || `Забронировать ${product.title} в Академия Спа`,
        images: media?.url
          ? [
              {
                url: media.url,
                width: 800,
                height: 600,
                alt: media.alt || product.title,
              },
            ]
          : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description || `Забронировать ${product.title} в Академия Спа`,
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

export default async function ProductPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams

  if (!id) {
    return (
      <ErrorAlert buttonAction={() => (window.location.href = routerConfig.home)} errorMessage="Услуга не найдена" />
    )
  }

  try {
    const product = await getProductById(id)

    if (!product?.product) {
      return (
        <ErrorAlert
          buttonAction={() => (window.location.href = routerConfig.home)}
          errorMessage="Услуга не найдена или была удалена"
        />
      )
    }

    return (
      <>
        <ProductSchema product={product.product} />
        <ProductPageClient product={product.product} productId={id} />
      </>
    )
  } catch (error) {
    return <ErrorAlert buttonAction={() => window.location.reload()} errorMessage="Не удалось загрузить услугу" />
  }
}
