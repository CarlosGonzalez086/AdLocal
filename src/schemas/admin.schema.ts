import { z } from "zod";

export const adminRegisterSchema = z.object({
  nombre: z.string().min(3, "Nombre muy corto"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
