import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical"
import type { Block } from "payload"
import { HeaderBlock } from "./HeaderBlock"
import { ImageBlock } from "./ImageBlock"
import { TextWithImageBlock } from "./TextWithImageBlock"
import { ImageGalleryBlock } from "./ImageGalleryBlock"
import { ContactsBlock } from "./ContactsBlock"
import { ListBlock } from "./ListBlock"

export const PararaphBlock: Block = {
  slug: "paragraph",
  labels: {
    singular: "Параграф",
    plural: "Параграфы",
  },
  fields: [
    {
      type: "richText",
      name: "text",
      label: "Текст параграфа",
      admin: {
        description: "Введите текст параграфа с возможностью форматирования",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [HeaderBlock, ImageBlock, TextWithImageBlock, ImageGalleryBlock, ContactsBlock, ListBlock],
          }),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
          }),
        ],
      }),
    },
  ],
}
