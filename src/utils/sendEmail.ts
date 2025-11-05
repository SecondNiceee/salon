"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { MAIL_NAME } from "@/constants/dynamic-constants"
type sendEmailProps = {
  to: string
  message: string
}
export const sendEmail = async ({ message, to }: sendEmailProps) => {
  const payload = await getPayload({ config })
  await payload.sendEmail({
    to,
    from : "Академия Спа <kolya.titov.05@inbox.ru>",
    subject: "Подтвердите ваш email",
    html: message,
  })
}
