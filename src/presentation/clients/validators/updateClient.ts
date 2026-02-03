import { z } from "zod";

export const UpdateClientSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre no puede estar vacío",
  }).max(255, {
    message: "El nombre no puede exceder 255 caracteres",
  }).optional(),
  phoneNumber: z.string().min(8, {
    message: "El teléfono debe tener al menos 8 dígitos",
  }).max(15, {
    message: "El teléfono no puede exceder 15 dígitos",
  }).optional(),
  email: z.string().email({
    message: "El email no es válido",
  }).optional(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
});
