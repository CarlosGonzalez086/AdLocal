import type { ComercioDto, HorarioComercioDto } from "../services/comercioApi";

export const utcToLocal = (utcDate: string | Date): string => {
  if (!utcDate) return "";

  const date = typeof utcDate === "string" ? new Date(utcDate) : utcDate;

  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const calcularDiasRestantesDesdeHoy = (
  fechaFin: string,
): number => {
  const hoy = new Date();
  const fin = new Date(fechaFin);

  // Normalizamos horas para evitar errores por timezone
  hoy.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);

  const diferenciaMs = fin.getTime() - hoy.getTime();
  const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  return dias;
};


export const estaAbiertoAhora = (
  horarios: ComercioDto["horarios"] | undefined,
) => {
  if (!horarios) return false;

  const ahora = new Date();
  const diaHoy = ahora.getDay();
  const horaActual = ahora.toTimeString().slice(0, 5); // HH:mm

  const horarioHoy = horarios.find((h) => h.dia === diaHoy);

  if (!horarioHoy || !horarioHoy.abierto) return false;

  return (
    horarioHoy.horaApertura! <= horaActual &&
    horaActual <= horarioHoy.horaCierre!
  );
};

export function removeNulls<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== null),
  ) as Partial<T>;
}

export const normalizeComercioData = (data: any) => ({
  ...data,
  id: data.id ?? 0,
  nombre: data.nombre ?? "",
  direccion: data.direccion ?? "",
  telefono: data.telefono ?? "",
  email: data.email ?? "",
  descripcion: data.descripcion ?? "",

  logoBase64: data.logoBase64?.startsWith("data:image/")
    ? data.logoBase64
    : undefined,

  imagenes: data.imagenes?.filter((img: string) =>
    img.startsWith("data:image/"),
  ),

  horarios: data.horarios?.map((h: HorarioComercioDto) => ({
    dia: h.dia,
    abierto: h.abierto,
    horaApertura: h.abierto ? h.horaApertura : undefined,
    horaCierre: h.abierto ? h.horaCierre : undefined,
  })),

  estadoId: data.estadoId > 0 ? data.estadoId : undefined,
  municipioId: data.municipioId > 0 ? data.municipioId : undefined,
  tipoComercioId: data.tipoComercioId > 0 ? data.tipoComercioId : undefined,
});
