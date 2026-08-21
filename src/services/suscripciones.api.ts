import type { ApiResponse, PaginatedResponse } from "../api/apiResponse";
import { httpAdmin } from "../api/httpAdmin";
import type { SuscripcionListadoDto } from "../types/Admin/suscripciones";

export const suscripcionesService = {
  getAll(params?: { page?: number; pageSize?: number }) {
    return httpAdmin.get<ApiResponse<PaginatedResponse<SuscripcionListadoDto>>>(
      "/suscripciones",
      {
        params,
      },
    );
  },
};
