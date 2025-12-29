"use client"

import { useEffect, useState } from "react"

/**
 * Hook to check if the component has been hydrated on the client.
 * Prevents hydration mismatch errors when using persisted stores.
 */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}
