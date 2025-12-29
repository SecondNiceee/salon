"use client"

import { routerConfig } from "@/config/router.config"
import {  useAuthStore } from "@/entities/auth/authStore"
import { useOrdersStore } from "@/entities/orders/ordersStore"
import { useCity } from "@/lib/use-city"
import { useRouter } from "next/navigation"
import { useState } from "react"

const useAuth = () => {
  const router = useRouter()
  const { user, loading, logout: authLogout } = useAuthStore()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const city = useCity();
  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await authLogout()
      useOrdersStore.getState().clearOrders()
      router.push(routerConfig.withCity(city, routerConfig.home))
    } catch (error) {
      console.error("Ошибка при выходе:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // useEffect(() => {
  //   if (user === null) {
  //     fetchMe().then((user: TUserResponse) => {
  //       if (!user.user) {
  //         router.replace(`${city}/${routerConfig.home}`)
  //       }
  //     })
  //   }
  // }, [user, fetchMe, openDialog, router])

  return { user, loading, logout, isLoggingOut }
}

export default useAuth
