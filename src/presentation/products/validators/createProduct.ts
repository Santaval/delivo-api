import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string({
    message: "El nombre es requerido",
  }).min(1, {
    message: "El nombre no puede estar vacío",
  }).max(255, {
    message: "El nombre no puede exceder 255 caracteres",
  }),
  ivaRate: z.number().min(0, {
    message: "La tarifa IVA debe ser mayor o igual a 0",
  }).max(100, {
    message: "La tarifa IVA no puede exceder 100%",
  }).default(13),
  grossPrice: z.number({
    message: "El precio bruto es requerido",
  }).min(0, {
    message: "El precio bruto debe ser mayor o igual a 0",
  }),
});
