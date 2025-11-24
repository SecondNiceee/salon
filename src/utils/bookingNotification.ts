// Utilities for booking notifications (Telegram and Email)

interface BookingData {
  orderNumber: string
  customerName?: string
  customerPhone: string
  serviceName?: string
  hasAccount: boolean
  adminOrderUrl: string
  city?: string
}

const escapeHtml = (text: string | null | undefined): string => {
  if (!text) return ""
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Format booking message for Telegram
export function formatBookingMessage(data: BookingData): string {
  const accountStatus = data.hasAccount
    ? `\n\n<b>👤 Статус аккаунта:</b> У пользователя, создавшего бронирование, есть аккаунт, зайдите по ссылке и измените статус на "Отменен" или "Принят". Если заказ "Принят" укажите в комментарии заказа дату и место оказания услуги.`
    : `\n\n<b>👤 Статус аккаунта:</b> У пользователя, создающего заказ не создана учетная запись.`

  return `<b>📅 Новое бронирование!</b>

<b>📋 Номер заказа:</b> ${escapeHtml(data.orderNumber)}
<b>👤 Имя клиента:</b> ${escapeHtml(data.customerName)}
<b>📞 Телефон:</b> ${escapeHtml(data.customerPhone)}
<b>💆 Услуга:</b> ${escapeHtml(data.serviceName)}${data.city ? `\n<b>🏙️ Город:</b> ${escapeHtml(data.city)}` : ""}

<b>🕐 Время бронирования:</b> ${escapeHtml(new Date().toLocaleString("ru-RU"))}

<b>🔗 Ссылка на заказ:</b> <a href="${escapeHtml(data.adminOrderUrl)}">${escapeHtml(data.adminOrderUrl)}</a>${accountStatus}`
}

// Generate booking email HTML
export function generateBookingEmailHTML(data: BookingData): string {
  const accountStatusHtml = data.hasAccount
    ? `
      <div class="account-status has-account">
        <p><strong>👤 Статус аккаунта:</strong></p>
        <p>У пользователя, создавшего бронирование, есть аккаунт, зайдите по ссылке и измените статус на "Отменен" или "Принят". Если заказ "Принят" укажите в комментарии заказа дату и место оказания услуги.</p>
      </div>
    `
    : `
      <div class="account-status no-account">
        <p><strong>👤 Статус аккаунта:</strong></p>
        <p>У пользователя, создающего заказ не создана учетная запись.</p>
      </div>
    `

  return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Новое бронирование ${data.orderNumber}</title>
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
          border-bottom: 3px solid #ec4899;
        }
        
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          color: #000000;
        }
        
        .order-number {
          font-size: 18px;
          font-weight: 500;
          color: #000000;
        }
        
        .content {
          padding: 32px 24px;
        }
        
        .info-section {
          background-color: #fef2f2;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          border-left: 4px solid #ec4899;
        }
        
        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #fecdd3;
        }
        
        .info-row:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }
        
        .info-label {
          font-weight: 600;
          color: #881337;
          min-width: 140px;
          font-size: 14px;
        }
        
        .info-value {
          color: #2d3748;
          font-weight: 500;
          flex: 1;
          text-align: right;
        }
        
        .account-status {
          background-color: #f0fdf4;
          border-left: 4px solid #22c55e;
          padding: 20px;
          margin: 24px 0;
          border-radius: 0 8px 8px 0;
        }
        
        .account-status.no-account {
          background-color: #fef3c7;
          border-left-color: #f59e0b;
        }
        
        .account-status p {
          margin-bottom: 8px;
          color: #1f2937;
        }
        
        .account-status p:last-child {
          margin-bottom: 0;
        }
        
        .cta-section {
          text-align: center;
          margin: 32px 0;
        }
        
        .cta-button {
          display: inline-block;
          background-color: transparent;
          color: #2563eb;
          text-decoration: underline;
          padding: 16px 32px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        
        .cta-button:hover {
          color: #1d4ed8;
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
          
          .cta-button {
            padding: 14px 24px;
            font-size: 15px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>📅 Новое бронирование!</h1>
          <div class="order-number">№ ${data.orderNumber}</div>
        </div>
        
        <div class="content">
          <div class="info-section">
            <div class="info-row">
              <span class="info-label">👤 Имя клиента:</span>
              <span class="info-value">${data.customerName || "Не указано"}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">📞 Телефон:</span>
              <span class="info-value">${data.customerPhone}</span>
            </div>
            
            <div class="info-row">
              <span class="info-label">💆 Услуга:</span>
              <span class="info-value">${data.serviceName || "Не указана"}</span>
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
          
          ${accountStatusHtml}
          
          <div class="cta-section">
            <a href="${data.adminOrderUrl}" target="_blank" rel="noopener noreferrer" class="cta-button">
              🔗 Открыть заказ в админке
            </a>
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
