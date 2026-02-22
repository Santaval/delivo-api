import z from "zod";

const createPaymentMethodSchema = z.object({
  name: z.string().min(2).max(100),
});

export default createPaymentMethodSchema;