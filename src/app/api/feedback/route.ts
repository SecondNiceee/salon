import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "payload"
import config from "@payload-config"
import { getSiteSettings } from "@/actions/server/globals/getSiteSettings"

interface FeedbackData {
  name: string
  phone: string
  city?: string
}

export async function POST(request: NextRequest) {
  try {
    const data: FeedbackData = await request.json()

    // Validate input
    if (!data.name || !data.phone) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const siteSettings = await getSiteSettings()

    const adminEmail = siteSettings?.socialLinks?.email
    if (!adminEmail) {
      console.error("Admin email not configured")
      return NextResponse.json({ message: "Configuration error" }, { status: 500 })
    }

    // Send email to admin
    try {
      await payload.sendEmail({
        to: adminEmail,
        from: "Академия профессионального образования <kolya.titov.05@inbox.ru>",
        subject: `📞 Новый запрос на звонок от ${data.name}`,
        html: generateFeedbackEmailHTML(data),
      })
      console.log("Feedback email sent to:", adminEmail)
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
    }

    // Send Telegram notification
    try {
      const botToken = process.env.TELEGRAM_BOT_TOKEN
      const channelId = process.env.TELEGRAM_CHANNEL_ID

      if (!botToken || !channelId) {
        console.warn("Telegram bot credentials not configured")
      } else {
        const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`
        const telegramMessage = formatTelegramMessage(data)

        const response = await fetch(telegramUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: channelId,
            text: telegramMessage,
            parse_mode: "HTML",
          }),
        })

        if (!response.ok) {
          console.error("Failed to send Telegram notification:", await response.text())
        } else {
          console.log("Telegram notification sent successfully")
        }
      }
    } catch (error) {
      console.error("Error sending Telegram notification:", error)
    }

    return NextResponse.json(
      {
        message: "Feedback submitted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json({ message: "Error processing feedback" }, { status: 500 })
  }
}

// Format feedback message for Telegram
function formatTelegramMessage(data: FeedbackData): string {
  return `<b>📞 Новый запрос на звонок!</b>

<b>👤 Имя:</b> ${escapeHtml(data.name)}
<b>📞 Телефон:</b> ${escapeHtml(data.phone)}${data.city ? `\n<b>🏙️ Город:</b> ${escapeHtml(data.city)}` : ""}

<b>🕐 Время запроса:</b> ${escapeHtml(new Date().toLocaleString("ru-RU"))}`
}

// Generate feedback email HTML
function generateFeedbackEmailHTML(data: FeedbackData): string {
  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Новый запрос на звонок</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          background-color: #f8fafc;
        }
        
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background-color: #ffffff;
          color: #000000;
          padding: 32px 24px;
          text-align: center;
          border-bottom: 3px solid #22c55e;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #000000;
        }
        
        .content {
          padding: 32px 24px;
        }
        
        .info-section {
          background-color: #f0fdf4;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          border-left: 4px solid #22c55e;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #dcfce7;
        }
        
        .info-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .info-label {
          font-weight: 600;
          color: #166534;
          min-width: 140px;
          font-size: 14px;
        }
        
        .info-value {
          color: #2d3748;
          font-weight: 500;
          flex: 1;
          text-align: right;
        }
        
        .footer {
          background-color: #f8fafc;
          padding: 24px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        
        .timestamp {
          color: #718096;
          font-size: 13px;
          font-style: italic;
        }
        
        @media only screen and (max-width: 600px) {
          .email-container {
            margin: 0;
            box-shadow: none;
          }
          
          .header {
            padding: 24px 16px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .content {
            padding: 24px 16px;
          }
          
          .info-section {
            padding: 16px;
          }
          
          .info-row {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .info-value {
            text-align: left;
            margin-top: 4px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📞 Новый запрос на звонок!</h1>
        </div>
        
        <div class="content">
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">👤 Имя клиента:</span>
              <span class="info-value">${data.name || "Не указано"}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">📞 Телефон:</span>
              <span class="info-value">${data.phone}</span>
            </div>
            
            ${
              data.city
                ? `<div class="info-row">
              <span class="info-label">🏙️ Город:</span>
              <span class="info-value">${data.city}</span>
            </div>`
                : ""
            }
          </div>
        </div>
        
        <div class="footer">
          <p class="timestamp">
            ⏰ Отправлено: ${new Date().toLocaleString("ru-RU", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// HTML escape helper
function escapeHtml(text: string | null | undefined): string {
  if (!text) return ""
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
