"use server"
import { getPayload } from "payload"
import config from "@payload-config"
import type { Category, Product } from "@/payload-types"

type CategoryWithProducts = {
  category: Category
  products: Product[]
  productsCounter: number
}

export const getCategoriesWithProducts = async (): Promise<CategoryWithProducts[]> => {
  try {
    const payload = await getPayload({ config })

    // Шаг 1: Получить основные категории (без родителя)
    const categoriesResult = await payload.find({
      collection: "categories",
      where: {
        parent: { exists: false },
      },
      sort: "createdAt",
      limit: 0, // Все категории
      depth: 1,
      select: {
        coverImage: true,
        icon: true,
        title: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    // Шаг 2: Для каждой категории — получить до 6 товаров и общее количество
    const result = await Promise.all(
      categoriesResult.docs.map(async (category) => {
        // Получаем до 6 товаров
        const productsResult = await payload.find({
          collection: "products",
          where: {
            category: { equals: category.id },
          },
          sort: "createdAt",
          limit: 6,
          depth: 1,
          select: {
            averageRating: true,
            image: true,
            price: true,
            title: true,
            weight: true,
            reviewsCount: true,
          },
        })

        // Считаем общее количество товаров в категории
        const productCounter = await payload.count({
          collection: "products",
          where: {
            category: { equals: category.id },
          },
        })

        return {
          category,
          products: productsResult.docs as Product[],
          productsCounter: productCounter.totalDocs,
        }
      }),
    )

    return result
  } catch (error) {
    console.error("Ошибка при загрузке категорий с товарами:", error)
    return []
  }
}
