# Range Filter Setup Guide

## Overview
Range фильтр позволяет пользователям выбирать значения из диапазона с помощью ползунка. Идеален для фильтрации по продолжительности, цене, рейтингу и т.д.

## Features
- 🎚️ Интерактивный ползунок с визуальной обратной связью
- 📏 Настраиваемый диапазон (min, max, step)
- 🏷️ Пользовательская единица измерения (мин, ч, ₽, км и т.д.)
- 🎯 Интеллектуальное форматирование (например, 90 мин → 1 ч 30 мин)
- 🔗 Поддержка автоматического выбора (autoselect) при зависимых фильтрах
- ✨ Полная интеграция с системой видимости фильтров

## How to Create a Range Filter

### Through Payload CMS Admin Panel:

1. Navigate to **"Категории, подкатегории, товары" → "Настройка фильтров"**
2. Select or create a filter config for your category
3. Add a new filter:
   - **Key**: `duration` (or any unique identifier)
   - **Label**: `Продолжительность` (what users see)
   - **Type**: `Диапазон (ползунок)` ← SELECT THIS
   - **Min Value**: `30` (example)
   - **Max Value**: `480` (example: 8 hours in minutes)
   - **Step**: `30` (example: 30-minute increments)
   - **Unit**: `мин` (displayed next to values)

### Through API (Example):

```javascript
const filterConfig = {
  filters: [
    {
      key: "duration",
      label: "Продолжительность",
      type: "range",
      rangeMin: 30,
      rangeMax: 480,
      rangeStep: 30,
      rangeUnit: "мин",
      isAdvanced: false
    }
  ]
}
```

## How Products Get Filtered

For range filters, products need a numeric **filterValue** matching the filter key:

```javascript
const product = {
  name: "Массаж спины",
  filterValues: [
    { key: "duration", value: "60" } // ← Stored as string, but is numeric
  ]
}
```

When a user selects "от 60 мин" on the slider:
- The filter stores: `activeFilters = { duration: ["min:60"] }`
- Products with `duration >= 60` are shown

## UI Behavior

### Default State
```
Продолжительность
─────────────────────── Reset button (if selected)
Любая длительность

├─────────────────o── ← Slider at minimum
│ 30мин  1ч  2ч  ...   ← Click to select
```

### After Selection (e.g., "от 90 мин")
```
Продолжительность                                      ⊗ Сбросить
───────────────────────────────────────

        от 1 ч 30 мин           от 1 ч 30 мин ← Display shows conversion

├──────────────────o────────── ← Slider moved
│ 30мин  1ч  2ч  ...
```

## Format Label Examples

Given `unit: "мин"`:
- 30 → "30 мин"
- 60 → "1 ч"
- 90 → "1 ч 30 мин"
- 120 → "2 ч"

For other units (₽, км, мг), values are shown as-is: `"100 ₽"`, `"5 км"`, etc.

## Advanced: Conditional Visibility

You can make range filters appear/disappear based on other filter selections using `showWhenRules`:

```javascript
const filterConfig = {
  filters: [
    {
      key: "service_type",
      type: "checkbox",
      options: [
        { value: "massage", label: "Массаж" },
        { value: "consultation", label: "Консультация" }
      ]
    },
    {
      key: "duration",
      type: "range",
      label: "Продолжительность",
      rangeMin: 30,
      rangeMax: 480,
      rangeStep: 30,
      rangeUnit: "мин",
      showWhenRules: [
        {
          whenFilterKey: "service_type",
          whenFilterValue: "massage"
        }
      ]
      // Now duration filter only shows when "Массаж" is selected
    }
  ]
}
```

## Troubleshooting

### Range filter not showing
- Check that `type: "range"` is set (not "checkbox" or "radio")
- Verify that `showWhenRules` are satisfied (if set)
- Ensure products have matching `filterValue` entries

### Values not filtering correctly
- Confirm product `filterValues` have matching `key`
- Check that `value` is numeric or can be parsed as number
- Range filter stores values as `"min:VALUE"` format internally

### Display formatting issues
- For time values in minutes with `unit: "мин"`, values >= 60 are auto-converted to hours
- For other units, values display as `"VALUE UNIT"` without conversion
- Customize `formatLabel()` in `ProductFilters.tsx` if needed

## Files Modified

- `src/collections/FilterConfigs.ts` — Added range field configuration
- `src/payload-types.ts` — Added `rangeMin`, `rangeMax`, `rangeStep`, `rangeUnit` types
- `src/components/product-filters/ProductFilters.tsx` — Added range filter UI with slider
- `src/app/.../[subcategorySlug]/client-page.tsx` — Updated `applyFilters()` for range logic
- `src/migrations/20250401_add_range_filter_fields.ts` — Database migration
