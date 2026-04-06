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
import Orders from "./collections/Orders"
import Reviews from "./collections/Reviews"
import Favorites from "./collections/Favorites"
import { Pages } from "./collections/Pages"
import FilterConfigs from "./collections/FilterConfigs"
import { ImageBlock } from "./lib/payload-blocks/ImageBlock"
import { PararaphBlock } from "./lib/payload-blocks/ParagraphBlock"
import { TextWithImageBlock } from "./lib/payload-blocks/TextWithImageBlock"
import { HeaderBlock } from "./lib/payload-blocks/HeaderBlock"
import { ImageGalleryBlock } from "./lib/payload-blocks/ImageGalleryBlock"
import { ImageSliderBlock } from "./lib/payload-blocks/ImageSliderBlock"
import { ContactsBlock } from "./lib/payload-blocks/ContactsBlock"
import { SiteSettings } from "./globals/SiteSettings"
import { Cities } from "./globals/Cities"

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const MAIL_USER = process.env.MAIL_USER
const MAIL_PASSWORD = process.env.MAIL_PASSWORD

// Only create email transport if credentials are provided
const emailConfig = MAIL_USER && MAIL_PASSWORD
  ? nodemailerAdapter({
      defaultFromAddress: "kolya.titov.05@inbox.ru",
      defaultFromName: "Академия профессионального образования",
      transport: nodemailer.createTransport({
        service: "Mail.ru",
        host: "smtp.mail.ru",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
          user: MAIL_USER,
          pass: MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
          minVersion: "TLSv1.2",
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      }),
    })
  : undefined

export default buildConfig({
  // serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || "https://grandbazarr.ru",
  serverURL : process.env.PAYLOAD_PUBLIC_SERVER_URL,
  cors: ['http://localhost:3000', process.env.PAYLOAD_PUBLIC_URL || "https://grandbazarr.ru"],
  csrf: ['http://localhost:3000', process.env.PAYLOAD_PUBLIC_URL || "https://grandbazarr.ru"],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Categories, Products, FilterConfigs, Orders, Reviews, Favorites, Pages],
  globals: [SiteSettings, Cities],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      BlocksFeature({
        blocks: [HeaderBlock, ImageBlock, PararaphBlock, TextWithImageBlock, ImageGalleryBlock, ImageSliderBlock, ContactsBlock],
      }),
      HeadingFeature({
        enabledHeadingSizes: ["h1", "h2", "h3", "h4"],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || "42a7038a6aa3db05199544b1",
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
  ...(emailConfig && { email: emailConfig }),
})
