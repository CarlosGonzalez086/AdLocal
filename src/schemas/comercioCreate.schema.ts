import { z } from "zod";

const base64Image = z
  .string()
  .startsWith("data:image/", "Formato de imagen inválido");

const imageUrl = z.string().url("URL de imagen inválida");

const horarioSchema = z
  .object({
    dia: z.number().min(0).max(6),
    abierto: z.boolean(),
    horaApertura: z.string().optional().nullable(),
    horaCierre: z.string().optional().nullable(),
  })
  .refine((h) => !h.abierto || (h.horaApertura && h.horaCierre), {
    message: "Horario incompleto",
  });

export const comercioCreateSchema = z
  .object({
    nombre: z.string().min(3, "El nombre es obligatorio"),

    direccion: z.string().optional(),

    telefono: z.string().min(7).max(15).optional(),

    email: z.string().email().optional(),

    descripcion: z.string().max(500).optional(),

    logoBase64: base64Image.optional(),

    imagenes: z.array(base64Image).optional(),

    lat: z.number().min(-90).max(90),

    lng: z.number().min(-180).max(180),

    colorPrimario: z
      .string()
      .regex(/^#([0-9A-Fa-f]{6})$/)
      .optional(),

    colorSecundario: z
      .string()
      .regex(/^#([0-9A-Fa-f]{6})$/)
      .optional(),

    activo: z.boolean().optional(),

    horarios: z.array(horarioSchema).optional(),

    estadoId: z.number().int().positive("El estado es obligatorio"),

    municipioId: z.number().int().positive("El municipio es obligatorio"),
  })
  .refine((d) => d.lat !== 0 && d.lng !== 0, {
    message: "La ubicación es obligatoria",
    path: ["lat", "lng"],
  });

export type ComercioCreateDto = z.infer<typeof comercioCreateSchema>;

export const comercioUpdateSchema = z.object({
  nombre: z.string().min(3).nullable().optional(),
  direccion: z.string().nullable().optional(),
  telefono: z.string().min(7).max(15).nullable().optional(),
  email: z.string().email().nullable().optional(),
  descripcion: z.string().max(500).nullable().optional(),
  logoBase64: z.union([base64Image, imageUrl]).nullable().optional(),
  imagenes: z
    .array(z.union([base64Image, imageUrl]))
    .nullable()
    .optional(),
  lat: z.number().min(-90).max(90).nullable().optional(),
  lng: z.number().min(-180).max(180).nullable().optional(),
  colorPrimario: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/)
    .nullable()
    .optional(),
  colorSecundario: z
    .string()
    .regex(/^#([0-9A-Fa-f]{6})$/)
    .nullable()
    .optional(),
  activo: z.boolean().nullable().optional(),
  horarios: z.array(horarioSchema).nullable().optional(),
  estadoId: z.number().int().positive().nullable().optional(),
  municipioId: z.number().int().positive().nullable().optional(),
});

export type ComercioUpdateDto = z.infer<typeof comercioUpdateSchema>;
