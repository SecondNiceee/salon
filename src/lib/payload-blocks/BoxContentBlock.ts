import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical"
import type { Block } from "payload"
import { HeaderBlock } from "./HeaderBlock"
import { ImageBlock } from "./ImageBlock"
import { TextWithImageBlock } from "./TextWithImageBlock"
import { ImageGalleryBlock } from "./ImageGalleryBlock"
import { ContactsBlock } from "./ContactsBlock"
import { ListBlock } from "./ListBlock"
import { TextBlock } from "./TextBlock"

export const BoxContentBlock: Block = {
  slug: "boxContent",
  labels: {
    singular: "Контент в рамке",
    plural: "Контент в рамке",
  },
  fields: [
    {
      type: "richText",
      name: "content",
      label: "Контент",
      admin: {
        description: "Контент, который будет отображаться в белой области с тенью",
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [
              HeaderBlock,
              ImageBlock,
              TextWithImageBlock,
              ImageGalleryBlock,
              ContactsBlock,
              ListBlock,
              TextBlock,
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
