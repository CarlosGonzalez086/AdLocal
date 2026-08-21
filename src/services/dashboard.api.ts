import type { ApiResponse } from "../api/apiResponse";
import { httpAdmin } from "../api/httpAdmin";

export interface SuscripcionPorPlanDto {
  plan: string;
  tipo: "FREE" | "BASIC" | "PRO" | "BUSINESS";
  total: number;
}

export interface SuscripcionDashboardDto {
  porPlan: SuscripcionPorPlanDto[];
  ultimaSemana: number;
  ultimosTresMeses: number;
}

export const dashboardService = {
  getSuscripcionesStats() {
    return httpAdmin.get<ApiResponse<SuscripcionDashboardDto>>(
      "suscripciones/suscripciones-stats",
    );
  },
};
