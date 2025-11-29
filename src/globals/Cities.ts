import { revalidateTag } from "next/cache"
import type { GlobalConfig } from "payload"

export const Cities: GlobalConfig = {
  slug: "cities",
  access: {
    read: () => true,
    update: () => true,
  },
  admin: {
    group: "Настройки сайта",
    description: "Управление городами на сайте. Города используются в URL (например, /moscow/, /piter/)",
  },
  hooks: {
    afterChange: [
      ({}) => {
        revalidateTag("cities")
      },
    ],
  },
  fields: [
    {
      name: "cities",
      type: "array",
      label: "Города",
      required: false,
      admin: {
        description: "Список всех городов, доступных на сайте",
      },
      fields: [
        {
          name: "name",
          type: "text",
          label: "Название города",
          required: true,
          admin: {
            description: "Полное название города (например, Москва, Санкт-Петербург)",
          },
        },
        {
          name: "slug",
          type: "text",
          label: "URL slug",
          required: true,
          unique: true,
          index: true,
          admin: {
            description:
              "Уникальный идентификатор для URL (например, moscow, piter). Только латинские буквы, без пробелов",
          },
          validate: (value: unknown) => {
            if (typeof value !== "string") {
              return "Значение должно быть строкой"
            }
            if (!value) return true

            const regex = /^[a-z0-9-]+$/
            if (!regex.test(value)) {
              return "Только латинские буквы в нижнем регистре, цифры и дефис (-)"
            }
            if (value.includes(" ")) {
              return "Нельзя использовать пробелы"
            }
            if (value.length < 2) {
              return "Минимум 2 символа"
            }
            return true
          },
        },
        {
          name: "declensions",
          type: "group",
          label: "Склонения",
          admin: {
            description: "Склонения названия города для правильного испо  льзования в тексте",
          },
          fields: [
            {
              name: "nominative",
              type: "text",
              label: "Именительный падеж (кто? что?)",
              required: true,
              admin: {
                description: "Например: Москва, Санкт-Петербург",
              },
            },
            {
              name: "genitive",
              type: "text",
              label: "Родительный падеж (кого? чего?)",
              required: true,
              admin: {
                description: "Например: Москвы, Санкт-Петербурга",
              },
            },
            {
              name: "prepositional",
              type: "text",
              label: "Предложный падеж (в ком? о чём?)",
              required: true,
              admin: {
                description: "Например: в Москве, в Санкт-Петербурге",
              },
            },
          ],
        },
        {
          name: "seoTitle",
          type: "text",
          label: "SEO заголовок",
          required: false,
          admin: {
            description: "Дополнительный текст для SEO заголовков (например, 'Москва и область')",
          },
        },
        {
          name: "metaDescription",
          type: "textarea",
          label: "Meta описание",
          required: false,
          admin: {
            description: "Описание для мета-тегов (SEO)",
          },
        },
        {
          name: "isDefault",
          type: "checkbox",
          label: "Город по умолчанию",
          defaultValue: false,
          admin: {
            description: "Этот город будет использоваться при переходе на главную страницу без города в URL",
          },
        }
      ],
    },
  ],
}
