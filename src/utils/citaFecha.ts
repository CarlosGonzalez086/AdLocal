export function diaAgenda(
  ahora = new Date(),
  zonaHoraria = "America/Mexico_City",
): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: zonaHoraria,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(ahora);
  const parte = (tipo: string) => partes.find((p) => p.type === tipo)?.value;
  return `${parte("year")}-${parte("month")}-${parte("day")}`;
}
export function horaCita(fecha: string): string {
  return fecha.slice(11, 16);
}
