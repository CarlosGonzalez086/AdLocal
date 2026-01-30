import axios from "axios";

const apiPublic = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/planes`,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  getAllPlanesUser: () => apiPublic.get("/AllPlanesUser"),
};
