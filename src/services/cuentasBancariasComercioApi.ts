import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";

import type {
  CuentaBancariaComercioCreateDto,
  CuentaBancariaComercioDto,
  CuentaBancariaComercioUpdateDto,
} from "../types/User/pagosComercio";

const comercioParams = (comercioId?: number) =>
  comercioId && comercioId > 0 ? { params: { comercioId } } : undefined;

export const cuentasBancariasComercioApi = {
  obtenerTodas: (comercioId?: number) =>
    httpUsuario.get<ApiResponse<CuentaBancariaComercioDto[]>>(
      "/CuentasBancariasComercio",
      comercioParams(comercioId),
    ),

  crear: (data: CuentaBancariaComercioCreateDto, comercioId?: number) =>
    httpUsuario.post<ApiResponse<CuentaBancariaComercioDto>>(
      "/CuentasBancariasComercio",
      data,
      comercioParams(comercioId),
    ),

  actualizar: (
    uuid: string,
    data: CuentaBancariaComercioUpdateDto,
    comercioId?: number,
  ) =>
    httpUsuario.put<ApiResponse<boolean>>(
      `/CuentasBancariasComercio/${uuid}`,
      data,
      comercioParams(comercioId),
    ),

  eliminar: (uuid: string, comercioId?: number) =>
    httpUsuario.delete<ApiResponse<boolean>>(
      `/CuentasBancariasComercio/${uuid}`,
      comercioParams(comercioId),
    ),

  establecerPrincipal: (uuid: string, comercioId?: number) =>
    httpUsuario.put<ApiResponse<boolean>>(
      `/CuentasBancariasComercio/${uuid}/principal`,
      undefined,
      comercioParams(comercioId),
    ),
};
