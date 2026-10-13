import { beforeEach, describe, expect, it, vi } from "vitest";
import { pedidosComercioApi } from "../services/pedidosComercioApi";

const http = vi.hoisted(() => ({ get: vi.fn(), put: vi.fn(), post: vi.fn() }));
vi.mock("../api/httpUsuario", () => ({ httpUsuario: http }));
beforeEach(() => vi.clearAllMocks());

describe("Contrato del cliente real de pedidos del comercio", () => {
  it("envía la versión y las unidades recuperadas al cancelar", () => {
    pedidosComercioApi.cambiarEstado(2, "pedido", 10, 8, "Cancelación", [{ detalleUuid: "detalle", cantidad: 1 }]);
    expect(http.put).toHaveBeenCalledWith("/PedidosComercio/pedido/estado",
      { estado: 10, comentario: "Cancelación", versionPedido: 8, productosRestituibles: [{ detalleUuid: "detalle", cantidad: 1 }] }, { params: { comercioId: 2 } });
  });
  it("vincula la revisión del pago a la versión vista por el operador", () => {
    pedidosComercioApi.revisarPago(2, "pedido", 3, 12);
    expect(http.put).toHaveBeenCalledWith("/PedidosComercio/pedido/pago", { estadoPago: 3, comentario: undefined, versionPedido: 12 }, { params: { comercioId: 2 } });
  });
  it("envía el reembolso por el cliente autenticado con la clave original", () => {
    const dto = { versionPedido: 12, idempotencyKey: "clave", monto: 90, metodo: 2 as const, referencia: "recibo", motivo: "Cancelación", productosDevueltos: [] };
    pedidosComercioApi.reembolsar(2, "pedido", dto);
    expect(http.post).toHaveBeenCalledWith("/PedidosComercio/pedido/reembolso", dto, { params: { comercioId: 2 } });
  });
  it("envía evidencia y decisión explícita para conciliación antigua", () => {
    pedidosComercioApi.conciliar(2, "pedido", 12, "Conteo", [{ detalleUuid: "detalle", cantidad: 2 }], false);
    expect(http.put).toHaveBeenCalledWith("/PedidosComercio/pedido/inventario/conciliacion",
      { versionPedido: 12, referencia: "Conteo", stockDescontado: [{ detalleUuid: "detalle", cantidad: 2 }], restituirReserva: false }, { params: { comercioId: 2 } });
  });
  it("conserva comercio, paginación y filtro del listado", () => {
    pedidosComercioApi.listar(2, 3, 10, 10);
    expect(http.get).toHaveBeenCalledWith("/PedidosComercio", { params: { comercioId: 2, page: 3, pageSize: 10, estado: 10 } });
  });
});
