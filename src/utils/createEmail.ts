const BRAND = "Академия Спа"
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
      ? "Добро пожаловать в Академия Спа! Чтобы завершить регистрацию и начать покупки, подтвердите ваш email:"
      : "Получен запрос на восстановление пароля для вашего аккаунта в Академия Спа. Чтобы установить новый пароль, перейдите по ссылке:"
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
    body {
      margin: 0;
      padding: 0;
      background: #f9fafb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
    }
    .container {
      padding: 40px 20px;
      background: #f9fafb;
      width: 100%;
      max-width: 600px;
      margin: 0 auto;
    }
    .email-wrapper {
      background: ${BG};
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%);
      padding: 32px 32px 24px 32px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      line-height: 32px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 1px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header p {
      margin: 8px 0 0 0;
      color: rgba(255, 255, 255, 0.9);
      font-size: 16px;
      font-weight: 500;
    }
    .content {
      padding: 40px 32px 32px 32px;
    }
    .content h2 {
      margin: 0 0 16px 0;
      font-size: 24px;
      line-height: 30px;
      color: ${TEXT};
      font-weight: 700;
    }
    .content p {
      margin: 0 0 24px 0;
      color: ${MUTED};
      font-size: 16px;
      line-height: 24px;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 16px 32px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
      transition: all 0.2s ease;
    }
    .button:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
    }
    .security-note {
      background: ${GREEN_LIGHT};
      border: 1px solid ${GREEN};
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    .security-note p {
      margin: 0;
      color: ${GREEN_DARK};
      font-size: 14px;
      font-weight: 500;
    }
    .footer {
      padding: 24px 32px 32px 32px;
      border-top: 1px solid ${BORDER};
      background: #f9fafb;
    }
    .footer p {
      margin: 0 0 8px 0;
      color: ${MUTED};
      font-size: 14px;
      line-height: 20px;
    }
    .footer p:last-child {
      margin-top: 16px;
      font-weight: 600;
      color: ${TEXT};
    }
    .link {
      color: ${GREEN};
      text-decoration: none;
      word-break: break-all;
      font-family: monospace;
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
    }
    @media (max-width: 600px) {
      .container {
        padding: 20px 16px;
      }
      .header, .content, .footer {
        padding-left: 20px;
        padding-right: 20px;
      }
      .header h1 {
        font-size: 24px;
      }
      .content h2 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="email-wrapper">
      <div class="header">
        <h1>${BRAND}</h1>
        <p>Ваш надежный партнер в онлайн-покупках</p>
      </div>
      <div class="content">
        <h2>${title}</h2>
        <p>Здравствуйте, <strong>${userEmail}</strong>!</p>
        <p>${intro}</p>
        
        <div class="button-container">
          <a href="${url}" target="_blank" class="button">${buttonText}</a>
        </div>
        
        <div class="security-note">
          <p><strong>Важно:</strong> ${expires} Если вы не инициировали этот запрос, просто проигнорируйте это письмо.</p>
        </div>
        
        <p>Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:</p>
        <p><a href="${url}" class="link">${url}</a></p>
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
${BRAND} - Ваш надежный партнер в онлайн-покупках
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
