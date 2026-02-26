"use client"

import React from "react"
import { useRouter } from "next/navigation"

const SERVICE_TYPES = [
  {
    label: "Обучение",
    value: "education",
    description: "Курсы и обучающие программы",
    icon: "🎓",
    color: "#4F46E5",
  },
  {
    label: "Массаж",
    value: "massage",
    description: "Услуги массажа",
    icon: "💆",
    color: "#0891B2",
  },
  {
    label: "Косметология",
    value: "cosmetology",
    description: "Косметологические процедуры",
    icon: "✨",
    color: "#BE185D",
  },
  {
    label: "Спа",
    value: "spa",
    description: "Спа-процедуры и уход",
    icon: "🌿",
    color: "#059669",
  },
  {
    label: "Тату",
    value: "tattoo",
    description: "Тату и перманентный макияж",
    icon: "🎨",
    color: "#D97706",
  },
  {
    label: "Подарочные сертификаты",
    value: "gift-certificates",
    description: "Подарочные сертификаты на услуги",
    icon: "🎁",
    color: "#7C3AED",
  },
]

export const ProductsHub: React.FC = () => {
  const router = useRouter()

  const handleCardClick = (serviceType: string) => {
    router.push(
      `/admin/collections/products?where[serviceType][equals]=${serviceType}`
    )
  }

  const handleAddNew = (serviceType: string) => {
    router.push(
      `/admin/collections/products/create?defaults[serviceType]=${serviceType}`
    )
  }

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "1100px",
        margin: "0 auto",
        fontFamily: "var(--font-body)",
      }}
    >
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            color: "var(--theme-text)",
            margin: 0,
            marginBottom: "8px",
          }}
        >
          Товары и услуги
        </h1>
        <p style={{ color: "var(--theme-text-400)", margin: 0, fontSize: "14px" }}>
          Выберите раздел для просмотра и управления товарами
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "20px",
        }}
      >
        {SERVICE_TYPES.map((type) => (
          <div
            key={type.value}
            style={{
              background: "var(--theme-elevation-50)",
              border: "1px solid var(--theme-elevation-200)",
              borderRadius: "12px",
              padding: "24px",
              cursor: "pointer",
              transition: "all 0.15s ease",
              position: "relative",
              overflow: "hidden",
            }}
            onClick={() => handleCardClick(type.value)}
            onMouseEnter={(e) => {
              const card = e.currentTarget
              card.style.borderColor = type.color
              card.style.boxShadow = `0 4px 20px ${type.color}22`
              card.style.transform = "translateY(-2px)"
            }}
            onMouseLeave={(e) => {
              const card = e.currentTarget
              card.style.borderColor = "var(--theme-elevation-200)"
              card.style.boxShadow = "none"
              card.style.transform = "translateY(0)"
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "10px",
                background: `${type.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                marginBottom: "16px",
              }}
            >
              {type.icon}
            </div>

            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "var(--theme-text)",
                margin: 0,
                marginBottom: "6px",
              }}
            >
              {type.label}
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--theme-text-400)",
                margin: 0,
                marginBottom: "20px",
              }}
            >
              {type.description}
            </p>

            <div
              style={{
                display: "flex",
                gap: "8px",
              }}
            >
              <button
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: `1px solid ${type.color}`,
                  background: "transparent",
                  color: type.color,
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCardClick(type.value)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `${type.color}12`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent"
                }}
              >
                Просмотр
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "none",
                  background: type.color,
                  color: "#fff",
                  fontSize: "13px",
                  fontWeight: 500,
                  cursor: "pointer",
                  opacity: 0.9,
                  transition: "opacity 0.1s",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddNew(type.value)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.9"
                }}
              >
                + Добавить
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "32px", textAlign: "center" }}>
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "1px solid var(--theme-elevation-300)",
            background: "transparent",
            color: "var(--theme-text-400)",
            fontSize: "14px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/admin/collections/products")}
        >
          Показать все товары без фильтра
        </button>
      </div>
    </div>
  )
}

export default ProductsHub
