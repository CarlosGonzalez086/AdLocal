import { Alert, Button, Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { GenericTable, type TableColumn } from "../../../components/layouts/GenericTable";
import { useComisionesAdmin } from "../../../hooks/useComisionesAdmin";
import type { ComisionComercioResumen, ComisionMovimiento } from "../../../types/Admin/comisiones";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import { httpAdmin } from "../../../api/httpAdmin";
import type { ApiResponse } from "../../../api/apiResponse";
import type { PagoComision } from "../../../types/User/pagoComisiones";

const moneda = (valor: number) => valor.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
export const ComisionesPage = () => {
  const { resumen, movimientos, total, loading, error, cargar, liquidar } = useComisionesAdmin();
  const [periodo, setPeriodo] = useState("semana"); const [page, setPage] = useState(0); const [rows, setRows] = useState(10);
  const [comercioId, setComercioId] = useState<number | undefined>(); const [estatus, setEstatus] = useState<number | undefined>();
  const [pagosRevision, setPagosRevision] = useState<PagoComision[]>([]);
  const cargarPagos = async () => { const { data } = await httpAdmin.get<ApiResponse<PagoComision[]>>("/PagosComisiones/admin", { params: { estatus: 1 } }); setPagosRevision(data.respuesta ?? []); };
  useEffect(() => { void cargarPagos(); }, []);
  useEffect(() => { void cargar(periodo, page, rows, comercioId, estatus); }, [periodo, page, rows, comercioId, estatus, cargar]);
  const liquidarComercio = async (row: ComisionComercioResumen) => {
    const confirmacion = await Swal.fire({ title: "Registrar liquidación", text: `Se marcarán como pagadas ${moneda(row.pendientePago)} de ${row.comercio}.`, icon: "question", showCancelButton: true, confirmButtonText: "Confirmar pago", cancelButtonText: "Cancelar" });
    if (!confirmacion.isConfirmed) return;
    try { await liquidar(row.comercioId, periodo); await cargar(periodo, page, rows, comercioId, estatus); Swal.fire("Liquidación registrada", "Las comisiones fueron marcadas como pagadas.", "success"); }
    catch (err: any) { Swal.fire("No fue posible liquidar", err?.response?.data?.mensaje || "Intenta nuevamente.", "error"); }
  };
  const columnasResumen = useMemo<TableColumn<ComisionComercioResumen>[]>(() => [
    { key: "comercio", label: "Comercio" }, { key: "ventas", label: "Ventas", align: "center" },
    { key: "ventasMonto", label: "Vendido", align: "right", render: (r) => moneda(r.ventasMonto) },
    { key: "pendienteEfectivo", label: "Debe por efectivo", align: "right", render: (r) => moneda(r.pendienteEfectivo) },
    { key: "pendienteTransferencia", label: "Debe por transferencia", align: "right", render: (r) => moneda(r.pendienteTransferencia) },
    { key: "pendientePago", label: "Total por cobrar", align: "right", render: (r) => <strong>{moneda(r.pendientePago)}</strong> },
  ], []);
  const columnasMovimientos = useMemo<TableColumn<ComisionMovimiento>[]>(() => [
    { key: "numeroPedido", label: "Pedido" }, { key: "comercio", label: "Comercio" }, { key: "metodoPago", label: "Método" },
    { key: "montoVenta", label: "Venta", align: "right", render: (r) => moneda(r.montoVenta) },
    { key: "porcentaje", label: "%", align: "right", render: (r) => `${r.porcentaje}% + ${moneda(r.comisionFija)}` },
    { key: "montoComision", label: "Comisión", align: "right", render: (r) => moneda(r.montoComision) },
    { key: "estatus", label: "Estado", render: (r) => <Chip size="small" color={r.estatus === 2 ? "success" : "warning"} label={r.estatus === 2 ? "Pagada" : "Pendiente"} /> },
  ], []);
  const revisarPago = async (pago: PagoComision, aprobar: boolean) => { const resultado = await Swal.fire({ title: aprobar ? "Aprobar pago" : "Rechazar pago", input: "textarea", inputLabel: "Comentario", showCancelButton: true, confirmButtonText: aprobar ? "Aprobar" : "Rechazar" }); if (!resultado.isConfirmed) return; await httpAdmin.put(`/PagosComisiones/${pago.uuid}/revisar`, { aprobar, comentario: resultado.value }); await cargarPagos(); await cargar(periodo, page, rows, comercioId, estatus); };
  const abrirComprobante = async (uuid: string) => { const response = await httpAdmin.get<Blob>(`/PagosComisiones/${uuid}/comprobante`, { responseType: "blob" }); window.open(URL.createObjectURL(response.data), "_blank", "noopener,noreferrer"); };
  return <div>
    <div className="filters-paper"><div className="d-flex flex-wrap align-items-center justify-content-between gap-3"><div><h1 className="fz-h2 fw-semibold mb-1">Comisiones</h1><p className="fz-h4 fw-regular mb-0">Control de comisiones generadas y pagos pendientes por comercio.</p></div><FormControl size="small" className="commission-period-select"><InputLabel>Periodo</InputLabel><Select label="Periodo" value={periodo} onChange={(e) => { setPeriodo(e.target.value); setPage(0); }}><MenuItem value="semana">Esta semana</MenuItem><MenuItem value="mes">Este mes</MenuItem></Select></FormControl></div></div>
    {error && <Alert severity="error" className="mt-3">{error}</Alert>}
    {pagosRevision.length > 0 && <div className="mt-4"><h2 className="fz-h3 fw-semibold mb-3">Pagos pendientes de verificar</h2><div className="row g-3">{pagosRevision.map((pago) => <div key={pago.uuid} className="col-12 col-lg-6"><div className="commission-payment-card p-4"><div className="d-flex justify-content-between gap-3"><div><h3 className="fz-h4 fw-semibold mb-1">{pago.comercio}</h3><strong className="d-block">{moneda(pago.monto)}</strong><span className="d-block fz-h5">{pago.metodoPago} · {pago.periodo} · {pago.comisionesIncluidas} comisiones</span></div><Chip color="warning" label="Por verificar" /></div><div className="d-flex flex-wrap gap-2 mt-3"><Button className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm" onClick={() => void abrirComprobante(pago.uuid)}>Ver comprobante</Button><Button className="btn-adlocal btn-adlocal--solid btn-adlocal--sm" onClick={() => void revisarPago(pago, true)}>Aprobar</Button><Button className="btn-adlocal btn-adlocal--danger btn-adlocal--sm" onClick={() => void revisarPago(pago, false)}>Rechazar</Button></div></div></div>)}</div></div>}
    <div className="mt-4"><h2 className="fz-h3 fw-semibold mb-3">Por comercio</h2><GenericTable columns={columnasResumen} data={resumen} loading={loading} page={0} rowsPerPage={Math.max(10, resumen.length)} total={resumen.length} onPageChange={() => undefined} onRowsPerPageChange={() => undefined} getRowKey={(r) => r.comercioId} actions={(r) => <Button className="btn-adlocal btn-adlocal--solid btn-adlocal--sm" disabled={r.pendientePago <= 0} onClick={() => void liquidarComercio(r)}><MaterialSymbol icon="payments" size="small" /><span className="ms-1">Registrar pago</span></Button>} /></div>
    <div className="mt-5"><div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3"><h2 className="fz-h3 fw-semibold mb-0">Movimientos</h2><div className="d-flex flex-wrap gap-2"><FormControl size="small" className="commission-filter-select"><InputLabel>Comercio</InputLabel><Select label="Comercio" value={comercioId ?? ""} onChange={(e) => { setComercioId(e.target.value === "" ? undefined : Number(e.target.value)); setPage(0); }}><MenuItem value="">Todos</MenuItem>{resumen.map((r) => <MenuItem key={r.comercioId} value={r.comercioId}>{r.comercio}</MenuItem>)}</Select></FormControl><FormControl size="small" className="commission-filter-select"><InputLabel>Estado</InputLabel><Select label="Estado" value={estatus ?? ""} onChange={(e) => { setEstatus(e.target.value === "" ? undefined : Number(e.target.value)); setPage(0); }}><MenuItem value="">Todos</MenuItem><MenuItem value={1}>Pendiente</MenuItem><MenuItem value={2}>Pagada</MenuItem></Select></FormControl></div></div><GenericTable columns={columnasMovimientos} data={movimientos} loading={loading} page={page} rowsPerPage={rows} total={total} onPageChange={setPage} onRowsPerPageChange={(value) => { setRows(value); setPage(0); }} getRowKey={(r) => r.uuid} /></div>
  </div>;
};
