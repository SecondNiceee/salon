"use client"

import { useAuthStore } from "@/entities/auth/authStore"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Alert, AlertTitle, AlertDescription } from "../../ui/alert"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { useCallback, useEffect, useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import cl from "../auth.module.css"
import { request, type RequestError } from "@/utils/request"
import { useRouter } from "next/navigation"
import { routerConfig } from "@/config/router.config"
import { Mail } from "lucide-react"
import AuthPicker from "../ui/login-or-registrate-picker"
import { zodResolver } from "@hookform/resolvers/zod"
import { registrationSchema } from "../validation/schemas"
import { useCity } from "@/lib/use-city"

type RegisterInputs = {
  email: string
  password: string
}

interface IRegisterSection {
  mode: "register" | "login"
  setMode: (mode: "register" | "login") => void
}

export default function RegisterSection({ mode, setMode }: IRegisterSection) {
  const { register: registerUser, login } = useAuthStore()
  const router = useRouter()
  const city = useCity()

  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<RequestError | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [password, setPassword] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterInputs>({
    mode: "onChange",
    defaultValues: { email: "", password: "" },
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit: SubmitHandler<RegisterInputs> = async (values) => {
    setSuccess(null)
    setError(null)
    setLoading(true)
    try {
      await registerUser(values.email, values.password)
      setSuccess("Регистрация прошла успешно. Проверьте почту и подтвердите аккаунт перед входом.")
      setEmail(values.email)
      setPassword(values.password)
    } catch (e) {
      const err = e as RequestError
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const tryLogin = useCallback(async () => {
    if (password && email) {
      try {
        console.log("[v0] tryLogin: checking isVerified for email:", email)
        await request({
          url: "/api/auth/isVerified",
          method: "POST",
          body: {
            email,
          },
          credentials: true,
        })
        console.log("[v0] tryLogin: isVerified passed, calling login")
        await login(email, password)
        console.log("[v0] tryLogin: login successful, redirecting to profile")
        router.push(routerConfig.withCity(city, routerConfig.profile))
      } catch (e) {
        console.log("[v0] tryLogin error:", e)
        // ingnoring
      }
    }
  }, [email, city, password, login, router])

  useEffect(() => {
    if (!email || !password) return
    const interval = setInterval(async () => {
      tryLogin()
    }, 12_000)
    return () => clearInterval(interval)
  }, [email, tryLogin, password])

  if (email) {
    return (
      <div className="space-y-6 text-center px-8 py-6 md:px-10 md:py-8">
        <div className="flex items-center justify-center w-16 h-16 mx-auto bg-pink-100 rounded-full">
          <Mail className="w-8 h-8 text-pink-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">Подтвердите почту</h3>
          <p className="text-gray-600">
            Вы успешно зарегистрировались! Проверьте почту и перейдите по ссылке для подтверждения аккаунта.
          </p>
          {email && (
            <p className="text-sm text-gray-500">
              Письмо отправлено на: <span className="font-medium">{email}</span>
            </p>
          )}
        </div>

        {error && (
          <Alert variant={error.message.includes("отправлено") ? "default" : "destructive"}>
            <AlertTitle>{error.message.includes("отправлено") ? "Готово" : "Ошибка"}</AlertTitle>
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button
            onClick={() => tryLogin()}
            disabled={loading}
            className="w-full h-12 text-base rounded-xl text-white bg-pink-500 hover:bg-pink-600"
          >
            {"Я подтвердил вход"}
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="relative">
      <AuthPicker setMode={setMode} mode={mode} />
      <div className="px-8 py-6 md:px-10 md:py-8">
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)} noValidate>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error?.message}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert>
                <AlertTitle>Готово</AlertTitle>
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-medium text-gray-900">Почта</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={cl.input}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className={cl.formError} />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              rules={{
                required: "Укажите пароль",
                minLength: { value: 8, message: "Пароль должен быть не менее 8 символов" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-medium text-gray-900">Пароль</FormLabel>
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="Минимум 8 символов"
                      className={cl.input}
                      {...field}
                    />
                  </FormControl>
                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={showPassword}
                      onChange={(e) => setShowPassword(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-pink-500 focus:ring-pink-500"
                    />
                    <span className="text-sm text-gray-600">Показать пароль</span>
                  </label>
                  <FormMessage className={cl.formError} />
                </FormItem>
              )}
            />

            <Button
              className="w-full h-12 text-base rounded-xl text-white bg-pink-500 hover:bg-pink-600"
              type="submit"
              disabled={loading}
            >
              {loading ? "Регистрируем..." : "Зарегистрироваться"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}
