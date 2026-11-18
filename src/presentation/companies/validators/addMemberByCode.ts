import { z } from "zod";

export const AddMemberByCodeSchema = z.object({
  code: z
    .string({ message: "El código es requerido" })
    .transform((s) => s.replace(/\s+/g, ""))
    .pipe(z.string().regex(/^\d{6}$/, "El código debe tener 6 dígitos")),
  role: z.enum(["ADMIN", "DEALER"], {
    message: "El rol debe ser ADMIN o DEALER",
  }),
});
