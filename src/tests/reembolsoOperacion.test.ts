import { describe, expect, it } from "vitest";
import { claveReembolso, leerReembolsoPendiente, prepararReembolso, validarReembolso } from "../utils/reembolsoOperacion";
import type { RegistrarReembolsoPedidoDto } from "../types/User/pedidosComercio";

const dto = (): RegistrarReembolsoPedidoDto => ({ versionPedido: 2, idempotencyKey: "original", monto: 90, metodo: 2,
  referencia: "recibo", motivo: "Devolución", productosDevueltos: [] });
const pedido = { total: 90, estado: 9, productos: [{ uuid: "detalle", stockDescontado: 2 }] };
function storage() {
  const datos = new Map<string, string>();
  return { getItem: (k: string) => datos.get(k) ?? null, setItem: (k: string, v: string) => { datos.set(k, v); }, removeItem: (k: string) => { datos.delete(k); } };
}
describe("Recuperación del registro de reembolso", () => {
  it("conserva clave y datos tras recargar o cambiar el formulario", () => {
    const s = storage(); prepararReembolso(s, "pedido", dto());
    expect(prepararReembolso(s, "pedido", { ...dto(), idempotencyKey: "otra", referencia: "otra" })).toEqual(dto());
    expect(leerReembolsoPendiente(s, "pedido")).toEqual(dto());
  });
  it("separa intentos por cuenta, comercio y pedido", () => {
    expect(new Set([claveReembolso("1", 2, "p"), claveReembolso("2", 2, "p"), claveReembolso("1", 3, "p"), claveReembolso("1", 2, "otro")]).size).toBe(4);
  });
  it("un almacenamiento inaccesible bloquea la preparación antes de enviar", () => {
    const s = { ...storage(), setItem: () => { throw new Error("storage bloqueado"); } };
    expect(() => prepararReembolso(s, "pedido", dto())).toThrow("storage bloqueado");
  });
  it("no sustituye silenciosamente un registro corrupto por otra clave", () => {
    const s = storage(); s.setItem("pedido", "{malformado");
    expect(() => prepararReembolso(s, "pedido", dto())).toThrow();
  });
  it("rechaza un reembolso parcial y exige una referencia verificable", () => {
    expect(validarReembolso(pedido, { ...dto(), monto: 45 })).toContain("total exacto");
    expect(validarReembolso(pedido, { ...dto(), referencia: " " })).toContain("referencia");
  });
  it("rechaza unidades superiores al stock o sin registro histórico", () => {
    const p = { ...dto(), productosDevueltos: [{ detalleUuid: "detalle", cantidad: 3 }] };
    expect(validarReembolso(pedido, p)).toContain("unidades");
    expect(validarReembolso({ ...pedido, productos: [{ uuid: "detalle", stockDescontado: null }] }, { ...p, productosDevueltos: [{ detalleUuid: "detalle", cantidad: 1 }] })).toContain("unidades");
  });
  it("permite devolver unidades preparadas, pero libera automáticamente reservas sin preparar", () => {
    const p = { ...dto(), productosDevueltos: [{ detalleUuid: "detalle", cantidad: 1 }] };
    expect(validarReembolso({ ...pedido, estado: 4 }, p)).toBeNull();
    expect(validarReembolso({ ...pedido, estado: 2 }, p)).toContain("reservado");
    expect(validarReembolso(pedido, dto())).toBeNull();
  });
  it("rechaza productos repetidos y cantidades fraccionarias", () => {
    expect(validarReembolso(pedido, { ...dto(), productosDevueltos: [{ detalleUuid: "detalle", cantidad: 1 }, { detalleUuid: "detalle", cantidad: 1 }] })).toContain("repitas");
    expect(validarReembolso(pedido, { ...dto(), productosDevueltos: [{ detalleUuid: "detalle", cantidad: 0.5 }] })).toContain("unidades");
  });
});
