import { z } from "zod";

export const comercioCreateSchema = z.object({
  nombre: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  direccion: z
    .string()
    .optional(),

  telefono: z
    .string()
    .min(7, "El teléfono es demasiado corto")
    .max(15, "El teléfono es demasiado largo")
    .optional(),

  lat: z
    .number()
    .min(-90, "Latitud inválida")
    .max(90, "Latitud inválida"),

  lng: z
    .number()
    .min(-180, "Longitud inválida")
    .max(180, "Longitud inválida"),

  logoBase64: z
    .string()
    .startsWith("data:image/", "Formato de imagen inválido")
    .optional(),
}).refine(
  (data) => data.lat !== 0 && data.lng !== 0,
  {
    message: "La ubicación del comercio es obligatoria",
    path: ["lat", "lng"],
  }
);

export type ComercioCreateDto = z.infer<typeof comercioCreateSchema>;
