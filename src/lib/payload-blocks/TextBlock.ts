import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical"
import type { Block } from "payload"

export const TextBlock: Block = {
  slug: "text",
  labels: {
    singular: "Текст",
    plural: "Тексты",
  },
  fields: [
    {
      type: "richText",
      name: "text",
      label: "Текст",
      required: true,
      admin: {
        description: "Введите текст с возможностью форматирования",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          HeadingFeature({
            enabledHeadingSizes: [],
          }),
        ],
      }),
    },
    {
      type: "select",
      name: "size",
      label: "Размер текста",
      defaultValue: "base",
      options: [
        { label: "Base (адаптивный)", value: "base" },
        { label: "Large (адаптивный: lg → base)", value: "lg" },
        { label: "XL (адаптивный: xl → lg → base)", value: "xl" },
        { label: "2XL (адаптивный: 2xl → xl → lg)", value: "2xl" },
        { label: "3XL (адаптивный: 3xl → 2xl → xl)", value: "3xl" },
      ],
      required: true,
    },
  ],
}
