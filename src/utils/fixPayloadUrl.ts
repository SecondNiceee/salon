// src/utils/fixPayloadUrl.ts

const CDN_DOMAIN = "kesijuhidipret.begetcdn.cloud"
const ORIGIN_DOMAIN = "alexestetica.ru"

export const fixPayloadUrl = (url: string | null | undefined): string => {
  if (!url) return ""

  // 1. Нормализуем URL — приводим к полному HTTPS-виду, если нужно
  let fullUrl = url

  // Если URL относительный и начинается с /api/media/file/ → конвертируем в полный
  if (url.startsWith("/api/media/file/")) {
    fullUrl = `https://${ORIGIN_DOMAIN}${url}`
  }

  // Если URL относительный и начинается с /media/ → конвертируем в полный
  if (url.startsWith("/media/")) {
    fullUrl = `https://${ORIGIN_DOMAIN}${url}`
  }

  // 2. Заменяем /api/media/file/ → /media/
  let fixedUrl = fullUrl.replace(
    new RegExp(`https://${ORIGIN_DOMAIN}/api/media/file/`),
    `https://${ORIGIN_DOMAIN}/media/`,
  )

  // CDN будет кешировать и раздавать медиа быстрее
  if (fixedUrl.includes(`${ORIGIN_DOMAIN}/media/`)) {
    fixedUrl = fixedUrl.replace(`https://${ORIGIN_DOMAIN}/media/`, `https://${CDN_DOMAIN}/media/`)
  }

  return fixedUrl
}
