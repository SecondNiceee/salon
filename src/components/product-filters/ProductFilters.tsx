"use client"

import { useState } from "react"
import type { FilterConfig } from "@/payload-types"
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from "lucide-react"

export type ActiveFilters = Record<string, string[]>

type FilterDef = NonNullable<FilterConfig["filters"]>[number]
type VisibilityRule = NonNullable<FilterDef["visibilityRules"]>[number]

interface ProductFiltersProps {
  filterConfig: FilterConfig
  activeFilters: ActiveFilters
  onChange: (filters: ActiveFilters) => void
}

export function ProductFilters({ filterConfig, activeFilters, onChange }: ProductFiltersProps) {
  console.log("[v0] ProductFilters received filterConfig:", JSON.stringify(filterConfig, null, 2))
  
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const filters = filterConfig.filters ?? []
  const basicFilters = filters.filter((f) => !f.isAdvanced)
  const advancedFilters = filters.filter((f) => f.isAdvanced)

  const totalActiveCount = Object.values(activeFilters).flat().length

  const handleChange = (key: string, value: string, type: "checkbox" | "radio") => {
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
   * Вычислить действие для конкретной опции на основе visibilityRules
   * Возможные результаты: "hide" | "highlight" | null
   */
  function getOptionAction(rules: VisibilityRule[] | null | undefined, optionValue: string): "hide" | "highlight" | null {
    console.log("[v0] getOptionAction called:", { rules, optionValue, activeFilters })
    if (!rules || rules.length === 0) {
      console.log("[v0] No rules found for this filter")
      return null
    }
    let result: "hide" | "highlight" | null = null
    for (const rule of rules) {
      console.log("[v0] Checking rule:", rule)
      if (rule.targetOptionValue !== optionValue) {
        console.log("[v0] Rule targetOptionValue doesn't match optionValue")
        continue
      }
      const selectedValues = activeFilters[rule.whenFilterKey] ?? []
      console.log("[v0] selectedValues for", rule.whenFilterKey, ":", selectedValues)
      if (selectedValues.includes(rule.whenFilterValue)) {
        console.log("[v0] Rule matched! Action:", rule.action)
        // "hide" takes priority over "highlight"
        if (rule.action === "hide") return "hide"
        result = "highlight"
      }
    }
    console.log("[v0] Final result:", result)
    return result
  }

  const renderFilter = (filter: FilterDef) => {
    const selected = activeFilters[filter.key] ?? []
    const options = filter.options ?? []
    const rules = filter.visibilityRules as VisibilityRule[] | null | undefined
    
    console.log("[v0] renderFilter:", { 
      key: filter.key, 
      label: filter.label,
      hasRules: !!rules && rules.length > 0,
      rules,
      activeFilters 
    })

    return (
      <div key={filter.key} className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-gray-700">{filter.label}</p>
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const action = getOptionAction(rules, opt.value)
            if (action === "hide") return null

            const isSelected = selected.includes(opt.value)
            const isHighlighted = action === "highlight"

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleChange(filter.key, opt.value, filter.type)}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors duration-150 ${
                  isSelected
                    ? "bg-pink-500 border-pink-500 text-white"
                    : isHighlighted
                      ? "bg-amber-50 border-amber-400 text-amber-800 font-semibold ring-1 ring-amber-300"
                      : "bg-white border-gray-300 text-gray-700 hover:border-pink-400"
                }`}
              >
                {isHighlighted && !isSelected && (
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

        {advancedFilters.length > 0 && (
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
