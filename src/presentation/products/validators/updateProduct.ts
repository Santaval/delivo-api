import { z } from "zod";

export const UpdateProductSchema = z.object({
  name: z.string().min(1, {
    message: "El nombre no puede estar vacío",
  }).max(255, {
    message: "El nombre no puede exceder 255 caracteres",
  }).optional(),
  netPrice: z.number().min(0, {
    message: "El precio neto debe ser mayor o igual a 0",
  }).optional(),
  ivaRate: z.number().min(0, {
    message: "La tarifa IVA debe ser mayor o igual a 0",
  }).max(100, {
    message: "La tarifa IVA no puede exceder 100%",
  }).optional(),
});
