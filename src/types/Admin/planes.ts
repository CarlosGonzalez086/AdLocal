export interface PlanCreateDto {
  id?: number;
  nombre: string;
  precio: number;
  duracionDias: number;
  tipo: "FREE" | "BASIC" | "PRO" | "BUSINESS";
  maxNegocios: number;
  maxProductos: number;
  maxFotos: number;
  stripePriceId: string;
  nivelVisibilidad: number;
  permiteCatalogo: boolean;
  coloresPersonalizados: boolean;
  tieneBadge: boolean;
  badgeTexto?: string | null;
  tieneAnalytics: boolean;
  isMultiUsuario: boolean;
}

export type PlanFormErrors = Partial<Record<keyof PlanCreateDto, string>>;
