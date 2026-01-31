import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string({
        required_error: "El email es requerido",
    }).email({
        message: "El email no es válido",
    }),
    password: z.string({
        required_error: "La contraseña es requerida",
    }).min(8, {
        message: "La contraseña debe tener al menos 8 caracteres",
    }),
    name: z.string({
        required_error: "El nombre es requerido",
    }).min(1, {
        message: "El nombre es requerido",
    }),
    surnames: z.string({
        required_error: "Los apellidos son requeridos",
    }).min(1, {
        message: "Los apellidos son requeridos",
    }),
    birthdate: z.string({
        required_error: "La fecha de nacimiento es requerida",
    }),
    gender: z.enum(["male", "female", "other"], {
        required_error: "El género es requerido",
    }),
});