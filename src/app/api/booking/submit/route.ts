import { type NextRequest, NextResponse } from "next/server"
import axios from "axios"
import { getPayload } from "payload"
import config from "@payload-config"

// Types
interface BookingData {
  name: string
  phone: string
  serviceName: string
}

// Get site settings to fetch admin email
async function getSiteSettings() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAYLOAD_URL || "http://localhost:3000"}/api/globals/site-settings`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYLOAD_API_KEY || ""}`,
        },
      },
    )
    return await response.json()
  } catch (error) {
    console.error("Error fetching site settings:", error)
    return null
  }
}

// Send email using Payload
async function sendEmail(to: string, data: BookingData) {
  const payload = await getPayload({ config })

  const htmlContent = `
    <h2>Новая заявка на услугу</h2>
    <p><strong>Имя:</strong> ${data.name}</p>
    <p><strong>Телефон:</strong> ${data.phone}</p>
    <p><strong>Услуга:</strong> ${data.serviceName}</p>
    <hr>
    <p>Заявка получена: ${new Date().toLocaleString("ru-RU")}</p>
  `

  try {
    await payload.sendEmail({
      to,
      from: process.env.MAIL_USER,
      subject: "Новая заявка с сайта",
      html: htmlContent,
    })
    console.log("Email sent successfully")
  } catch (error) {
    console.error("Error sending email:", error)
    throw error
  }
}

// Send Telegram message
async function sendTelegramMessage(data: BookingData) {
  const message = `Пришла заявка с сайта\nИмя: ${data.name}\nТелефон: ${data.phone}\nНазвание услуги: ${data.serviceName}`

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: String(process.env.TELEGRAM_CHANNEL_ID).trim(),
        text: message,
      },
      {
        timeout: 5000,
      },
    )
    console.log("Telegram message sent successfully:", response.data)
  } catch (error) {
    console.error("Error sending Telegram message:", error)
    // Don't throw - log the error but don't fail the booking
    console.log("[v0] Telegram error details:", error instanceof axios.AxiosError ? error.response?.data : error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data: BookingData = await request.json()

    // Validate input
    if (!data.name || !data.phone || !data.serviceName) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Get site settings to fetch admin email
    const settings = await getSiteSettings()
    const adminEmail = settings?.socialLinks?.email

    if (!adminEmail) {
      return NextResponse.json({ message: "Admin email not configured" }, { status: 500 })
    }

    // Send email to admin
    await sendEmail(adminEmail, data)

    // Send Telegram message
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHANNEL_ID) {
      await sendTelegramMessage(data)
    }

    return NextResponse.json({ message: "Booking submitted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Booking API error:", error)
    return NextResponse.json({ message: "Error processing booking" }, { status: 500 })
  }
}
