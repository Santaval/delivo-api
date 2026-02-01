import { z } from "zod";

export const CreateClientSchema = z.object({
  name: z.string({
    message: "El nombre es requerido",
  }).min(1, {
    message: "El nombre no puede estar vacío",
  }).max(255, {
    message: "El nombre no puede exceder 255 caracteres",
  }),
  phoneNumber: z.string().min(8, {
    message: "El teléfono debe tener al menos 8 dígitos",
  }).max(15, {
    message: "El teléfono no puede exceder 15 dígitos",
  }).optional(),
  email: z.string().email({
    message: "El email no es válido",
  }).optional(),
  companyId: z.string({
    message: "El ID de la empresa es requerido",
  }).min(1, {
    message: "El ID de la empresa no puede estar vacío",
  }),
});
