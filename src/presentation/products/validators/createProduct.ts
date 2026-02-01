import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string({
    message: "El nombre es requerido",
  }).min(1, {
    message: "El nombre no puede estar vacío",
  }).max(255, {
    message: "El nombre no puede exceder 255 caracteres",
  }),
  netPrice: z.number({
    message: "El precio neto es requerido",
  }).min(0, {
    message: "El precio neto debe ser mayor o igual a 0",
  }),
  ivaRate: z.number().min(0, {
    message: "La tarifa IVA debe ser mayor o igual a 0",
  }).max(100, {
    message: "La tarifa IVA no puede exceder 100%",
  }).default(13),
  companyId: z.string({
    message: "El ID de la empresa es requerido",
  }).min(1, {
    message: "El ID de la empresa no puede estar vacío",
  }),
});
