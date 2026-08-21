import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";

export const beneficiosApi = {
  reclamarBeneficio: () =>
    httpUsuario.post<ApiResponse<object>>("/Beneficios", null),
};
