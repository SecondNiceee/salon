import {string, z} from "zod";
import { emailSchema, passwordSchema } from "./validation-constants";
export const registrationSchema = z.object({
    email : emailSchema,
    password : passwordSchema
})

export const loginSchema = z.object({
    email : emailSchema,
    password : z.string().min(1, "Пароль обязателен")
})

export const resetPasswordSchema = z.object({
    password : passwordSchema,
    confirmPassword : z.string()
}).superRefine( ({confirmPassword, password},ctx) => {
    if (confirmPassword !== password){
        ctx.addIssue({
            code : "custom",
            message : "Пароли не совпадают",
            path : ["confirmPassword"]
        })
    }
} )
