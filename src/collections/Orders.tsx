import { isAccess, isLoggedIn, isOwn } from "@/utils/accessUtils"
import { formatBookingMessage, generateBookingEmailHTML } from "@/utils/bookingNotification"
import type { CollectionConfig } from "payload"

const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
    group: "Заказы(Важно)",
    defaultColumns: ["orderNumber", "user", "product", "status", "createdAt"],
  },
  access: {
    read: isOwn,
    create: isLoggedIn,
    update: isAccess("orders"),
    delete: isAccess("orders"),
  },
  hooks: {
    afterChange: [
      async ({ operation, doc, req }) => {
        console.log("Выполняется после изменения")
        // Send Telegram notification only for new orders
        if (operation === "create" && doc) {
          try {
            const botToken = process.env.TELEGRAM_BOT_TOKEN
            const channelId = process.env.TELEGRAM_CHANNEL_ID

            if (!botToken || !channelId) {
              console.warn("Telegram bot credentials not configured")
              return
            }

            const product = typeof doc.product === "object" ? doc.product : null
            const serviceName = product?.title || "Услуга"

            const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000"
            const orderId = (doc as any).id
            const adminOrderUrl = `${backendUrl}/admin/collections/orders/${orderId}`

            let city: string | undefined
            if (doc.notes && typeof doc.notes === "string") {
              const cityMatch = doc.notes.match(/Город:\s*(.+?)(?:\n|$)/i)
              if (cityMatch) {
                city = cityMatch[1].trim()
              }
            }

            const message = formatBookingMessage({
              orderNumber: doc.orderNumber,
              customerName: doc.customerName,
              customerPhone: doc.customerPhone,
              serviceName,
              hasAccount: !!doc.user,
              adminOrderUrl,
              city,
            })

            const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`

            const response = await fetch(telegramUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chat_id: channelId,
                text: message,
                parse_mode: "HTML",
              }),
            })

            if (!response.ok) {
              console.error("Failed to send Telegram notification:", await response.text())
            } else {
              console.log("Telegram notification sent successfully")
            }
          } catch (error) {
            console.error("Error sending Telegram notification:", error)
          }

          // Send Email notification
          try {
            if (!req?.payload) {
              console.warn("Payload instance not available on req for sending email")
            } else {
              // Get destination email from SiteSettings
              const siteSettings = (await req.payload.findGlobal({ slug: "site-settings" })) as any
              const adminEmail: string | undefined = siteSettings?.socialLinks?.email

              if (!adminEmail) {
                console.warn("Admin email is not configured in SiteSettings")
              } else {
                const backendUrl =
                  process.env.BACKEND_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000"
                const orderId = (doc as any).id
                const adminOrderUrl = `${backendUrl}/admin/collections/orders/${orderId}`

                const product = typeof doc.product === "object" ? doc.product : null
                const serviceName = product?.title || "Услуга"

                let city: string | undefined
                if (doc.notes && typeof doc.notes === "string") {
                  const cityMatch = doc.notes.match(/Город:\s*(.+?)(?:\n|$)/i)
                  if (cityMatch) {
                    city = cityMatch[1].trim()
                  }
                }

                const emailHtml = generateBookingEmailHTML({
                  orderNumber: doc.orderNumber,
                  customerName: doc.customerName,
                  customerPhone: doc.customerPhone,
                  serviceName,
                  hasAccount: !!doc.user,
                  adminOrderUrl,
                  city,
                })
                const subject = `Новое бронирование: ${doc.orderNumber || ""}`

                console.log(adminEmail)

                await req.payload.sendEmail({
                  to: adminEmail,
                  subject,
                  html: emailHtml,
                })

                console.log("Order email sent to:", adminEmail)
              }
            }
          } catch (error) {
            console.error("Error sending order email:", error)
          }
        }
      },
    ],
    beforeChange: [
      ({ data, operation }) => {
        // Generate order number only on create
        if (operation === "create" && !data.orderNumber) {
          data.orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }

        return data
      },
    ],
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      label: "Номер заказа",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
        description: "Просто уникальный номер заказа(для разработки, можно не обращать внимания)",
      },
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      label: "Услуга",
      required: true,
      hasMany: false,
      admin: {
        description: "Услуга",
      },
    },
    {
      name: "customerName",
      type: "text",
      label: "Имя клиента",
      required: true,
      admin: {
        description: "Имя клиента",
      },
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      label: "Пользователь",
      required: false,
      admin: {
        readOnly: true,
        description: "пользователь (если был зарегестрирован, то привязывается)",
      },
    },
    {
      name: "status",
      type: "select",
      label: "Статус",
      required: true,
      defaultValue: "pending",
      options: [
        {
          label: "Принят",
          value: "pending",
        },
        {
          label: "Ожидаем звонок",
          value: "waiting_call",
        },
        {
          label: "Отменен",
          value: "cancelled",
        },
      ],
    },
    {
      name: "customerPhone",
      type: "text",
      label: "Телефон клиента",
      required: true,
      admin: {
        description: "Customer phone number",
      },
    },
    {
      name: "notes",
      type: "textarea",
      label: "Примечания",
      admin: {
        description: "Additional notes or comments",
      },
    },
  ],
}

export default Orders
