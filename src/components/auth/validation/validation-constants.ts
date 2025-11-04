import {z} from "zod";
export const passwordSchema = z.string().min(9, "Пароль должен быть не менее 9 символов").regex(/[a-z]/, 'Пароль должен содержать хотя бы одну строчную букву')
  .regex(/[A-Z]/, 'Пароль должен содержать хотя бы одну заглавную букву')
  .regex(/[0-9]/, 'Пароль должен содержать хотя бы одну цифру')

export const emailSchema = z.email("Введите правильный email");
