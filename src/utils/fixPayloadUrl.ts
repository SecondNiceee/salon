// src/lib/fixPayloadUrl.ts
export const fixPayloadUrl = (url: string | null | undefined): string => {
    if (!url) return '';
  
    // 1. Нормализуем URL — приводим к полному HTTPS-виду, если нужно
    let fullUrl = url;
  
    // Если URL относительный и начинается с /api/media/file/ → конвертируем в полный
    if (url.startsWith('/api/media/file/')) {
      fullUrl = `https://alexestetica.ru${url}`;
    }
  
    // 2. Заменяем /api/media/file/ → /media/
    const fixedUrl = fullUrl.replace(
      /https:\/\/alexestetica\.ru\/api\/media\/file\//,
      'https://alexestetica.ru/media/'
    );
  
    // 3. Только на сервере — подменяем домен на 127.0.0.1 для внутреннего запроса
    if (typeof window === 'undefined') {
      return fixedUrl.replace('https://alexestetica.ru', 'http://127.0.0.1');
    }
  
    // 4. В браузере — возвращаем чистый публичный URL
    return fixedUrl;
  };