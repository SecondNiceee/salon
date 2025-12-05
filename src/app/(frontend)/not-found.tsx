
import Link from "next/link"

export default function NotFound() {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex flex-col items-center text-center max-w-md">
          <img
            src="/not-found.jpg"
            alt="Страница не найдена"
            width={500}
            height={400}
            className="rounded-lg mb-8"
          />

          <h1 className="text-3xl font-bold text-foreground mb-4">Страница не найдена</h1>

          <p className="text-muted-foreground mb-8">
            К сожалению, запрашиваемая страница не существует или была перемещена.
          </p>

          <Link
            href="/moskva"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-base font-medium"
          >
            Перейти на главную
          </Link>
        </div>
      </body>
    </html>
  )
}
