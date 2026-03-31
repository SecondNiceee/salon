"use client"

import { useState } from "react"
import type { Category, Product, FilterConfig } from "@/payload-types"
import {
  getSubcategories,
  getProductsBySubCategory,
  getFilterConfigByCategory,
  checkCategoryHasSubFilters,
  updateProductFilterValues,
} from "./actions"

type FilterOption = { value: string; label: string }
type Filter = { key: string; label: string; options?: FilterOption[] | null }

type Props = {
  categories: Category[]
}

export default function SetFiltersClient({ categories }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [subcategories, setSubcategories] = useState<Category[]>([])
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null)
  const [hasSubFilters, setHasSubFilters] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [filterConfig, setFilterConfig] = useState<FilterConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState<Record<number, boolean>>({})
  const [saved, setSaved] = useState<Record<number, boolean>>({})

  // Local edits: productId -> { key: value }
  const [edits, setEdits] = useState<Record<number, Record<string, string>>>({})

  async function handleCategorySelect(categoryId: number) {
    setSelectedCategoryId(categoryId)
    setSelectedSubcategoryId(null)
    setProducts([])
    setFilterConfig(null)
    setEdits({})
    setSaved({})
    setLoading(true)

    // Check if category itself has a filter config
    const directFilterConfig = await getFilterConfigByCategory(categoryId)

    if (directFilterConfig) {
      // Category has its own filter config — load products by subCategory = categoryId (unlikely case)
      // But actually in this setup, products are linked via subCategory
      // So if the main category has filters, we show products where category includes this ID
      setFilterConfig(directFilterConfig)
      setHasSubFilters(false)
      setSubcategories([])
      setLoading(false)
      return
    }

    // Check if subcategories have filter configs
    const hasSubcategoryFilters = await checkCategoryHasSubFilters(categoryId)

    if (hasSubcategoryFilters) {
      const subs = await getSubcategories(categoryId)
      setSubcategories(subs)
      setHasSubFilters(true)
    } else {
      setSubcategories([])
      setHasSubFilters(false)
    }

    setLoading(false)
  }

  async function handleSubcategorySelect(subCategoryId: number) {
    setSelectedSubcategoryId(subCategoryId)
    setLoading(true)
    setEdits({})
    setSaved({})

    const [prods, fConfig] = await Promise.all([
      getProductsBySubCategory(subCategoryId),
      getFilterConfigByCategory(subCategoryId),
    ])

    // Initialize edits from existing filterValues
    const initial: Record<number, Record<string, string>> = {}
    for (const p of prods) {
      initial[p.id] = {}
      if (p.filterValues) {
        for (const fv of p.filterValues as { key: string; value: string }[]) {
          initial[p.id][fv.key] = fv.value
        }
      }
    }

    setProducts(prods)
    setFilterConfig(fConfig)
    setEdits(initial)
    setLoading(false)
  }

  function handleFilterChange(productId: number, key: string, value: string) {
    setEdits((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [key]: value,
      },
    }))
    setSaved((prev) => ({ ...prev, [productId]: false }))
  }

  async function handleSave(productId: number) {
    setSaving((prev) => ({ ...prev, [productId]: true }))
    const filterValues = Object.entries(edits[productId] ?? {})
      .filter(([, v]) => v !== "")
      .map(([key, value]) => ({ key, value }))

    const result = await updateProductFilterValues(productId, filterValues)
    setSaving((prev) => ({ ...prev, [productId]: false }))
    if (result.success) {
      setSaved((prev) => ({ ...prev, [productId]: true }))
    }
  }

  const filters: Filter[] = (filterConfig?.filters as Filter[] | undefined) ?? []

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-foreground mb-1">Назначить фильтры товарам</h1>
          <p className="text-sm text-muted-foreground">
            Выберите категорию, затем подкатегорию (если есть), и назначьте каждому товару нужные фильтры.
          </p>
        </div>

        {/* Category Selector */}
        <div className="mb-6">
          <p className="text-sm font-medium text-foreground mb-3">Категория</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  selectedCategoryId === cat.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-primary/60"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>
        </div>

        {/* Subcategory Selector */}
        {hasSubFilters && subcategories.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Подкатегория</p>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSubcategorySelect(sub.id)}
                  className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                    selectedSubcategoryId === sub.id
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-foreground border-border hover:border-primary/60"
                  }`}
                >
                  {sub.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* No filters warning */}
        {selectedCategoryId && !loading && !hasSubFilters && !filterConfig && (
          <div className="rounded-lg border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
            У этой категории нет настроенных фильтров (FilterConfig). Создайте FilterConfig для категории или её подкатегорий.
          </div>
        )}

        {/* Need to select subcategory */}
        {selectedCategoryId && !loading && hasSubFilters && !selectedSubcategoryId && (
          <div className="rounded-lg border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
            Выберите подкатегорию, чтобы увидеть товары и их фильтры.
          </div>
        )}

        {/* Filter legend */}
        {filterConfig && filters.length > 0 && (
          <div className="mb-6 rounded-lg border border-border bg-card px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
              Доступные фильтры
            </p>
            <div className="flex flex-wrap gap-3">
              {filters.map((f) => (
                <div key={f.key} className="text-xs">
                  <span className="font-medium text-foreground">{f.label}</span>
                  <span className="text-muted-foreground ml-1">
                    ({f.options?.map((o) => o.label).join(", ")})
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground py-8">
            <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            Загрузка...
          </div>
        )}

        {/* Products list */}
        {!loading && products.length > 0 && filterConfig && (
          <div className="flex flex-col gap-3">
            {products.map((product) => {
              const productEdits = edits[product.id] ?? {}
              const isSaving = saving[product.id]
              const isSaved = saved[product.id]

              return (
                <div
                  key={product.id}
                  className="rounded-xl border border-border bg-card px-5 py-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    {/* Product info */}
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm leading-snug truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {(product.price ?? 0).toLocaleString("ru-RU")} RUB
                      </p>
                    </div>

                    {/* Save button */}
                    <button
                      onClick={() => handleSave(product.id)}
                      disabled={isSaving}
                      className={`shrink-0 text-xs px-3 py-1.5 rounded-md font-medium transition-colors ${
                        isSaved
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-primary text-primary-foreground hover:opacity-90"
                      } disabled:opacity-50`}
                    >
                      {isSaving ? "..." : isSaved ? "OK" : "Сохранить"}
                    </button>
                  </div>

                  {/* Filter dropdowns */}
                  {filters.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-3">
                      {filters.map((filter) => (
                        <div key={filter.key} className="flex flex-col gap-1 min-w-36">
                          <label className="text-xs text-muted-foreground font-medium">
                            {filter.label}
                          </label>
                          <select
                            value={productEdits[filter.key] ?? ""}
                            onChange={(e) =>
                              handleFilterChange(product.id, filter.key, e.target.value)
                            }
                            className="text-sm rounded-md border border-border bg-background text-foreground px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="">-- не выбрано --</option>
                            {(filter.options ?? []).map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Empty state */}
        {!loading && selectedSubcategoryId && products.length === 0 && filterConfig && (
          <div className="text-sm text-muted-foreground py-4">
            В этой подкатегории нет товаров.
          </div>
        )}

        {/* No filter config for selected subcategory */}
        {!loading && selectedSubcategoryId && !filterConfig && (
          <div className="rounded-lg border border-border bg-card px-5 py-4 text-sm text-muted-foreground">
            У этой подкатегории нет настроенных фильтров (FilterConfig).
          </div>
        )}
      </div>
    </div>
  )
}
