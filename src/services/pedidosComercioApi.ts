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
  RegistrarReembolsoPedidoDto,
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
    versionPedido: number,
    comentario?: string,
    productosRestituibles?: { detalleUuid: string; cantidad: number }[],
  ) =>
    httpUsuario.put<ApiResponse<PedidoComercioDetalleDto>>(
      `/PedidosComercio/${pedidoUuid}/estado`,
      { estado, comentario, versionPedido, productosRestituibles },
      { params: { comercioId } },
    ),
  revisarPago: (
    comercioId: number,
    pedidoUuid: string,
    estadoPago: EstadoPagoPedido,
    versionPedido: number,
    comentario?: string,
  ) =>
    httpUsuario.put<ApiResponse<PedidoComercioDetalleDto>>(
      `/PedidosComercio/${pedidoUuid}/pago`,
      { estadoPago, comentario, versionPedido },
      { params: { comercioId } },
    ),
  comprobante: (comercioId: number, pedidoUuid: string) =>
    httpUsuario.get<Blob>(`/PedidosComercio/${pedidoUuid}/comprobante`, {
      params: { comercioId },
      responseType: "blob",
    }),
  reembolsar: (comercioId: number, pedidoUuid: string, dto: RegistrarReembolsoPedidoDto) =>
    httpUsuario.post<ApiResponse<PedidoComercioDetalleDto>>(`/PedidosComercio/${pedidoUuid}/reembolso`, dto, { params: { comercioId } }),
  conciliar: (comercioId: number, pedidoUuid: string, versionPedido: number, referencia: string,
    stockDescontado: { detalleUuid: string; cantidad: number }[], restituirReserva?: boolean) =>
    httpUsuario.put<ApiResponse<PedidoComercioDetalleDto>>(`/PedidosComercio/${pedidoUuid}/inventario/conciliacion`,
      { versionPedido, referencia, stockDescontado, restituirReserva }, { params: { comercioId } }),
};
