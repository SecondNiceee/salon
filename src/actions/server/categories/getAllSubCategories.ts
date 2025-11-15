"use server"

import { getPayload } from "payload"
import config from "../../../payload.config"
import type { Category } from "@/payload-types"

export type SubCategoryWithParent = Category & {
  parentCategory?: Category
}

export const getAllSubCategories = async (): Promise<SubCategoryWithParent[]> => {
  try {
    const payload = await getPayload({ config })

    // Получить все подкатегории (те, у которых есть parent)
    const subCategoriesResult = await payload.find({
      collection: "categories",
      where: {
        parent: { exists: true },
      },
      depth: 2,
      limit: 0,
      sort: "createdAt",
    })

    return subCategoriesResult.docs as SubCategoryWithParent[]
  } catch (error) {
    console.error("Ошибка при получении всех подкатегорий:", error)
    return []
  }
}
