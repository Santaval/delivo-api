import { z } from "zod";

export const CreateCompanySchema = z.object({
  name: z.string({
    message: "El nombre es requerido",
  }).min(1, {
    message: "El nombre no puede estar vacío",
  }).max(255, {
    message: "El nombre no puede exceder 255 caracteres",
  }),
});
