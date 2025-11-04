// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres"
import { payloadCloudPlugin } from "@payloadcms/payload-cloud"
import { BlocksFeature, lexicalEditor, HeadingFeature } from "@payloadcms/richtext-lexical"
import path from "path"
import { buildConfig } from "payload"
import { fileURLToPath } from "url"
import sharp from "sharp"
import { nodemailerAdapter } from "@payloadcms/email-nodemailer"
import nodemailer from "nodemailer"
import { Users } from "./collections/Users"
import { Media } from "./collections/Media"
import Categories from "./collections/Categories"
import Products from "./collections/Products"
import Carts from "./collections/Carts"
import Orders from "./collections/Orders"
import Reviews from "./collections/Reviews"
import Favorites from "./collections/Favorites"
import { Pages } from "./collections/Pages"
import { ImageBlock } from "./lib/payload-blocks/ImageBlock"
import { PararaphBlock } from "./lib/payload-blocks/ParagraphBlock"
import { TextWithImageBlock } from "./lib/payload-blocks/TextWithImageBlock"
import { HeaderBlock } from "./lib/payload-blocks/HeaderBlock"
import { ImageGalleryBlock } from "./lib/payload-blocks/ImageGalleryBlock"
import { ContactsBlock } from "./lib/payload-blocks/ContactsBlock"
import { SiteSettings } from "./globals/SiteSettings"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const MAIL_NAME = process.env.MAIL_NAME || ""
const MAIL_USER = process.env.MAIL_USER || ""
const MAIL_PASSWORD = process.env.MAIL_PASSWORD || ""
const isDevelopment = process.env.NODE_ENV === "development"

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "https://grandbazarr.ru",
  cors: ['http://localhost:3000', process.env.PAYLOAD_PUBLIC_URL || "https://grandbazarr.ru"],
  csrf: ['http://localhost:3000', process.env.PAYLOAD_PUBLIC_URL || "https://grandbazarr.ru"],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, Carts, Orders, Reviews, Favorites, Pages],
  globals: [SiteSettings],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [HeaderBlock, ImageBlock, PararaphBlock, TextWithImageBlock, ImageGalleryBlock, ContactsBlock],
      }),
      HeadingFeature({
        enabledHeadingSizes: ["h3", "h4", "h5", "h6"],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
  endpoints: [],
  email: nodemailerAdapter({
    defaultFromAddress: MAIL_NAME,
    defaultFromName: "ГРАНДБАЗАР",
    transport: nodemailer.createTransport({
      service: "Mail.ru",
      host: "smtp.mail.ru",
      port: 587,
      secure: false, // false для порта 587 (STARTTLS)
      requireTLS: true, // обязательно для Mail.ru
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASSWORD,
      },
      tls: {
        // Не отклонять неавторизованные сертификаты (для production с самоподписанными сертификатами)
        rejectUnauthorized: false,
        // Минимальная версия TLS
        minVersion: "TLSv1.2",
      },
      // Таймауты для лучшей обработки ошибок
      connectionTimeout: 10000, // 10 секунд
      greetingTimeout: 10000,
      socketTimeout: 10000,
      // Логирование для отладки (можно включить при проблемах)
      // debug: isDevelopment, // включить debug только в dev режиме
      // logger: isDevelopment, // логирование только в dev режиме
    }),
  }),
})
