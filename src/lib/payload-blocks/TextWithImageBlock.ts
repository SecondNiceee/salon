import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { Block } from "payload";
import { HeaderBlock } from "./HeaderBlock";
import { TextBlock } from "./TextBlock";
import { ListBlock } from "./ListBlock";


export const TextWithImageBlock:Block = {
    slug : "textWithImage",
    labels : {
        singular : "Текст с картинкой",
        plural : "Текст с картинками"
    },
    fields : [
        {
            name : "text",
            type : "richText",
            label: "Текст",
            admin : {
                description : "Введите текст с возможностью форматирования"
            },
            editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  BlocksFeature({
                    blocks: [HeaderBlock, TextBlock, ListBlock ],
                  }),
                  HeadingFeature({
                    enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
                  }),
                ],
              }),
        },
        {
            name : "image",
            type : "upload",    
            label: "Изображение",
            relationTo : "media",
            admin : {
                description : "Загрузите изображение (желательно квадратное 4:4)"
            }
        },
        {
            name : "imagePosition",
            type : "select",
            label: "Позиция изображения",
            options : [
                {label : "Слева", value : "left" },
                {label : "Справа", value : "right"}
            ],
            admin: {
                description: "Выберите с какой стороны отображать изображение"
            }
        }
    ]
}
