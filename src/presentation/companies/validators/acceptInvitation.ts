import { z } from "zod";

export const AcceptInvitationSchema = z.object({
  token: z.string({ message: "El token es requerido" }).min(1, {
    message: "El token no puede estar vacío",
  }),
});