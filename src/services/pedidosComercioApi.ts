import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
import type {
  ComercioPedidoSelectorDto,
  EstadoPagoPedido,
  EstadoPedido,
  PagedResponse,
  PedidoComercioDetalleDto,
  PedidoComercioListadoDto,
  PedidosComercioDashboardDto,
} from "../types/User/pedidosComercio";

export const pedidosComercioApi = {
  comercios: () =>
    httpUsuario.get<ApiResponse<ComercioPedidoSelectorDto[]>>(
      "/PedidosComercio/comercios",
    ),
  dashboard: (comercioId: number) =>
    httpUsuario.get<ApiResponse<PedidosComercioDashboardDto>>(
      "/PedidosComercio/dashboard",
      { params: { comercioId } },
    ),
  listar: (
    comercioId: number,
    page = 1,
    pageSize = 10,
    estado?: EstadoPedido | null,
  ) =>
    httpUsuario.get<ApiResponse<PagedResponse<PedidoComercioListadoDto>>>(
      "/PedidosComercio",
      {
        params: { comercioId, page, pageSize, ...(estado ? { estado } : {}) },
      },
    ),
  detalle: (comercioId: number, pedidoUuid: string) =>
    httpUsuario.get<ApiResponse<PedidoComercioDetalleDto>>(
      `/PedidosComercio/${pedidoUuid}`,
      {
        params: { comercioId },
      },
    ),
  cambiarEstado: (
    comercioId: number,
    pedidoUuid: string,
    estado: EstadoPedido,
    comentario?: string,
  ) =>
    httpUsuario.put<ApiResponse<PedidoComercioDetalleDto>>(
      `/PedidosComercio/${pedidoUuid}/estado`,
      { estado, comentario },
      { params: { comercioId } },
    ),
  revisarPago: (
    comercioId: number,
    pedidoUuid: string,
    estadoPago: EstadoPagoPedido,
    comentario?: string,
  ) =>
    httpUsuario.put<ApiResponse<PedidoComercioDetalleDto>>(
      `/PedidosComercio/${pedidoUuid}/pago`,
      { estadoPago, comentario },
      { params: { comercioId } },
    ),
  comprobante: (comercioId: number, pedidoUuid: string) =>
    httpUsuario.get<Blob>(`/PedidosComercio/${pedidoUuid}/comprobante`, {
      params: { comercioId },
      responseType: "blob",
    }),
};
