"use server"

import { getPayload } from "payload"
import config from "../../../payload.config"
import type { Category, Product } from "@/payload-types"

export type SubCategoryWithProducts = {
  subCategory: Category
  products: Product[]
  nextSubCategory: Category | null
  prevSubCategory: Category | null
}

export const getSubCategoryWithProducts = async (subcategorySlug: string): Promise<SubCategoryWithProducts | null> => {
  try {
    const payload = await getPayload({ config })

    // 1. Найти подкатегорию по slug (value)
    const subCategoryResult = await payload.find({
      collection: "categories",
      where: {
        value: { equals: subcategorySlug },
        parent: { exists: true }, // Убеждаемся, что это подкатегория
      },
      limit: 1,
      depth: 2,
    })

    console.log(subCategoryResult)
    if (!subCategoryResult.docs.length) {
      return null
    }


    const subCategory = subCategoryResult.docs[0]

    // 2. Получить все подкатегории с тем же parent (для навигации)
    const allSubCategories = await payload.find({
      collection: "categories",
      where: {
        parent: { equals: (subCategory.parent as Category).id },
      },
      sort: "createdAt",
    });


    // 3. Найти текущий индекс и определить следующую/предыдущую подкатегорию
    const currentIndex = allSubCategories.docs.findIndex((cat) => cat.id === subCategory.id)

    const nextSubCategory =
      currentIndex < allSubCategories.docs.length - 1 ? allSubCategories.docs[currentIndex + 1] : null

    const prevSubCategory = currentIndex > 0 ? allSubCategories.docs[currentIndex - 1] : null

    // 4. Получить продукты этой подкатегории
    const productsResult = await payload.find({
      collection: "products",
      where: {
        subCategory: { equals: subCategory.id },
      },
      depth: 1,
      limit: 0,
      sort: "createdAt",
      select: {
        averageRating: true,
        image: true,
        price: true,
        title: true,
        weight: true,
        reviewsCount: true,
      },
    })

    return {
      subCategory,
      products: productsResult.docs,
      nextSubCategory,
      prevSubCategory,
    }
  } catch (error) {
    console.error("Ошибка при получении подкатегории и товаров:", error)
    return null
  }
}
