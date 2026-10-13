export const EstadoPedido = {
  PendienteAprobacion: 1,
  Aprobado: 2,
  Rechazado: 3,
  Preparando: 4,
  ListoParaRecoger: 5,
  ListoParaEnviar: 6,
  Enviado: 7,
  Entregado: 8,
  Completado: 9,
  Cancelado: 10,
} as const;
export type EstadoPedido = (typeof EstadoPedido)[keyof typeof EstadoPedido];

export const EstadoPagoPedido = {
  Pendiente: 1,
  PendienteVerificacion: 2,
  Pagado: 3,
  Rechazado: 4,
  Reembolsado: 5,
} as const;
export type EstadoPagoPedido =
  (typeof EstadoPagoPedido)[keyof typeof EstadoPagoPedido];

export const MetodoPagoPedido = { Efectivo: 1, Transferencia: 2 } as const;
export type MetodoPagoPedido =
  (typeof MetodoPagoPedido)[keyof typeof MetodoPagoPedido];
export const TipoEntregaPedido = { Recoger: 1, Domicilio: 2 } as const;
export type TipoEntregaPedido =
  (typeof TipoEntregaPedido)[keyof typeof TipoEntregaPedido];

export interface ComercioPedidoSelectorDto {
  zonaHoraria?: string;
  id: number;
  uuid: string;
  nombre: string;
}
export interface PedidosComercioDashboardDto {
  ventasHoy: number;
  ventasSemana: number;
  pedidosHoy: number;
  pendientesAprobacion: number;
  comprobantesPendientes: number;
  ventasPorDia: VentaDiaComercioDto[];
}
export interface VentaDiaComercioDto {
  fecha: string;
  dia: string;
  total: number;
  pedidos: number;
}
export interface PedidoComercioListadoDto {
  uuid: string;
  numeroPedido: string;
  clienteNombre: string;
  total: number;
  estado: EstadoPedido;
  estadoPago: EstadoPagoPedido;
  metodoPago: MetodoPagoPedido;
  tipoEntrega: TipoEntregaPedido;
  totalProductos: number;
  fechaCreacion: string;
  tieneComprobante: boolean;
  accionesDisponibles: EstadoPedido[];
}
export interface PedidoComercioProductoDto {
  stockDescontado: number | null;
  stockPorRestituir: number;
  stockRestituido: number;
  uuid: string;
  nombre: string;
  logoUrl?: string | null;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  observaciones?: string | null;
}
export interface PedidoComercioHistorialDto {
  evento: string;
  estadoPago?: EstadoPagoPedido | null;
  idUsuarioCambio?: number | null;
  estado: EstadoPedido;
  comentario?: string | null;
  fecha: string;
}
export interface PedidoComercioDetalleDto extends PedidoComercioListadoDto {
  version: number;
  inventarioPendiente: boolean;
  restituirReserva: boolean | null;
  puedeRegistrarPago: boolean;
  puedeReembolsar: boolean;
  reembolso?: PedidoReembolsoDto | null;
  clienteEmail?: string | null;
  telefonoEntrega?: string | null;
  direccion?: string | null;
  observacionesCliente?: string | null;
  fechaComprobantePago?: string | null;
  productos: PedidoComercioProductoDto[];
  historial: PedidoComercioHistorialDto[];
}
export interface PagedResponse<T> {
  page: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
  items: T[];
}

export interface PedidoReembolsoDto {
  uuid: string;
  monto: number;
  metodo: MetodoPagoPedido;
  referencia: string;
  motivo: string;
  fechaCreacion: string;
}
export interface RegistrarReembolsoPedidoDto {
  versionPedido: number;
  idempotencyKey: string;
  monto: number;
  metodo: MetodoPagoPedido;
  referencia: string;
  motivo: string;
  productosDevueltos: { detalleUuid: string; cantidad: number }[];
}
