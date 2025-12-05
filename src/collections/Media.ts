import { isAccess } from "@/utils/accessUtils"
import type { CollectionConfig } from "payload"

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "alt",
    group: "Файлы",
  },
  access: {
    read: () => true,
    update: isAccess("media"),
    delete: isAccess("media"),
    create: isAccess("media"),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Альтернативный текст",
      required: true,
    },
  ],
  upload: {
    staticDir: "media", // Папка в корне проекта где хранятся ,
  },
}
