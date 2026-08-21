import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";

import type { ConfiguracionPagoComercioDto } from "../types/User/pagosComercio";

export const configuracionPagoComercioApi = {
  obtener: () =>
    httpUsuario.get<ApiResponse<ConfiguracionPagoComercioDto | null>>(
      "/ConfiguracionPagoComercio",
    ),

  guardar: (data: ConfiguracionPagoComercioDto) =>
    httpUsuario.post<ApiResponse<ConfiguracionPagoComercioDto>>(
      "/ConfiguracionPagoComercio",
      data,
    ),
};
