// src/actions/getCategoriesWithSubcategories.ts
"use server"

import { getPayload } from "payload"
import config from "../../../payload.config"
import type { Category } from "@/payload-types"
import { unstable_cache } from "next/cache"

export type CategoryWithSubs = {
  subCategories: Category[]
} & Category

const _getCategoriesWithSubs = async (): Promise<CategoryWithSubs[]> => {
  try {
    const payload = await getPayload({ config })

    // 1. Получаем основные категории (без родителя)
    const mainCategoriesResult = await payload.find({
      collection: "categories",
      where: {
        parent: { exists: false },
      },
      depth: 1,
      limit: 100,
      sort: "order",
    })

    // 2. Для каждой — получаем подкатегории
    const result = await Promise.all(
      mainCategoriesResult.docs.map(async (mainCat) => {
        const subCategoriesResult = await payload.find({
          collection: "categories",
          where: {
            parent: { equals: mainCat.id },
          },
          depth: 1,
          limit: 50,
          sort: "order",
        })

        return {
          ...mainCat,
          subCategories: subCategoriesResult.docs,
        }
      }),
    )
    return result
  } catch (error) {
    console.error("Ошибка при загрузке категорий с подкатегориями:", error)
    return []
  }
}

// Оборачиваем в unstable_cache с тегом и временем жизни 1 день (86400 секунд)
export const getCategoriesWithSubs = unstable_cache(
  _getCategoriesWithSubs,
  ["categories"], // ключ кэша (можно использовать для revalidateTag)
  {
    tags: ["categories"],
    revalidate: 60 * 60 * 24, // 1 день в секундах
  }
)