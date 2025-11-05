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
  const { id } = await searchParams;
  

  if (!id) {
    return {
      title: "Товар не найден",
      description: "Товар не найден",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  try {
    const response = await getProductById(id);
    const product = response.product;

    if (!product || !product.category[0] || !product.subCategory) {
      return {
        title: "Товар не найден",
        description: "Запрашиваемый товар не найден",
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
        `Купить ${product.title} в ГрандБАЗАР с доставкой. ${(category[0] as Category).title || ""} ${(subCategory.title) || ""}`,
      keywords: [product.title, category[0].title || "", subCategory.title || "", "купить", "доставка"],
      openGraph: {
        title: `${product.title} | ГрандБАЗАР`,
        description: product.description || `Купить ${product.title} с доставкой`,
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
        description: product.description || `Купить ${product.title} с доставкой`,
        images: media?.url ? [media.url] : [],
      },
    }
  } catch (error) {
    return {
      title: "Ошибка загрузки товара",
      description: "Не удалось загрузить информацию о товаре",
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
    return <ErrorAlert buttonAction={() => (window.location.href = routerConfig.home)} errorMessage="Товар не найден" />
  }

  try {
    const product = await getProductById(id)

    if (!product?.product) {
      return (
        <ErrorAlert
          buttonAction={() => (window.location.href = routerConfig.home)}
          errorMessage="Товар не найден или был удален"
        />
      )
    }

    return <>
    <ProductSchema product={product.product} />
    <ProductPageClient product={product.product} productId={id} />
    </>
  } catch (error) {
    return <ErrorAlert buttonAction={() => window.location.reload()} errorMessage="Не удалось загрузить товар" />
  }
}
