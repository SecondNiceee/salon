import Link from "next/link"
import { Settings2, Tag } from "lucide-react"

export const metadata = {
  title: "Панель управления товарами",
}

export default function ProductsAdminPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-3xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-foreground mb-2 text-balance">
            Панель управления товарами
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Управляйте фильтрами категорий и назначайте фильтры каждому товару.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Filters Admin */}
          <Link
            href="/filters-admin"
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Settings2 size={22} />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Управление фильтрами</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Создавайте и редактируйте конфигурации фильтров (FilterConfig) для категорий и подкатегорий.
              </p>
            </div>
            <span className="mt-auto text-xs font-medium text-primary group-hover:underline">
              Открыть &rarr;
            </span>
          </Link>

          {/* Set Filters */}
          <Link
            href="/set-filters"
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              <Tag size={22} />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">Назначить фильтры товарам</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Выберите категорию и подкатегорию, затем назначьте фильтры каждому товару.
              </p>
            </div>
            <span className="mt-auto text-xs font-medium text-primary group-hover:underline">
              Перейти к редактированию товаров &rarr;
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
