import { isAccess } from "@/utils/accessUtils"
import { revalidatePath } from "next/cache"
import { lexicalEditor, HeadingFeature, BlocksFeature } from "@payloadcms/richtext-lexical"
import type { CollectionConfig } from "payload"
import { HeaderBlock } from "@/lib/payload-blocks/HeaderBlock"
import { ImageBlock } from "@/lib/payload-blocks/ImageBlock"
import { PararaphBlock } from "@/lib/payload-blocks/ParagraphBlock"
import { TextWithImageBlock } from "@/lib/payload-blocks/TextWithImageBlock"
import { ImageGalleryBlock } from "@/lib/payload-blocks/ImageGalleryBlock"
import { ContactsBlock } from "@/lib/payload-blocks/ContactsBlock"

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    group: "Страницы",
  },
  access: {
    read: ({ req: { user } }) => {
      if (user?.role === "admin") {
        return true
      }
      return {
        _status: {
          equals: "published",
        },
      }
    },
    create: isAccess("pages"),
    delete: isAccess("pages"),
    update: isAccess("pages"),
  },
  hooks: {
    afterChange: [
      ({ data }) => {
        if (data.slug){
          revalidatePath(`/${data.slug}`)
        }
        return data
      },
    ],
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: "slug",
      type: "text",
      label: "URL-адрес",
      required: true,
      admin: {
        description: "Уникальный slug, не менять!",
      },
    },
    {
      name: "title",
      type: "text",
      label: "Заголовок",
      required: true,
      admin: {
        description: "Название странички (в поисковике будет)",
      },
    },
    {
      name: "description",
      type: "text",
      label: "Описание",
      required: true,
      admin: {
        description: "Описание, которое в поисковике.",
      },
    },
    {
      name: "content",
      type: "richText",
      label: "Контент",
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          BlocksFeature({
            blocks: [HeaderBlock, ImageBlock, PararaphBlock, TextWithImageBlock, ImageGalleryBlock, ContactsBlock],
          }),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
          }),
        ],
      }),
      admin: {
        description: "Это контент страницы",
      },
    },
  ],
}
