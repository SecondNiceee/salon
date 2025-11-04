import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { Block } from "payload";
import { HeaderBlock } from "./HeaderBlock";
import { ImageBlock } from "./ImageBlock";
import { TextWithImageBlock } from "./TextWithImageBlock";
import { ImageGalleryBlock } from "./ImageGalleryBlock";
import { ContactsBlock } from "./ContactsBlock";

export const PararaphBlock:Block = {
    slug : "paragraph",
    labels: {
        singular: "Параграф",
        plural: "Параграфы",
    },
    fields : [
        {
            type : "richText",
            name : "text",
            label: "Текст параграфа",
            admin : {
                description : "Введите текст параграфа с возможностью форматирования"
            },
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BlocksFeature({
                    blocks : [HeaderBlock, ImageBlock, TextWithImageBlock, ImageGalleryBlock, ContactsBlock]
                  }),
                  HeadingFeature({
                    enabledHeadingSizes : [
                      "h3", "h4", "h5", "h6"
                    ]
                  })
                ],
              }),
        }
    ]
}
