export const utcToLocal = (utcDate: string | Date): string => {
  if (!utcDate) return "";

  const date =
    typeof utcDate === "string"
      ? new Date(utcDate)
      : utcDate;

  if (isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

export const calcularDiasEntreFechas = (
  fechaInicio: string,
  fechaFin: string
): number => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  const diferenciaMs = fin.getTime() - inicio.getTime();
  const dias = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  return dias;
};
