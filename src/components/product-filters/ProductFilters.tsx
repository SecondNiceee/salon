"use client"

import { useState, useMemo, useEffect } from "react"
import type { FilterConfig } from "@/payload-types"
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react"

export type ActiveFilters = Record<string, string[]>

type FilterDef = NonNullable<FilterConfig["filters"]>[number]
type VisibilityRule = NonNullable<FilterDef["visibilityRules"]>[number]
type ShowWhenRule = { whenFilterKey: string; whenFilterValue: string }
type VisibilityAction = "hide" | "highlight" | "autoselect" | null

interface ProductFiltersProps {
  filterConfig: FilterConfig
  activeFilters: ActiveFilters
  onChange: (filters: ActiveFilters) => void
  /** Вызывается когда меняются эффективные фильтры (включая autoselect) - используйте для фильтрации продуктов */
  onEffectiveFiltersChange?: (filters: ActiveFilters) => void
}

export function ProductFilters({ filterConfig, activeFilters, onChange, onEffectiveFiltersChange }: ProductFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const filters = filterConfig.filters ?? []
  const basicFilters = filters.filter((f) => !f.isAdvanced)
  const advancedFilters = filters.filter((f) => f.isAdvanced)

  /**
   * Вычислить действие для конкретной опции на основе visibilityRules
   * Принимает effectiveFilters для корректной проверки с учётом autoselect
   * Приоритет: hide > autoselect > highlight
   */
  function getOptionActionWithFilters(
    rules: VisibilityRule[] | null | undefined, 
    optionValue: string,
    effectiveFilters: ActiveFilters
  ): VisibilityAction {
    if (!rules || rules.length === 0) {
      return null
    }
    let result: VisibilityAction = null
    for (const rule of rules) {
      if (rule.targetOptionValue !== optionValue) {
        continue
      }
      const selectedValues = effectiveFilters[rule.whenFilterKey] ?? []
      if (selectedValues.includes(rule.whenFilterValue)) {
        if (rule.action === "hide") return "hide"
        if (rule.action === "autoselect") result = "autoselect"
        if (rule.action === "highlight" && result !== "autoselect") result = "highlight"
      }
    }
    return result
  }

  /**
   * Вычисляем "эффективные" фильтры, которые включают все autoselect значения.
   * Это нужно чтобы showWhenRules других фильтров корректно работали
   * когда зависят от autoselect-значений.
   * 
   * Используем итеративный подход для обработки цепочек autoselect:
   * A -> autoselect B -> показать C (где C зависит от B)
   */
  const effectiveFilters = useMemo(() => {
    let result = { ...activeFilters }
    let changed = true
    let iterations = 0
    const maxIterations = 10 // Защита от бесконечного цикла
    
    while (changed && iterations < maxIterations) {
      changed = false
      iterations++
      
      for (const filter of filters) {
        // Validate and properly cast visibilityRules
        let rules: VisibilityRule[] | null = null
        if (Array.isArray(filter.visibilityRules) && filter.visibilityRules.length > 0) {
          rules = filter.visibilityRules.filter(rule => 
            rule && 
            typeof rule === 'object' && 
            'targetOptionValue' in rule && 
            'action' in rule && 
            'whenFilterKey' in rule && 
            'whenFilterValue' in rule
          ) as VisibilityRule[]
        }
        
        if (!rules) continue
        
        const currentValues = result[filter.key] ?? []
        const autoselectedValues: string[] = []
        
        for (const opt of filter.options ?? []) {
          const action = getOptionActionWithFilters(rules, opt.value, result)
          if (action === "autoselect" && !currentValues.includes(opt.value)) {
            autoselectedValues.push(opt.value)
          }
        }
        
        if (autoselectedValues.length > 0) {
          result = {
            ...result,
            [filter.key]: Array.from(new Set([...currentValues, ...autoselectedValues]))
          }
          changed = true
        }
      }
    }
    
    return result
  }, [activeFilters, filters])

  // Уведомляем родителя об изменении effectiveFilters
  useEffect(() => {
    if (onEffectiveFiltersChange) {
      onEffectiveFiltersChange(effectiveFilters)
    }
  }, [effectiveFilters, onEffectiveFiltersChange])

  const totalActiveCount = Object.values(effectiveFilters).flat().length

  const handleChange = (key: string, value: string, type: "checkbox" | "radio", locked?: boolean) => {
    if (locked) return // autoselected options cannot be deselected
    const current = activeFilters[key] ?? []
    let next: string[]
    if (type === "radio") {
      next = current.includes(value) ? [] : [value]
    } else {
      next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
    }
    onChange({ ...activeFilters, [key]: next })
  }

  const clearAll = () => onChange({})

  /**
   * Проверить, должен ли фильтр быть показан на основе showWhenRules
   * Использует effectiveFilters для учёта autoselect значений
   * Если правила не заданы — фильтр показывается всегда
   * Если правила заданы — фильтр показывается когда хотя бы одно условие выполнено
   */
  function shouldShowFilter(filter: FilterDef): boolean {
    const rules = filter.showWhenRules as ShowWhenRule[] | null | undefined
    if (!rules || rules.length === 0) {
      return true // No rules = always show
    }
    // Show if ANY rule condition is met (using effectiveFilters to include autoselected values)
    return rules.some((rule) => {
      const selectedValues = effectiveFilters[rule.whenFilterKey] ?? []
      return selectedValues.includes(rule.whenFilterValue)
    })
  }

  /**
   * Вычислить действие для конкретной опции на основе visibilityRules
   * Приоритет: hide > autoselect > highlight
   */
  function getOptionAction(rules: VisibilityRule[] | null | undefined, optionValue: string): VisibilityAction {
    return getOptionActionWithFilters(rules, optionValue, effectiveFilters)
  }

  /**
   * Собрать набор значений, которые должны быть принудительно выбраны (autoselect)
   * Используется чтобы добавить их в activeFilters не изменяя оригинал
   */
  function getAutoselectedValues(filter: FilterDef, rules: VisibilityRule[] | null): string[] {
    if (!rules) return []
    return (filter.options ?? [])
      .map((opt) => opt.value)
      .filter((val) => getOptionAction(rules, val) === "autoselect")
  }

  const renderFilter = (filter: FilterDef) => {
    // Check if this filter should be shown based on showWhenRules
    if (!shouldShowFilter(filter)) {
      return null
    }

    // Validate and properly cast visibilityRules
    let rules: VisibilityRule[] | null = null
    if (Array.isArray(filter.visibilityRules) && filter.visibilityRules.length > 0) {
      rules = filter.visibilityRules.filter(rule => 
        rule && 
        typeof rule === 'object' && 
        'targetOptionValue' in rule && 
        'action' in rule && 
        'whenFilterKey' in rule && 
        'whenFilterValue' in rule
      ) as VisibilityRule[]
    }

    // Merge autoselected values into the active selection (without mutating state)
    const autoselected = getAutoselectedValues(filter, rules)
    const baseSelected = activeFilters[filter.key] ?? []
    const selected = autoselected.length > 0
      ? Array.from(new Set([...baseSelected, ...autoselected]))
      : baseSelected

    const options = filter.options ?? []

    return (
      <div key={filter.key} className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">{filter.label}</p>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const action = getOptionAction(rules, opt.value)
            if (action === "hide") return null

            const isAutoselected = action === "autoselect"
            const isSelected = selected.includes(opt.value)
            const isHighlighted = action === "highlight"

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChange(filter.key, opt.value, filter.type, isAutoselected)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors duration-150 ${
                  isAutoselected
                    ? "bg-orange-500 border-orange-500 text-white cursor-not-allowed opacity-90"
                    : isSelected
                      ? "bg-pink-500 border-pink-500 text-white"
                      : isHighlighted
                        ? "bg-amber-50 border-amber-400 text-amber-800 font-semibold ring-1 ring-amber-300"
                        : "bg-white border-gray-300 text-gray-700 hover:border-pink-400"
                }`}
              >
                {isAutoselected && (
                  <span className="mr-1">!</span>
                )}
                {isHighlighted && !isSelected && !isAutoselected && (
                  <span className="mr-1 text-amber-500">!</span>
                )}
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (filters.length === 0) return null

  return (
    <div className="w-full mb-6">
      {/* Mobile toggle */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex items-center gap-2 text-sm font-semibold text-gray-700 md:hidden"
        >
          <SlidersHorizontal size={16} />
          Фильтры
          {totalActiveCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs">
              {totalActiveCount}
            </span>
          )}
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {/* Desktop heading */}
        <div className="hidden md:flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">Фильтры</span>
          {totalActiveCount > 0 && (
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pink-500 text-white text-xs">
              {totalActiveCount}
            </span>
          )}
        </div>

        {totalActiveCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-pink-500 transition-colors"
          >
            <X size={13} />
            Сбросить всё
          </button>
        )}
      </div>

      {/* Filter body */}
      <div className={`flex flex-col gap-5 ${isOpen ? "block" : "hidden"} md:flex`}>
        {basicFilters.map(renderFilter)}

        {/* Only show advanced toggle if there are visible advanced filters */}
        {advancedFilters.some(shouldShowFilter) && (
          <>
            {showAdvanced && advancedFilters.map(renderFilter)}
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex items-center gap-1.5 text-sm text-pink-500 hover:text-pink-600 font-medium w-fit"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp size={15} />
                  Меньше параметров
                </>
              ) : (
                <>
                  <ChevronDown size={15} />
                  Ещё параметры
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
