import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";

import type {
  CuentaBancariaComercioCreateDto,
  CuentaBancariaComercioDto,
  CuentaBancariaComercioUpdateDto,
} from "../types/User/pagosComercio";

export const cuentasBancariasComercioApi = {
  obtenerTodas: () =>
    httpUsuario.get<ApiResponse<CuentaBancariaComercioDto[]>>(
      "/CuentasBancariasComercio",
    ),

  crear: (data: CuentaBancariaComercioCreateDto) =>
    httpUsuario.post<ApiResponse<CuentaBancariaComercioDto>>(
      "/CuentasBancariasComercio",
      data,
    ),

  actualizar: (uuid: string, data: CuentaBancariaComercioUpdateDto) =>
    httpUsuario.put<ApiResponse<boolean>>(
      `/CuentasBancariasComercio/${uuid}`,
      data,
    ),

  eliminar: (uuid: string) =>
    httpUsuario.delete<ApiResponse<boolean>>(
      `/CuentasBancariasComercio/${uuid}`,
    ),

  establecerPrincipal: (uuid: string) =>
    httpUsuario.put<ApiResponse<boolean>>(
      `/CuentasBancariasComercio/${uuid}/principal`,
    ),
};
