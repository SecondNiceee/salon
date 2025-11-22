"use client"
import type { FC } from "react"
import { Button } from "../../../ui/button"
import { User } from "lucide-react"
import { useAuthStore } from "@/entities/auth/authStore"
import { useAuthDialogStore } from "@/entities/auth/authDialogStore"
import { useRouter } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import { useCity } from "@/lib/use-city"

interface IUserLink {
  className?: string
}

const UserLink: FC<IUserLink> = ({ className = "" }) => {
  const { user } = useAuthStore()
  const { openDialog } = useAuthDialogStore()
  const router = useRouter()
  const city = useCity() // Get city from hook

  const clickHandler = () => {
    if (user) {
      router.push(routerConfig.getPath(city, "profile"))
    } else {
      openDialog("login")
    }
  }

  return (
    <Button
      variant="default"
      size="sm"
      onClick={clickHandler}
      className={`flex items-center w-[30px] h-[30px]  sm:h-auto lg:min-w-[160px] md:h-10 lg:h-11 gap-2 px-3 lg:px-4 py-3 bg-pink-400 hover:bg-pink-300 rounded-full sm:rounded-lg transition-colors ${className}`}
    > 
      <User className="sm:h-4 sm:w-4 text-white" />
      <span className="hidden md:inline text-sm font-medium text-white">{user ? "Профиль" : "Войти"}</span>
    </Button>
  )
}

export default UserLink
