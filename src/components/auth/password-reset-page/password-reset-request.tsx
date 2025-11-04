"use client"

import { useState } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, ArrowLeft } from "lucide-react"
import { emailRegex } from "@/constants/email-schema"
import { request, type RequestError } from "@/utils/request"
import Link from "next/link"
import cl from "../auth.module.css"

type ResetRequestInputs = {
  email: string
}

export default function PasswordResetRequest() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<RequestError | null>(null)

  const form = useForm<ResetRequestInputs>({
    mode: "onBlur",
    defaultValues: { email: "" },
  })

  const onSubmit: SubmitHandler<ResetRequestInputs> = async (values) => {
    setLoading(true)
    setError(null)

    try {
      await request({
        url: "/api/users/forgot-password",
        method: "POST",
        body: { email: values.email },
        headers: { "Content-Type": "application/json" },
      })
      setSuccess(true)
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
            <Mail className="w-6 h-6 text-brand-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Письмо отправлено</CardTitle>
          <CardDescription className="text-gray-600">
            Проверьте почту и перейдите по ссылке для сброса пароля
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium">
            <ArrowLeft className="w-4 h-4" />
            Вернуться на главную
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-gray-900">Восстановление пароля</CardTitle>
        <CardDescription className="text-gray-600">Введите email для получения ссылки сброса пароля</CardDescription>
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
              name="email"
              rules={{
                required: "Укажите email",
                pattern: { value: emailRegex, message: "Введите корректный email" },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-900">Email</FormLabel>
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
                  <FormMessage className="text-red-500 text-sm" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-base rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-medium"
            >
              {loading ? "Отправляем..." : "Отправить ссылку"}
            </Button>

            <div className="text-center">
              <Link href="/" className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 text-sm">
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
