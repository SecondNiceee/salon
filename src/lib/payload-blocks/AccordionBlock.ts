import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical"
import type { Block } from "payload"
import { HeaderBlock } from "./HeaderBlock"
import { PararaphBlock } from "./ParagraphBlock"
import { BookingButtonBlock } from "./BookingButtonBlock"
import { TextBlock } from "./TextBlock"
import { ImageBlock } from "./ImageBlock"

export const AccordionBlock: Block = {
  slug: "accordion",
  labels: {
    singular: "Аккордеон",
    plural: "Аккордеоны",
  },
  fields: [
    {
      type: "richText",
      name: "title",
      label: "Заголовок",
      required: true,
      admin: {
        description: "Введите заголовок аккордеона с возможностью форматирования",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [HeaderBlock, PararaphBlock, BookingButtonBlock],
          }),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
          }),
          
        ],
      }),
    },
    {
      type: "richText",
      name: "content",
      label: "Содержимое",
      required: true,
      admin: {
        description: "Введите содержимое аккордеона",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [HeaderBlock, PararaphBlock, BookingButtonBlock, TextBlock, ImageBlock],
          }),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
          }),
        ],
      }),
    },
  ],
}
