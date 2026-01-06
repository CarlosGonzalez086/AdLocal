import { z } from "zod";

export const tarjetaSchema = z.object({
  paymentMethodId: z.string().min(1, "PaymentMethodId requerido"),
  isDefault: z.boolean().optional(),
});

export type CrearTarjetaDto = z.infer<typeof tarjetaSchema>;

