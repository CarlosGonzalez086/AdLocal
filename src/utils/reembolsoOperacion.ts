import type { RegistrarReembolsoPedidoDto } from "../types/User/pedidosComercio";

type StorageReembolso = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export const claveReembolso = (
  cuenta: string,
  comercio: number,
  pedido: string,
) => `adlocal.reembolso.pendiente.v1.${cuenta}.${comercio}.${pedido}`;

export function leerReembolsoPendiente(
  storage: StorageReembolso,
  clave: string,
): RegistrarReembolsoPedidoDto | null {
  const raw = storage.getItem(clave);
  if (!raw) return null;
  const dto = JSON.parse(raw) as RegistrarReembolsoPedidoDto;
  if (
    !dto.idempotencyKey ||
    !Number.isFinite(dto.versionPedido) ||
    !Number.isFinite(dto.monto) ||
    ![1, 2].includes(dto.metodo) ||
    !dto.referencia?.trim() ||
    !dto.motivo?.trim() ||
    !Array.isArray(dto.productosDevueltos)
  )
    throw new Error(
      "La solicitud guardada no es válida. Revisa el pedido antes de registrar otro reembolso.",
    );
  return dto;
}

// Keep the exact request and key after a timeout, HTTP 5xx or a closed tab.
export function prepararReembolso(
  storage: StorageReembolso,
  clave: string,
  dto: RegistrarReembolsoPedidoDto,
) {
  const pendiente = leerReembolsoPendiente(storage, clave);
  if (pendiente) return pendiente;
  storage.setItem(clave, JSON.stringify(dto));
  return dto;
}

export function validarReembolso(
  pedido: {
    total: number;
    estado: number;
    restituirReserva?: boolean | null;
    productos: { uuid: string; stockDescontado: number | null }[];
  },
  dto: RegistrarReembolsoPedidoDto,
): string | null {
  if (
    !dto.referencia.trim() ||
    dto.referencia.length > 150 ||
    !dto.motivo.trim() ||
    dto.motivo.length > 500
  )
    return "Indica una referencia (máximo 150 caracteres) y un motivo (máximo 500).";
  if (dto.monto !== pedido.total || dto.monto <= 0)
    return "El reembolso debe ser por el total exacto.";
  if (
    ![4, 5, 6, 7, 8, 9].includes(pedido.estado) &&
    pedido.restituirReserva !== false &&
    dto.productosDevueltos.length
  )
    return "El inventario reservado se libera automáticamente antes de preparar.";
  if (
    new Set(dto.productosDevueltos.map((x) => x.detalleUuid)).size !==
    dto.productosDevueltos.length
  )
    return "No repitas productos devueltos.";
  for (const d of dto.productosDevueltos) {
    const producto = pedido.productos.find((x) => x.uuid === d.detalleUuid);
    if (
      !producto ||
      producto.stockDescontado == null ||
      !Number.isInteger(d.cantidad) ||
      d.cantidad <= 0 ||
      d.cantidad > producto.stockDescontado
    )
      return "Revisa las unidades devueltas y el stock original.";
  }
  return null;
}
