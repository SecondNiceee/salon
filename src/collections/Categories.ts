// src/collections/Categories.ts
import { isAccess } from "@/utils/accessUtils"
import type { CollectionConfig } from "payload"
import { lexicalEditor, HeadingFeature, BlocksFeature } from "@payloadcms/richtext-lexical"
import { HeaderBlock } from "@/lib/payload-blocks/HeaderBlock"
import { ImageBlock } from "@/lib/payload-blocks/ImageBlock"
import { PararaphBlock } from "@/lib/payload-blocks/ParagraphBlock"
import { TextWithImageBlock } from "@/lib/payload-blocks/TextWithImageBlock"
import { ImageGalleryBlock } from "@/lib/payload-blocks/ImageGalleryBlock"
import { ContactsBlock } from "@/lib/payload-blocks/ContactsBlock"
import { TextBlock } from "@/lib/payload-blocks/TextBlock"
import { BoxContentBlock } from "@/lib/payload-blocks/BoxContentBlock"
import { AccordionBlock } from "@/lib/payload-blocks/AccordionBlock"
import { BookingButtonBlock } from "@/lib/payload-blocks/BookingButtonBlock"
import { IconCardsBlock } from "@/lib/payload-blocks/IconCardsBlock"
import { ImageSliderBlock } from "@/lib/payload-blocks/ImageSliderBlock"
import { revalidateTag } from "next/cache"

const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "title",
    group: "Категории, подкатегории, товары",
    defaultColumns: ["title", "parent", "value", "order"],
  },
  access: {
    create: isAccess("categories"),
    read: () => true,
    update: isAccess("categories"),
    delete: isAccess("categories"),
  },
  hooks: {
    afterChange: [
      ({}) => {
        revalidateTag("categories")
        revalidateTag("categories_and_products");
      },
    ],
  },
  fields: [
    {
      name: "value",
      type: "text",
      unique: true,
      label: "Уникальный ключ (label)",
      required: true,
      index: true,
      admin: {
        description:
          "Уникальное значение (английское) для категории. Используется внутри кода. ДОЛЖНО БЫТЬ ОДНО СЛОВО! НЕЛЬЗЯ ПРОБЕЛОВ",
      },
      validate: (value: unknown) => {
        if (typeof value !== "string") {
          return "Значение должно быть строкой"
        }
        if (!value) return true // required: true уже проверит

        const regex = /^[a-z0-9_-]+$/
        if (!regex.test(value)) {
          return "Только латинские буквы, цифры, дефис (-) и подчёркивание (_)"
        }
        if (value.includes(" ")) {
          return "Нельзя использовать пробелы"
        }
        if (value.length < 1) {
          return "Минимум 1 символ"
        }
        return true
      },
    },
    {
      name: "title",
      type: "text",
      label: "Название",
      required: true,
    },
    {
      name: "order",
      type: "number",
      label: "Порядок сортировки",
      required: false,
      defaultValue: 0,
      admin: {
        description: "Чем меньше число, тем выше в списке. По умолчанию 0. Можно использовать отрицательные числа.",
        position: "sidebar",
      },
    },
    {
      name: "parent",
      type: "relationship",
      label: "Родительская категория",
      relationTo: "categories",
      required: false,
      admin: {
        description: "Если не выбрано — это основная категория",
      },
      filterOptions: {
        parent: {
          exists: false,
        },
      },
    },

    // Иконка — только для родительских категорий
    {
      name: "icon",
      type: "upload",
      label: "Иконка",
      relationTo: "media",
      required: false,
      admin: {
        condition: (_, { parent }) => !parent, // Только если НЕТ родителя
        description: "Иконка нужна только для основных категорий",
      },
    },

    // Обложка — только для подкатегорий (если есть parent)
    {
      name: "coverImage",
      type: "upload",
      label: "Обложка подкатегории",
      relationTo: "media",
      required: false,
      admin: {
        condition: (_, { parent }) => Boolean(parent), // Показывать, только если ЕСТЬ родитель
        description: "Загрузите обложку для подкатегории (видны в каталоге)",
      },
    },

    {
      name: "seoTitle",
      type: "text",
      label: "SEO Title",
      required: false,
      admin: {
        condition: (_, { parent }) => Boolean(parent),
        description:
          "SEO заголовок для подкатегории. Поддерживает переменные города: /city (именительный), /city/r (родительный), /city/p (предложный)",
      },
    },
    {
      name: "seoDescription",
      type: "textarea",
      label: "SEO Description",
      required: false,
      admin: {
        condition: (_, { parent }) => Boolean(parent),
        description: "SEO описание для подкатегории. Поддерживает переменные города: /city, /city/r, /city/p",
      },
    },

    {
      name: "content",
      type: "richText",
      label: "Описание (Rich Text)",
      required: false,
      admin: {
        condition: (_, { parent }) => Boolean(parent),
        description:
          "Подробное описание подкатегории с форматированием. Поддерживает переменные города: /city (именительный: Москва), /city/r (родительный: Москвы), /city/p (предложный: в Москве)",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              HeaderBlock,
              ImageBlock,
              PararaphBlock,
              TextWithImageBlock,
              ImageGalleryBlock,
              TextBlock,
              BoxContentBlock,
              AccordionBlock,
              BookingButtonBlock,
              IconCardsBlock,
              ImageSliderBlock,
            ],
          }),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
          }),
        ],
      }),
    },
    {
      name: "contentAfter",
      type: "richText",
      label: "Дополнительный контент (после товаров)",
      required: false,
      admin: {
        condition: (_, { parent }) => Boolean(parent),
        description:
          "Дополнительный контент, который будет отображаться после списка товаров. Поддерживает переменные города: /city, /city/r, /city/p",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              HeaderBlock,
              ImageBlock,
              PararaphBlock,
              TextWithImageBlock,
              ImageGalleryBlock,
              ContactsBlock,
              TextBlock,
              BoxContentBlock,
              AccordionBlock,
              BookingButtonBlock,
              IconCardsBlock,
              ImageSliderBlock,
            ],
          }),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
          }),
        ],
      }),
    },
  ],
}

export default Categories
