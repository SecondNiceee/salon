"use client"

import { Search, X } from "lucide-react"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import type { Product } from "@/payload-types"
import { searchProducts } from "@/actions/server/products/getPruductsByQuery"
import { ProductCard } from "../product-card/ProductCard"

interface ProductSearchProps {
  onProductSelect?: (product: Product) => void
}

const ProductSearch = ({ onProductSelect }: ProductSearchProps) => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true)
        try {
          const searchResults = await searchProducts(query.trim())
          setResults(searchResults)
          setIsOpen(true)
        } catch (error) {
          console.error("Search error:", error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query, searchProducts])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleProductClick = (product: Product) => {
    setIsOpen(false)
    setQuery("")
    onProductSelect?.(product)
  }

  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="relative z-[100]" ref={searchRef}>
      <div className="relative z-[100]">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 lg:w-5 lg:h-5" />
        <Input
          type="text"
          placeholder="Поиск по сайту"
          className="pl-10 pr-10 h-10 lg:h-11 w-full"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (results.length > 0) {
              setIsOpen(true)
            }
          }}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {isOpen && (
        <Card className="absolute py-2 px-2 w-[calc(100vw-40px)] md:min-w-[350px] md:w-[100%] lg:w-[170%] top-full left-0 lg:left-[-40%] mt-1 bg-white border border-gray-200 shadow-lg z-[200] max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Поиск...</div>
          ) : results.length > 0 ? (
            <div className="p-2 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {results.map((product) => (
                <ProductCard
                  clickHandler={() => {
                    setIsOpen(false)
                  }}
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : query.trim().length > 0 ? (
            <div className="p-4 text-center text-gray-500">Услуги не найдены</div>
          ) : null}
        </Card>
      )}
    </div>
  )
}

export default ProductSearch
