"use client"

interface IAuthPicker {
  setMode: (prevState: "login" | "register") => void
  mode: "login" | "register"
}
const AuthPicker = ({ setMode, mode }: IAuthPicker) => {
  return (
    <div className="px-8 py-6 md:px-10 md:py-8 border-b bg-gray-50">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Вход в аккаунт</h2>
      <div className="mt-4 inline-flex items-center rounded-full bg-white border p-1">
        <button
          className={`px-5 py-2 rounded-full text-sm md:text-base transition-colors ${mode === "login" ? "bg-pink-500 hover:bg-pink-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setMode("login")}
        >
          Вход
        </button>
        <button
          className={`px-5 py-2 rounded-full text-sm md:text-base transition-colors ${mode === "register" ? "bg-pink-500 hover:bg-pink-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}
          onClick={() => setMode("register")}
        >
          Регистрация
        </button>
      </div>
    </div>
  )
}

export default AuthPicker
