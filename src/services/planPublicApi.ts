import { httpUsuarioPublico } from "../api/httpUsuarioPublico";

export interface PlanCreateDto {
  id?: number;

  nombre: string;
  precio: number;
  duracionDias: number;
  tipo: "FREE" | "BASIC" | "PRO" | "BUSINESS";

  maxNegocios: number;
  maxProductos: number;
  maxFotos: number;

  nivelVisibilidad: number;
  permiteCatalogo: boolean;
  coloresPersonalizados: boolean;
  tieneBadge: boolean;
  badgeTexto?: string | null;
  tieneAnalytics: boolean;
  isMultiUsuario: boolean;
}

export const planPublicApi = {
  getAllPlanesUser: () => httpUsuarioPublico.get("/planes/AllPlanesUser"),
};
