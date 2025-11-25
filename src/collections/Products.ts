import { HeaderBlock } from "@/lib/payload-blocks/HeaderBlock"
import { ImageBlock } from "@/lib/payload-blocks/ImageBlock"
import { ListBlock } from "@/lib/payload-blocks/ListBlock"
import { TextBlock } from "@/lib/payload-blocks/TextBlock"
import { TextWithImageBlock } from "@/lib/payload-blocks/TextWithImageBlock"
import { isAccess } from "@/utils/accessUtils"
import { lexicalEditor, BlocksFeature, HeadingFeature } from "@payloadcms/richtext-lexical"
import { revalidateTag } from "next/cache"
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
    afterChange: [
      ({}) => {
        revalidateTag("categories_and_products")
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Название",
      required: true,
      admin: {
        description:
          "Название услуги. Поддерживает переменные города для автоматической замены: /city (Москва), /city/r (Москвы), /city/p (в Москве).",
      },
    },
    {
      name: "pageTitle",
      type: "text",
      label: "Название для страницы и SEO",
      required: false,
      admin: {
        description:
          "Название услуги на странице услуги и в SEO метаданных. Поддерживает переменные города: /city (Москва), /city/r (Москвы), /city/p (в Москве).",
      },
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
      filterOptions: ({ data }) => {
        if (!data?.category || data.category.length === 0) {
          return {
            parent: { exists: true },
          }
        }

        const categoryId = Array.isArray(data.category) ? data.category[0] : data.category
        return {
          parent: { equals: categoryId },
        }
      },
      admin: {
        description: "Выберите подкатегорию",
      },
    },
    {
      name: "image",
      type: "upload",
      label: "Фотография",
      relationTo: "media",
      required: false,
      admin: {
        description: "Загрузите основное изображение товара (необязательно)",
      },
    },
    {
      name: "description",
      type: "text",
      label: "Описание товара",
      admin: {
        description:
          "Описание для SEO. Также поддерживает переменные города: /city, /city/r, /city/p - они заменятся на город пользователя в соответствующем падеже.",
      },
      required: false,
    },
    {
      name: "hasProductPage",
      type: "checkbox",
      label: "Страничка товара",
      defaultValue: true,
      admin: {
        description:
          "Если включено, товар будет иметь отдельную страницу. Если выключено, при клике на товар сразу откроется форма бронирования.",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Содержание",
      required: false,
      admin: {
        condition: (data) => data.hasProductPage === true,
        description: "Доступно только когда включена страничка товара",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [HeaderBlock, ImageBlock, ListBlock, TextWithImageBlock, TextBlock],
          }),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
          }),
        ],
      }),
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
