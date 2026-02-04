export const DIAS_SEMANA = [
  { dia: 1, label: "Lunes" },
  { dia: 2, label: "Martes" },
  { dia: 3, label: "Miércoles" },
  { dia: 4, label: "Jueves" },
  { dia: 5, label: "Viernes" },
  { dia: 6, label: "Sábado" },
  { dia: 0, label: "Domingo" },
];

export const DIAS_SEMANA_MAP: Record<number, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};

export const diasSemana = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

export const METODOS_PAGO = [
  {
    id: "spei_bbva",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "BBVA",
    label: "BBVA (Transferencia SPEI)",
    value: "bbva",
  },
  {
    id: "spei_banamex",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "Citibanamex",
    label: "Citibanamex (Transferencia SPEI)",
    value: "banamex",
  },
  {
    id: "spei_santander",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "Santander",
    label: "Santander (Transferencia SPEI)",
    value: "santander",
  },
  {
    id: "spei_banorte",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "Banorte",
    label: "Banorte (Transferencia SPEI)",
    value: "banorte",
  },
  {
    id: "spei_hsbc",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "HSBC",
    label: "HSBC (Transferencia SPEI)",
    value: "hsbc",
  },
  {
    id: "spei_scotiabank",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "Scotiabank",
    label: "Scotiabank (Transferencia SPEI)",
    value: "scotiabank",
  },
  {
    id: "spei_azteca",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "Banco Azteca",
    label: "Banco Azteca (Transferencia SPEI)",
    value: "azteca",
  },
  {
    id: "spei_inbursa",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "Inbursa",
    label: "Inbursa (Transferencia SPEI)",
    value: "inbursa",
  },
  {
    id: "spei_otro",
    tipo: "SPEI",
    proveedor: "stripe",
    banco: "Otro banco",
    label: "Otro banco (SPEI)",
    value: "otro",
  },
  {
    id: "oxxo_cash",
    tipo: "EFECTIVO",
    proveedor: "stripe",
    banco: "OXXO",
    label: "Pago en efectivo (OXXO)",
    value: "oxxo",
  },
];


export const iosColors = {
  primary: "#007AFF",
  success: "#34C759",
  warning: "#FF9F0A",
  danger: "#FF3B30",
  purple: "#AF52DE",
  gray: "#8E8E93",
  background: "#F9FAFB",
};
