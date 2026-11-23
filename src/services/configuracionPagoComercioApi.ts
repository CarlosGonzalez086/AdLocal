import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";

import type { ConfiguracionPagoComercioDto } from "../types/User/pagosComercio";

export const configuracionPagoComercioApi = {
  obtener: (comercioId?: number) =>
    httpUsuario.get<ApiResponse<ConfiguracionPagoComercioDto | null>>(
      "/ConfiguracionPagoComercio",
      comercioId && comercioId > 0 ? { params: { comercioId } } : undefined,
    ),

  guardar: (data: ConfiguracionPagoComercioDto, comercioId?: number) =>
    httpUsuario.post<ApiResponse<ConfiguracionPagoComercioDto>>(
      "/ConfiguracionPagoComercio",
      data,
      comercioId && comercioId > 0 ? { params: { comercioId } } : undefined,
    ),
};
