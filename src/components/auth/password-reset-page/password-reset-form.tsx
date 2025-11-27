"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { request, type RequestError } from "@/utils/request"
import Link from "next/link"
import { useRouter } from "next/navigation"
import cl from "../auth.module.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { resetPasswordSchema } from "../validation/schemas"
import { routerConfig } from "@/config/router.config"
import { useCity } from "@/lib/use-city"

type ResetPasswordInputs = {
  password: string
  confirmPassword: string
}

interface PasswordResetFormProps {
  token: string
}

export default function PasswordResetForm({ token }: PasswordResetFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<RequestError | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const city = useCity();

  const form = useForm<ResetPasswordInputs>({
    mode: "onBlur",
    defaultValues: { password: "", confirmPassword: "" },
    resolver: zodResolver(resetPasswordSchema),
  })

  const onSubmit: SubmitHandler<ResetPasswordInputs> = async (values) => {
    if (values.password !== values.confirmPassword) {
      form.setError("confirmPassword", { message: "Пароли не совпадают" })
      return
    }

    setLoading(true)
    setError(null)

    try {
      await request({
        url: "/api/users/reset-password",
        method: "POST",
        body: { token, password: values.password },
        headers: { "Content-Type": "application/json" },
      })
      setSuccess(true)
      // Перенаправляем на главную через 3 секунды
      setTimeout(() => {
        router.replace(routerConfig.withCity(city, routerConfig.home))
      }, 3000)
    } catch (e) {
      setError(e as RequestError)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-0">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-brand-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Пароль изменен</CardTitle>
          <CardDescription className="text-gray-600">
            Ваш пароль успешно обновлен. Перенаправляем на главную страницу...
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Перейти на главную
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Новый пароль</CardTitle>
        <CardDescription className="text-gray-600">Введите новый пароль для вашего аккаунта</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Новый пароль</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Минимум 8 символов"
                        className={cl.input}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Подтвердите пароль</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Повторите пароль"
                        className={cl.input}
                        {...field}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium"
            >
              {loading ? "Сохраняем..." : "Сохранить пароль"}
            </Button>

            <div className="text-center">
              <Link
                href="/"
                className="gap-2 text-center mx-auto justify-center text-gray-600 flex items-center hover:text-gray-800 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Вернуться на главную
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
