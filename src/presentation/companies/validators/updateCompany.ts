import { z } from "zod";

export const UpdateCompanySchema = z.object({
  name: z.string().min(1, {
    message: "El nombre no puede estar vacío",
  }).max(255, {
    message: "El nombre no puede exceder 255 caracteres",
  }).optional(),
});
