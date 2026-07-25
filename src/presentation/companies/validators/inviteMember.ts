import { z } from "zod";

export const InviteMemberSchema = z.object({
  email: z.email({
    message: "El correo electrónico no es válido",
  }),
  role: z.enum(["ADMIN", "DEALER"], {
    message: "El rol debe ser ADMIN o DEALER",
  }),
});