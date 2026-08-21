export interface ComisionDia { fecha: string; dia: string; monto: number; }
export interface ComisionesDashboard { comisionesSemana: number; comisionesMes: number; pendienteCobro: number; cobradoMes: number; semana: ComisionDia[]; }
export interface ComisionComercioResumen { comercioId: number; comercioUuid: string; comercio: string; ventas: number; ventasMonto: number; comisionGenerada: number; pendientePago: number; pendienteEfectivo: number; pendienteTransferencia: number; ultimaVenta?: string | null; }
export interface ComisionMovimiento { uuid: string; comercio: string; pedidoUuid: string; numeroPedido: string; metodoPago: string; montoVenta: number; porcentaje: number; comisionFija: number; montoComision: number; estatus: number; fecha: string; fechaPago?: string | null; }
export interface PagedComisiones { page: number; pageSize: number; totalPages: number; totalItems: number; items: ComisionMovimiento[]; }
