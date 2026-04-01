"use client"

import { useState } from "react"
import type { Category, FilterConfig } from "@/payload-types"
import {
  createFilterConfig,
  updateFilterConfig,
  deleteFilterConfig,
  toggleFiltersEnabled,
  type Filter,
  type FilterOption,
  type VisibilityRule,
  type ShowWhenRule,
} from "./actions"
import Link from "next/link"
import { Plus, Pencil, Trash2, X, ChevronDown, ChevronUp, Eye, EyeOff, Sparkles, ArrowUp, ArrowDown, AlertCircle } from "lucide-react"

type Props = {
  initialCategories: Category[]
  initialFilterConfigs: FilterConfig[]
}

// Get category title with parent info
function getCategoryLabel(category: Category | number | null | undefined, allCategories: Category[]): string {
  if (!category) return "—"
  const cat = typeof category === "number" ? allCategories.find((c) => c.id === category) : category
  if (!cat) return "—"
  
  const parent = cat.parent
  if (parent && typeof parent === "object") {
    return `${parent.title} → ${cat.title}`
  }
  return cat.title
}

export default function FiltersAdminClient({ initialCategories, initialFilterConfigs }: Props) {
  const [categories] = useState<Category[]>(initialCategories)
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>(initialFilterConfigs)
  
  // Edit mode state
  const [editingConfigId, setEditingConfigId] = useState<number | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  
  // Form state
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [filters, setFilters] = useState<Filter[]>([])
  const [expandedFilterIndex, setExpandedFilterIndex] = useState<number | null>(null)
  
  // UI state
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // isEnabled toggle state per config id
  const [enabledMap, setEnabledMap] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {}
    for (const fc of initialFilterConfigs) {
      map[fc.id] = (fc as any).isEnabled !== false
    }
    return map
  })
  const [togglingId, setTogglingId] = useState<number | null>(null)

  async function handleToggleEnabled(configId: number) {
    const next = !enabledMap[configId]
    setTogglingId(configId)
    setEnabledMap((prev) => ({ ...prev, [configId]: next }))
    await toggleFiltersEnabled(configId, next)
    setTogglingId(null)
  }

  // Categories not yet assigned to a filter config
  const usedCategoryIds = new Set(
    filterConfigs.map((fc) => (typeof fc.category === "number" ? fc.category : fc.category?.id))
  )
  const availableCategories = categories.filter((c) => !usedCategoryIds.has(c.id))

  function resetForm() {
    setSelectedCategoryId(null)
    setFilters([])
    setExpandedFilterIndex(null)
    setEditingConfigId(null)
    setIsCreating(false)
    setError(null)
  }

  function startCreate() {
    resetForm()
    setIsCreating(true)
  }

  function startEdit(config: FilterConfig) {
    setIsCreating(false)
    setEditingConfigId(config.id)
    setSelectedCategoryId(typeof config.category === "number" ? config.category : config.category?.id ?? null)
    setFilters((config.filters as Filter[]) ?? [])
    setExpandedFilterIndex(null)
    setError(null)
    
    // Scroll to top to show the edit form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSave() {
    if (!selectedCategoryId) {
      setError("Выберите категорию")
      return
    }
    if (filters.length === 0) {
      setError("Добавьте хотя бы один фильтр")
      return
    }

    setSaving(true)
    setError(null)

    try {
      if (isCreating) {
        const result = await createFilterConfig({
          categoryId: selectedCategoryId,
          filters,
        })
        if (!result.success) {
          setError(result.error ?? "Ошибка создания")
          setSaving(false)
          return
        }
        // Refresh the list
        window.location.reload()
      } else if (editingConfigId) {
        const result = await updateFilterConfig(editingConfigId, {
          categoryId: selectedCategoryId,
          filters,
        })
        if (!result.success) {
          setError(result.error ?? "Ошибка сохранения")
          setSaving(false)
          return
        }
        window.location.reload()
      }
    } catch (e) {
      setError(String(e))
      setSaving(false)
    }
  }

  async function handleDelete(configId: number) {
    if (!confirm("Удалить этот FilterConfig?")) return
    
    const result = await deleteFilterConfig(configId)
    if (result.success) {
      setFilterConfigs((prev) => prev.filter((fc) => fc.id !== configId))
      if (editingConfigId === configId) {
        resetForm()
      }
    } else {
      alert(result.error ?? "Ошибка удаления")
    }
  }

  // Filter management
  function addFilter() {
    const newFilter: Filter = {
      key: `filter_${Date.now()}`,
      label: "Новый фильтр",
      type: "checkbox",
      isAdvanced: false,
      options: [],
      showWhenRules: [],
      visibilityRules: [],
    }
    setFilters((prev) => [...prev, newFilter])
    setExpandedFilterIndex(filters.length)
  }

  function updateFilter(index: number, updates: Partial<Filter>) {
    setFilters((prev) => prev.map((f, i) => (i === index ? { ...f, ...updates } : f)))
  }

  function removeFilter(index: number) {
    setFilters((prev) => prev.filter((_, i) => i !== index))
    if (expandedFilterIndex === index) {
      setExpandedFilterIndex(null)
    }
  }

  function moveFilterUp(index: number) {
    if (index === 0) return
    setFilters((prev) => {
      const next = [...prev]
      ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
      return next
    })
    setExpandedFilterIndex((prev) => (prev === index ? index - 1 : prev === index - 1 ? index : prev))
  }

  function moveFilterDown(index: number) {
    setFilters((prev) => {
      if (index >= prev.length - 1) return prev
      const next = [...prev]
      ;[next[index], next[index + 1]] = [next[index + 1], next[index]]
      return next
    })
    setExpandedFilterIndex((prev) => (prev === index ? index + 1 : prev === index + 1 ? index : prev))
  }

  // Option management
  function addOption(filterIndex: number) {
    const filter = filters[filterIndex]
    const newOption: FilterOption = {
      value: `opt_${Date.now()}`,
      label: "Новая опция",
    }
    updateFilter(filterIndex, {
      options: [...(filter.options ?? []), newOption],
    })
  }

  function updateOption(filterIndex: number, optionIndex: number, updates: Partial<FilterOption>) {
    const filter = filters[filterIndex]
    const newOptions = (filter.options ?? []).map((opt, i) =>
      i === optionIndex ? { ...opt, ...updates } : opt
    )
    updateFilter(filterIndex, { options: newOptions })
  }

  function removeOption(filterIndex: number, optionIndex: number) {
    const filter = filters[filterIndex]
    const newOptions = (filter.options ?? []).filter((_, i) => i !== optionIndex)
    updateFilter(filterIndex, { options: newOptions })
  }

  // ShowWhen rules management (show filter when condition is met)
  function addShowWhenRule(filterIndex: number) {
    const filter = filters[filterIndex]
    const newRule: ShowWhenRule = {
      whenFilterKey: "",
      whenFilterValue: "",
    }
    updateFilter(filterIndex, {
      showWhenRules: [...(filter.showWhenRules ?? []), newRule],
    })
  }

  function updateShowWhenRule(filterIndex: number, ruleIndex: number, updates: Partial<ShowWhenRule>) {
    const filter = filters[filterIndex]
    const newRules = (filter.showWhenRules ?? []).map((rule, i) =>
      i === ruleIndex ? { ...rule, ...updates } : rule
    )
    updateFilter(filterIndex, { showWhenRules: newRules })
  }

  function removeShowWhenRule(filterIndex: number, ruleIndex: number) {
    const filter = filters[filterIndex]
    const newRules = (filter.showWhenRules ?? []).filter((_, i) => i !== ruleIndex)
    updateFilter(filterIndex, { showWhenRules: newRules })
  }

  // Visibility rules management
  function addVisibilityRule(filterIndex: number) {
    const filter = filters[filterIndex]
    const newRule: VisibilityRule = {
      targetOptionValue: "",
      action: "highlight",
      whenFilterKey: "",
      whenFilterValue: "",
    }
    updateFilter(filterIndex, {
      visibilityRules: [...(filter.visibilityRules ?? []), newRule],
    })
  }

  function updateVisibilityRule(filterIndex: number, ruleIndex: number, updates: Partial<VisibilityRule>) {
    const filter = filters[filterIndex]
    const newRules = (filter.visibilityRules ?? []).map((rule, i) =>
      i === ruleIndex ? { ...rule, ...updates } : rule
    )
    updateFilter(filterIndex, { visibilityRules: newRules })
  }

  function removeVisibilityRule(filterIndex: number, ruleIndex: number) {
    const filter = filters[filterIndex]
    const newRules = (filter.visibilityRules ?? []).filter((_, i) => i !== ruleIndex)
    updateFilter(filterIndex, { visibilityRules: newRules })
  }

  // Get all options from other filters (for visibility rules)
  // Exclude range filters as they don't have options
  function getOtherFiltersOptions(currentFilterIndex: number) {
    return filters
      .filter((_, i) => i !== currentFilterIndex)
      .filter((f) => f.type !== "range") // Range filters have no options
      .map((f) => ({
        filterKey: f.key,
        filterLabel: f.label,
        options: f.options ?? [],
      }))
  }

  const isFormOpen = isCreating || editingConfigId !== null

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground mb-1">Управление ф��льтрами</h1>
            <p className="text-sm text-muted-foreground">
              Создавайте и редактируйте конфигурации фильтров для категорий.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/set-filters"
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:opacity-80 transition-opacity border border-border"
            >
              Редактировать товары
            </Link>
            {!isFormOpen && (
              <button
                onClick={startCreate}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Plus size={16} />
                Создать
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        {isFormOpen && (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground">
                {isCreating ? "Новый FilterConfig" : "Редактирование"}
              </h2>
              <button
                onClick={resetForm}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Category selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-foreground mb-2">
                Категория
              </label>
              <select
                value={selectedCategoryId ?? ""}
                onChange={(e) => setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="w-full max-w-md rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">-- выберите категорию --</option>
                {(editingConfigId ? categories : availableCategories).map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {getCategoryLabel(cat, categories)}
                  </option>
                ))}
              </select>
            </div>

            {/* Filters */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-foreground">Фильтры</label>
                <button
                  onClick={addFilter}
                  className="flex items-center gap-1 text-xs text-primary hover:opacity-80 font-medium"
                >
                  <Plus size={14} />
                  Добавить фильтр
                </button>
              </div>

              {filters.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                  Нет фильтров. Нажмите «Добавить фильтр».
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filters.map((filter, filterIndex) => {
                    const isExpanded = expandedFilterIndex === filterIndex
                    const otherFilters = getOtherFiltersOptions(filterIndex)

                    return (
                      <div
                        key={filterIndex}
                        className="rounded-lg border border-border bg-background overflow-hidden"
                      >
                        {/* Filter header */}
                        <div
                          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setExpandedFilterIndex(isExpanded ? null : filterIndex)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground text-xs font-semibold shrink-0">
                              {filterIndex + 1}
                            </span>
                            <span className="font-medium text-sm text-foreground">
                              {filter.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({filter.key})
                            </span>
                            {filter.isAdvanced && (
                              <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                Расширенный
                              </span>
                            )}
                            {filter.type === "range" && (
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                ��иапазон
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                moveFilterUp(filterIndex)
                              }}
                              disabled={filterIndex === 0}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                              title="Переместить вверх"
                            >
                              <ArrowUp size={14} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                moveFilterDown(filterIndex)
                              }}
                              disabled={filterIndex === filters.length - 1}
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                              title="Переместить вниз"
                            >
                              <ArrowDown size={14} />
                            </button>
                            <div className="w-px h-4 bg-border mx-1" />
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                removeFilter(filterIndex)
                              }}
                              className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                            <div className="ml-1">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                        </div>

                        {/* Filter content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 border-t border-border pt-4">
                            {/* Basic fields */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                  Key (уникальный)
                                </label>
                                <input
                                  type="text"
                                  value={filter.key}
                                  onChange={(e) => updateFilter(filterIndex, { key: e.target.value })}
                                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                  Label (название)
                                </label>
                                <input
                                  type="text"
                                  value={filter.label}
                                  onChange={(e) => updateFilter(filterIndex, { label: e.target.value })}
                                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <label className="block text-xs font-medium text-muted-foreground mb-1">
                                  Тип
                                </label>
                                <select
                                  value={filter.type}
                                  onChange={(e) => {
                                    const newType = e.target.value as "checkbox" | "radio" | "range"
                                    updateFilter(filterIndex, {
                                      type: newType,
                                      // Clear range fields when switching away from range
                                      ...(newType !== "range" ? { rangeMin: undefined, rangeMax: undefined, rangeStep: undefined, rangeUnit: undefined } : {}),
                                      // Clear options when switching to range
                                      ...(newType === "range" ? { options: [] } : {}),
                                    })
                                  }}
                                  className="w-full rounded-md border border-border bg-background text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                >
                                  <option value="checkbox">Checkbox (множественный)</option>
                                  <option value="radio">Radio (одиночный)</option>
                                  <option value="range">Диапазон (ползунок)</option>
                                </select>
                              </div>
                              <div className="flex items-end">
                                <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={filter.isAdvanced ?? false}
                                    onChange={(e) => updateFilter(filterIndex, { isAdvanced: e.target.checked })}
                                    className="rounded border-border"
                                  />
                                  Расширенный (скрыт по умолчанию)
                                </label>
                              </div>
                            </div>

                            {/* Range settings OR Options depending on type */}
                            {filter.type === "range" ? (
                              <div className="mb-4 rounded-lg border border-border bg-muted/20 p-4">
                                <label className="block text-xs font-semibold text-foreground mb-3">
                                  Настройки диапазона
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                      Минимум
                                    </label>
                                    <input
                                      type="number"
                                      value={filter.rangeMin ?? 0}
                                      onChange={(e) => updateFilter(filterIndex, { rangeMin: Number(e.target.value) })}
                                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                      Максимум
                                    </label>
                                    <input
                                      type="number"
                                      value={filter.rangeMax ?? 120}
                                      onChange={(e) => updateFilter(filterIndex, { rangeMax: Number(e.target.value) })}
                                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                      Шаг
                                    </label>
                                    <input
                                      type="number"
                                      value={filter.rangeStep ?? 30}
                                      onChange={(e) => updateFilter(filterIndex, { rangeStep: Number(e.target.value) })}
                                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs text-muted-foreground mb-1">
                                      Единица измерения
                                    </label>
                                    <input
                                      type="text"
                                      placeholder='мин, ч, ₽...'
                                      value={filter.rangeUnit ?? ""}
                                      onChange={(e) => updateFilter(filterIndex, { rangeUnit: e.target.value })}
                                      className="w-full rounded-md border border-border bg-background text-foreground px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    />
                                  </div>
                                </div>
                                {/* Preview */}
                                <div className="mt-3 text-xs text-muted-foreground">
                                  Ползунок: от {filter.rangeMin ?? 0} до {filter.rangeMax ?? 120} с шагом {filter.rangeStep ?? 30}
                                  {filter.rangeUnit ? ` ${filter.rangeUnit}` : ""}
                                </div>
                              </div>
                            ) : (
                              /* Options block for checkbox / radio */
                              <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Опции
                                </label>
                                <button
                                  onClick={() => addOption(filterIndex)}
                                  className="text-xs text-primary hover:opacity-80 font-medium"
                                >
                                  + Добавить опцию
                                </button>
                              </div>
                              {(filter.options ?? []).length === 0 ? (
                                <div className="text-xs text-muted-foreground italic">Нет опций</div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  {(filter.options ?? []).map((opt, optIndex) => (
                                    <div key={optIndex} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        placeholder="value"
                                        value={opt.value}
                                        onChange={(e) =>
                                          updateOption(filterIndex, optIndex, { value: e.target.value })
                                        }
                                        className="flex-1 rounded-md border border-border bg-background text-foreground px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                      />
                                      <input
                                        type="text"
                                        placeholder="label"
                                        value={opt.label}
                                        onChange={(e) =>
                                          updateOption(filterIndex, optIndex, { label: e.target.value })
                                        }
                                        className="flex-1 rounded-md border border-border bg-background text-foreground px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                      />
                                      <button
                                        onClick={() => removeOption(filterIndex, optIndex)}
                                        className="p-1 text-muted-foreground hover:text-red-500"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            )}

                            {/* Show When Rules - conditions for showing the entire filter */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Показывать фильтр при условии
                                </label>
                                <button
                                  onClick={() => addShowWhenRule(filterIndex)}
                                  className="text-xs text-primary hover:opacity-80 font-medium"
                                >
                                  + Добавить условие
                                </button>
                              </div>

                              {(filter.showWhenRules ?? []).length === 0 ? (
                                <div className="text-xs text-muted-foreground italic">
                                  Фильтр показывается всегда (нет условий)
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                                    Фильтр скрыт по умолчанию. Появится когда выполнится одно из условий:
                                  </div>
                                  {(filter.showWhenRules ?? []).map((rule, ruleIndex) => (
                                    <div
                                      key={ruleIndex}
                                      className="rounded-md border border-border bg-amber-50/50 p-3"
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <Eye size={14} className="text-amber-500" />
                                          Условие #{ruleIndex + 1}
                                        </div>
                                        <button
                                          onClick={() => removeShowWhenRule(filterIndex, ruleIndex)}
                                          className="p-1 text-muted-foreground hover:text-red-500"
                                        >
                                          <X size={12} />
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3">
                                        {/* When filter */}
                                        <div>
                                          <label className="block text-xs text-muted-foreground mb-1">
                                            Когда в фильтре
                                          </label>
                                          <select
                                            value={rule.whenFilterKey}
                                            onChange={(e) =>
                                              updateShowWhenRule(filterIndex, ruleIndex, {
                                                whenFilterKey: e.target.value,
                                                whenFilterValue: "",
                                              })
                                            }
                                            className="w-full rounded-md border border-border bg-background text-foreground px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                          >
                                            <option value="">-- выберите --</option>
                                            {otherFilters.map((f) => (
                                              <option key={f.filterKey} value={f.filterKey}>
                                                {f.filterLabel}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* When value */}
                                        <div>
                                          <label className="block text-xs text-muted-foreground mb-1">
                                            Выбрано значение
                                          </label>
                                          <select
                                            value={rule.whenFilterValue}
                                            onChange={(e) =>
                                              updateShowWhenRule(filterIndex, ruleIndex, {
                                                whenFilterValue: e.target.value,
                                              })
                                            }
                                            className="w-full rounded-md border border-border bg-background text-foreground px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                            disabled={!rule.whenFilterKey}
                                          >
                                            <option value="">-- выберите --</option>
                                            {otherFilters
                                              .find((f) => f.filterKey === rule.whenFilterKey)
                                              ?.options.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                  {opt.label}
                                                </option>
                                              ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Visibility Rules — only for checkbox/radio (range has no options) */}
                            {filter.type !== "range" && (
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <label className="text-xs font-medium text-muted-foreground">
                                  Правила видимости опций
                                </label>
                                <button
                                  onClick={() => addVisibilityRule(filterIndex)}
                                  className="text-xs text-primary hover:opacity-80 font-medium"
                                >
                                  + Добавить правило
                                </button>
                              </div>

                              {(filter.visibilityRules ?? []).length === 0 ? (
                                <div className="text-xs text-muted-foreground italic">
                                  Нет правил видимости
                                </div>
                              ) : (
                                <div className="flex flex-col gap-3">
                                  {(filter.visibilityRules ?? []).map((rule, ruleIndex) => (
                                    <div
                                      key={ruleIndex}
                                      className="rounded-md border border-border bg-muted/30 p-3"
                                    >
                                      <div className="flex items-start justify-between gap-2 mb-3">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          {rule.action === "hide" ? (
                                            <EyeOff size={14} className="text-red-500" />
                                          ) : rule.action === "autoselect" ? (
                                            <AlertCircle size={14} className="text-orange-500" />
                                          ) : (
                                            <Sparkles size={14} className="text-yellow-500" />
                                          )}
                                          Правило #{ruleIndex + 1}
                                        </div>
                                        <button
                                          onClick={() => removeVisibilityRule(filterIndex, ruleIndex)}
                                          className="p-1 text-muted-foreground hover:text-red-500"
                                        >
                                          <X size={12} />
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3">
                                        {/* Target option */}
                                        <div>
                                          <label className="block text-xs text-muted-foreground mb-1">
                                            Целевая опция (этого фильтра)
                                          </label>
                                          <select
                                            value={rule.targetOptionValue}
                                            onChange={(e) =>
                                              updateVisibilityRule(filterIndex, ruleIndex, {
                                                targetOptionValue: e.target.value,
                                              })
                                            }
                                            className="w-full rounded-md border border-border bg-background text-foreground px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                          >
                                            <option value="">-- выберите --</option>
                                            {(filter.options ?? []).map((opt) => (
                                              <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* Action */}
                                        <div>
                                          <label className="block text-xs text-muted-foreground mb-1">
                                            Действие
                                          </label>
                                          <select
                                            value={rule.action}
                                            onChange={(e) =>
                                              updateVisibilityRule(filterIndex, ruleIndex, {
                                                action: e.target.value as "hide" | "highlight",
                                              })
                                            }
                                            className="w-full rounded-md border border-border bg-background text-foreground px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                          >
                                            <option value="highlight">Подсветить</option>
                                            <option value="hide">Скрыть</option>
                                            <option value="autoselect">Выбрать автоматически (нельзя снять)</option>
                                          </select>
                                        </div>

                                        {/* When filter */}
                                        <div>
                                          <label className="block text-xs text-muted-foreground mb-1">
                                            Когда выбран фильтр
                                          </label>
                                          <select
                                            value={rule.whenFilterKey}
                                            onChange={(e) =>
                                              updateVisibilityRule(filterIndex, ruleIndex, {
                                                whenFilterKey: e.target.value,
                                                whenFilterValue: "",
                                              })
                                            }
                                            className="w-full rounded-md border border-border bg-background text-foreground px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                          >
                                            <option value="">-- выберите --</option>
                                            {otherFilters.map((f) => (
                                              <option key={f.filterKey} value={f.filterKey}>
                                                {f.filterLabel}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        {/* When value */}
                                        <div>
                                          <label className="block text-xs text-muted-foreground mb-1">
                                            Со значением
                                          </label>
                                          <select
                                            value={rule.whenFilterValue}
                                            onChange={(e) =>
                                              updateVisibilityRule(filterIndex, ruleIndex, {
                                                whenFilterValue: e.target.value,
                                              })
                                            }
                                            className="w-full rounded-md border border-border bg-background text-foreground px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                            disabled={!rule.whenFilterKey}
                                          >
                                            <option value="">-- выберите --</option>
                                            {otherFilters
                                              .find((f) => f.filterKey === rule.whenFilterKey)
                                              ?.options.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                  {opt.label}
                                                </option>
                                              ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            )} {/* end filter.type !== "range" */}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Save button */}
            <div className="flex justify-end gap-3">
              <button
                onClick={resetForm}
                className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Сохранение..." : isCreating ? "Создать" : "Сохранить"}
              </button>
            </div>
          </div>
        )}

        {/* List of existing filter configs */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Существующие FilterConfigs</h2>
          
          {filterConfigs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              Нет созданных FilterConfigs.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filterConfigs.map((config) => {
                const filtersCount = (config.filters as Filter[] | undefined)?.length ?? 0
                const categoryLabel = getCategoryLabel(config.category, categories)

                return (
                  <div
                    key={config.id}
                    className="rounded-xl border border-border bg-card px-5 py-4 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm">{categoryLabel}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {filtersCount} фильтр(ов)
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Toggle isEnabled */}
                      <button
                        onClick={() => handleToggleEnabled(config.id)}
                        disabled={togglingId === config.id}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 ${
                          enabledMap[config.id]
                            ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                            : "bg-muted border-border text-muted-foreground hover:bg-muted/70"
                        }`}
                        title={enabledMap[config.id] ? "Фильтры включены — нажмите чтобы скрыть" : "Фильтры скрыты — нажмите чтобы показать"}
                      >
                        {enabledMap[config.id] ? <Eye size={13} /> : <EyeOff size={13} />}
                        {enabledMap[config.id] ? "Отображать фильтры" : "Скрыто"}
                      </button>
                      <button
                        onClick={() => startEdit(config)}
                        className="p-2 text-muted-foreground hover:text-primary transition-colors"
                        title="Редактировать"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(config.id)}
                        className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
