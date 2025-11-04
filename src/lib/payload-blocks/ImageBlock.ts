import { Block } from "payload";

export const ImageBlock:Block = {
    slug : "image",
    labels: {
        singular: "Изображение",
        plural: "Изображения",
    },
    fields : [
        {
            type : "upload",
            name : "image",
            label : "Изображение",
            admin : {
                description : "Загрузите изображение для отображения на сайте"
            },
            relationTo : "media"
        }
    ]
}
