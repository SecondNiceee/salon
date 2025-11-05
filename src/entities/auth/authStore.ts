"use client"
import { create } from "zustand"
import { request, type RequestError } from "@/utils/request"
import type { User } from "@/payload-types"
export type TUserResponse = { user: User | null }
type AuthState = {
  user: User | null
  loading: boolean
  error: RequestError | null
  fetchMe: () => Promise<TUserResponse>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: { phone?: string; name?: string }) => Promise<void>
}
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  error: null,
  fetchMe: async () => {
    set({ loading: true, error: null })
    try {
      const me = await request<TUserResponse>({
        method: "GET",
        url: "/api/users/me",
        credentials: true,
        query: {
          "select[phone]": "true",
          "select[email]": "true",
          "select[name]": "true",
        },
      })
      set({ user: me.user, loading: false })
      return me
    } catch (e) {
      // Не нужно этого делать, потому что мы используем это для проверки зарегестрирован ли пользователь
      // поэтому просто выкидываем ошибку на клиент, тем самым редирекнув там на другую страничку
      // А если и интернета нет, то мы получим так и так это уведомление
      const error = e as RequestError
      console.log(e)
      set({ error, loading: false, user: null })
      throw e
    }
  },

  login: async (email, password) => {
    try {
      const rezult = await request<{ user: User }>({
        url: "/api/users/login",
        method: "POST",
        credentials: true,
        headers: { "Content-Type": "application/json" },
        body: { email, password },
      })
      set({ user: rezult.user })
    } catch (err: any) {
      console.log(err, JSON.stringify(err))
      const requestError: RequestError = { message: "Не удалось зайти", status: 404 }
      throw requestError
    }
  },

  register: async (email, password) => {
    try {
      await request<User>({
        url: "/api/auth/register",
        method: "POST",
        body: { email, password },
        credentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
    } catch (err: any) {
      console.log(err, JSON.stringify(err))
      throw err
    }
  },

  logout: async () => {
    try {
      set({ user: null })
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      })
    } catch (e) {
      console.log(e)
      throw e
    }
  },

  updateProfile: async (data) => {
    const { user } = get()
    if (!user) throw new Error("User not authenticated")

    try {
      const updatedUser = await request<{ doc: User }>({
        method: "PATCH",
        url: `/api/users/${user.id}`,
        credentials: true,
        headers: { "Content-Type": "application/json" },
        body: data,
      })
      set({ user: { ...user, ...updatedUser.doc } })
    } catch (e) {
      const error = e as RequestError
      set({ error })
      throw error
    }
  },
}))
