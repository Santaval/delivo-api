import z from "zod";

const addPaymentSchema = z.object({
  amount: z.number().min(0),
  methodId: z.string().min(1).max(555),
});

export default addPaymentSchema;