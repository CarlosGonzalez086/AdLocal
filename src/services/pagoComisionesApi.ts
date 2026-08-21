import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
import type { ComercioPedidoSelectorDto } from "../types/User/pedidosComercio";
import type { CuentaAdLocal, EstadoComisionesComercio, PagoComision } from "../types/User/pagoComisiones";

export const pagoComisionesApi = {
  comercios: () => httpUsuario.get<ApiResponse<ComercioPedidoSelectorDto[]>>("/PedidosComercio/comercios"),
  cuenta: () => httpUsuario.get<ApiResponse<CuentaAdLocal>>("/CuentasBancariasAdLocal/principal"),
  estado: (comercioId: number) => httpUsuario.get<ApiResponse<EstadoComisionesComercio>>(`/PagosComisiones/comercio/${comercioId}`),
  pagar: (data: { comercioId: number; cuentaBancariaUuid: string; periodo: string; metodoPago: string; comprobanteBase64: string }) => httpUsuario.post<ApiResponse<PagoComision>>("/PagosComisiones", data),
};
