import type { Product } from "@/payload-types"
import { isAccess } from "@/utils/accessUtils"
import type { CollectionConfig } from "payload"

const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "title",
    group: "Категории, подкатегории, товары",
  },
  access: {
    read: () => true,
    create: isAccess("products"),
    update: isAccess("products"),
    delete: isAccess("products"),
  },

  hooks: {
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Название",
      required: true,
    },
    {
      name: "price",
      type: "number",
      label: "Цена",
      required: true,
      min: 1,
      validate: (val: any) => {
        if (typeof val !== "number") {
          return "Цена неверный формат."
        }
        if (!val || val <= 0) return "Цена должна быть больше 0"
        if (val > 1000000) return "Цена не может превышать 1,000,000 ₽"
        return true
      },
    },

    {
      name: "category",
      type: "relationship",
      label: "Категория",
      relationTo: "categories",
      required: true,
      hasMany: true,
      admin: {
        description: "Выберите только категорию, без подкатегорий",
      },
      filterOptions: () => {
        return {
          parent: { exists: false },
        }
      },
    },
    {
      name: "subCategory",
      type: "relationship",
      label: "Подкатегория",
      relationTo: "categories",
      required: true,
      hasMany: false,
      // Показывать только категории, у которых задан parent
      filterOptions: () => ({
        parent: { exists: true },
      }),
      admin: {
        description: "Выберите подкатегорию",
      },
    },
    {
      name: "image",
      type: "upload",
      label: "Фотография",
      relationTo: "media",
      required: true,
      admin: {
        description: "Загрузите основное изображение товара",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание товара",
      required: false,
    },
    {
      name: "recommendedProducts",
      type: "relationship",
      label: "Рекомендованные услуги(будут ниже указываться)",
      relationTo: "products",
      hasMany: true,
      required: false,
    },
    {
      name: "averageRating",
      type: "number",
      label: "Средний рейтинг",
      defaultValue: 0,
      min: 0,
      max: 5,
      admin: {
        readOnly: true,
        description: "Обновляется автоматически при добавлении отзыва",
      },
    },
    {
      name: "reviewsCount",
      type: "number",
      label: "Количество отзывов",
      defaultValue: 0,
      min: 0,
      admin: {
        readOnly: true,
      },
    },
  ],
}

export default Products
