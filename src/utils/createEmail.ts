const BRAND = "Академия профессионального образования"
const GREEN = "#22c55e" // Tailwind green-500
const GREEN_DARK = "#16a34a" // green-600
const GREEN_LIGHT = "#dcfce7" // green-100
const TEXT = "#111827" // gray-900
const MUTED = "#6b7280" // gray-500
const BG = "#ffffff"
const BORDER = "#e5e7eb"

interface ICreateEmail {
  userEmail: string
  mode: "verify" | "forgetPassword"
  url: string
}

export const createEmail = ({ mode, userEmail, url }: ICreateEmail) => {
  const title = mode === "verify" ? "Подтвердите ваш email" : "Восстановление пароля"
  const intro =
    mode === "verify"
      ? "Добро пожаловать в Академия профессионального образования! Чтобы завершить регистрацию и начать покупки, подтвердите ваш email:"
      : "Получен запрос на восстановление пароля для вашего аккаунта в Академия профессионального образования. Чтобы установить новый пароль, перейдите по ссылке:"
  const buttonText = mode === "verify" ? "Подтвердить email" : "Восстановить пароль"
  const expires = mode === "verify" ? "Ссылка действует 24 часа." : "Ссылка действует 20 минут."

  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${title} — ${BRAND}</title>
  <style>
    * {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: ${TEXT};
    }
    .container {
      padding: 40px 20px;
      background: linear-gradient(135deg, #f0fdf4 0%, #f9fafb 100%);
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .email-wrapper {
      background: ${BG};
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(34, 197, 94, 0.15);
      border: 1px solid ${GREEN_LIGHT};
    }
    .header {
      background: linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%);
      padding: 48px 32px 40px 32px;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .header::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
      background-size: 20px 20px;
      pointer-events: none;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
      line-height: 38px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      position: relative;
      z-index: 1;
    }
    .header p {
      margin: 12px 0 0 0;
      color: rgba(255, 255, 255, 0.95);
      font-size: 15px;
      font-weight: 500;
      position: relative;
      z-index: 1;
      letter-spacing: 0.3px;
    }
    .content {
      padding: 48px 32px 32px 32px;
    }
    .content h2 {
      margin: 0 0 20px 0;
      font-size: 26px;
      line-height: 32px;
      color: ${TEXT};
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .greeting {
      color: ${TEXT};
      font-weight: 600;
      font-size: 16px;
      margin-bottom: 16px;
    }
    .content p {
      margin: 0 0 24px 0;
      color: ${MUTED};
      font-size: 15px;
      line-height: 24px;
      letter-spacing: 0.2px;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 18px 48px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 0 8px 20px rgba(34, 197, 94, 0.35);
      transition: all 0.3s ease;
      display: inline-block;
      letter-spacing: 0.3px;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(34, 197, 94, 0.4);
    }
    .security-note {
      background: linear-gradient(135deg, ${GREEN_LIGHT} 0%, rgba(220, 252, 231, 0.7) 100%);
      border: 1.5px solid ${GREEN};
      border-radius: 12px;
      padding: 20px 24px;
      margin: 32px 0;
    }
    .security-note p {
      margin: 0;
      color: ${GREEN_DARK};
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
    }
    .security-note strong {
      color: ${GREEN_DARK};
      font-weight: 700;
    }
    .footer {
      padding: 28px 32px 32px 32px;
      border-top: 1px solid ${BORDER};
      background: #f9fafb;
    }
    .footer p {
      margin: 0 0 8px 0;
      color: ${MUTED};
      font-size: 13px;
      line-height: 20px;
      letter-spacing: 0.2px;
    }
    .footer p:last-child {
      margin-top: 16px;
      font-weight: 600;
      color: ${MUTED};
      font-size: 12px;
    }
    .link {
      color: ${GREEN};
      text-decoration: none;
      word-break: break-all;
      font-family: 'Courier New', monospace;
      background: ${GREEN_LIGHT};
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      display: inline-block;
      margin: 8px 0;
      border: 1px solid ${GREEN};
    }
    .divider {
      height: 1px;
      background: ${BORDER};
      margin: 24px 0;
    }
    @media (max-width: 600px) {
      .container {
        padding: 20px 16px;
      }
      .header {
        padding: 32px 20px 28px 20px;
      }
      .header h1 {
        font-size: 28px;
        line-height: 34px;
      }
      .content, .footer {
        padding-left: 20px;
        padding-right: 20px;
      }
      .content {
        padding-top: 32px;
      }
      .content h2 {
        font-size: 22px;
        line-height: 28px;
      }
      .button {
        padding: 16px 32px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>${BRAND}</h1>
        <p>Спа-услуги высшего качества</p>
      </div>
      <div class="content">
        <h2>${title}</h2>
        <p class="greeting">Здравствуйте, <strong>${userEmail}</strong>!</p>
        <p>${intro}</p>
        
        <div class="button-container">
          <a href="${url}" target="_blank" class="button">${buttonText}</a>
        </div>
        
        <div class="security-note">
          <p><strong>Важно:</strong> ${expires} Если вы не инициировали этот запрос, просто проигнорируйте это письмо.</p>
        </div>
        
        <p>Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
        <a href="${url}" class="link">${url}</a>
      </div>
      <div class="footer">
        <p>Это автоматическое письмо, не отвечайте на него.</p>
        <p>Если у вас есть вопросы, обратитесь в нашу службу поддержки.</p>
        <p>© ${new Date().getFullYear()} ${BRAND}. Все права защищены.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.replace(/\n\s*/g, "")

  const text = `
${BRAND} - Спа-услуги высшего качества
${title}

Здравствуйте, ${userEmail}!

${intro}

Ссылка для ${mode === "verify" ? "подтверждения" : "восстановления"}:
${url}

${expires}

Если вы не инициировали этот запрос, проигнорируйте это письмо.

© ${new Date().getFullYear()} ${BRAND}. Все права защищены.
  `.trim()

  return { html, text }
}
