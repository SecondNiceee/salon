"use server"

import { getPayload } from "payload"
import config from "../../../payload.config"
import type { Product } from "@/payload-types"

type Result = { product: Product; error: null } | { product: null; error: { message: string } }

export const getProductBySlug = async (slug: string): Promise<Result> => {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: "products",
      where: {
        slug: {
          equals: slug,
        },
      },
      depth: 2,
      limit: 1,
    })

    if (!result.docs || result.docs.length === 0) {
      return {
        product: null,
        error: { message: "Товар не найден" },
      }
    }

    return {
      product: result.docs[0],
      error: null,
    }
  } catch (error: unknown) {
    console.error(`[getProductBySlug] Ошибка при получении товара со slug ${slug}:`, error)

    return {
      product: null,
      error: { message: "Не удалось загрузить товар" },
    }
  }
}
