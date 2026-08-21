import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";

export interface VisitasPorDiaDto {
  dia: string;
  total: number;
}

export interface VisitasPorMesDto {
  mes: string;
  total: number;
}

export interface ComercioVisitasStatsDto {
  ultimaSemana: VisitasPorDiaDto[];
  ultimosTresMeses: VisitasPorMesDto[];
}

export const comercioVisitasApi = {
  getStats: (comercioId: number) =>
    httpUsuario.get<ApiResponse<ComercioVisitasStatsDto>>(
      `/ComercioVisitas/${comercioId}/stats`,
    ),
};
