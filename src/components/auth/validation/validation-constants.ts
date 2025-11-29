import {z} from "zod";
export const passwordSchema = z.string().min(9, "Пароль должен быть не менее 9 символов")

export const emailSchema = z.email("Введите правильный email");
  