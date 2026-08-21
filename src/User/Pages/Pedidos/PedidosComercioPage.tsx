import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import { usePedidosComercio } from "../../../hooks/usePedidosComercio";
import {
  EstadoPagoPedido,
  EstadoPedido,
  type EstadoPedido as EstadoPedidoType,
} from "../../../types/User/pedidosComercio";
import { ComprobantePedidoModal } from "./Components/ComprobantePedidoModal";
import { PedidoDetalleModal } from "./Components/PedidoDetalleModal";
import { PedidosComercioTable } from "./Components/PedidosComercioTable";
import {
  accionPedidoTexto,
  estadoPedidoTexto,
  moneyFormatter,
} from "./pedidoComercioPresentation";

export const PedidosComercioPage = () => {
  const pedidosHook = usePedidosComercio();
  const [searchParams, setSearchParams] = useSearchParams();
  const [comprobanteUrl, setComprobanteUrl] = useState<string | null>(null);
  const [cargandoComprobante, setCargandoComprobante] = useState(false);

  useEffect(() => {
    const pedidoUuid = searchParams.get("pedido");

    if (!pedidoUuid || !pedidosHook.comercioId) return;

    void pedidosHook.seleccionar(pedidoUuid);
    setSearchParams({}, { replace: true });
  }, [
    searchParams,
    setSearchParams,
    pedidosHook.comercioId,
    pedidosHook.seleccionar,
  ]);

  useEffect(
    () => () => {
      if (comprobanteUrl) URL.revokeObjectURL(comprobanteUrl);
    },
    [comprobanteUrl],
  );

  const cerrarComprobante = () => {
    if (comprobanteUrl) URL.revokeObjectURL(comprobanteUrl);
    setComprobanteUrl(null);
  };

  const ejecutarEstado = async (estado: EstadoPedidoType) => {
    const requiereMotivo =
      estado === EstadoPedido.Rechazado || estado === EstadoPedido.Cancelado;

    const confirmacion = await Swal.fire({
      title: accionPedidoTexto[estado],
      text: requiereMotivo
        ? "Explica el motivo para informar al cliente."
        : "El cliente verá este cambio en el seguimiento.",
      input: requiereMotivo ? "textarea" : undefined,
      inputPlaceholder: "Motivo o comentario",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      preConfirm: (value) =>
        requiereMotivo && !String(value || "").trim()
          ? Swal.showValidationMessage("Escribe un motivo.")
          : value,
    });

    if (confirmacion.isConfirmed) {
      await pedidosHook.cambiarEstado(estado, String(confirmacion.value || ""));
    }
  };

  const abrirComprobante = async () => {
    setCargandoComprobante(true);

    try {
      setComprobanteUrl(await pedidosHook.abrirComprobante());
    } catch {
      await Swal.fire("Error", "No fue posible abrir el comprobante.", "error");
    } finally {
      setCargandoComprobante(false);
    }
  };

  const revisarPago = async (aprobar: boolean) => {
    const resultado = await Swal.fire({
      title: aprobar ? "Aprobar pago" : "Rechazar comprobante",
      text: aprobar
        ? "Confirma que el monto y los datos sean correctos."
        : "Indica por qué debe enviarse otro comprobante.",
      input: aprobar ? undefined : "textarea",
      showCancelButton: true,
      confirmButtonText: aprobar ? "Marcar pagado" : "Rechazar",
      cancelButtonText: "Cancelar",
      preConfirm: (value) =>
        !aprobar && !String(value || "").trim()
          ? Swal.showValidationMessage("Escribe el motivo del rechazo.")
          : value,
    });

    if (!resultado.isConfirmed) return;

    const actualizado = await pedidosHook.revisarPago(
      aprobar ? EstadoPagoPedido.Pagado : EstadoPagoPedido.Rechazado,
      String(resultado.value || ""),
    );

    if (actualizado) cerrarComprobante();
  };

  const stats = [
    {
      icon: "payments",
      label: "Ventas de hoy",
      value: moneyFormatter.format(pedidosHook.dashboard?.ventasHoy ?? 0),
    },
    {
      icon: "date_range",
      label: "Ventas de la semana",
      value: moneyFormatter.format(pedidosHook.dashboard?.ventasSemana ?? 0),
    },
    {
      icon: "receipt_long",
      label: "Pedidos de hoy",
      value: pedidosHook.dashboard?.pedidosHoy ?? 0,
    },
    {
      icon: "pending_actions",
      label: "Por aprobar",
      value: pedidosHook.dashboard?.pendientesAprobacion ?? 0,
    },
    {
      icon: "fact_check",
      label: "Comprobantes por revisar",
      value: pedidosHook.dashboard?.comprobantesPendientes ?? 0,
    },
  ];

  return (
    <div className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-center gap-3 flex-wrap">
        <div>
          <h1 className="fz-h1 fw-bold mb-1">Pedidos</h1>
          <p className="fz-h4 fw-regular mb-0">
            Administra ventas, entregas y comprobantes.
          </p>
        </div>

        <FormControl size="small" className="col-12 col-sm-5 col-lg-3">
          <InputLabel>Comercio</InputLabel>
          <Select
            value={pedidosHook.comercioId || ""}
            label="Comercio"
            className="fz-h4 fw-regular"
            onChange={(event) =>
              pedidosHook.cambiarComercio(Number(event.target.value))
            }
          >
            {pedidosHook.comercios.map((comercio) => (
              <MenuItem
                key={comercio.id}
                value={comercio.id}
                className="fz-h4 fw-regular"
              >
                {comercio.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {pedidosHook.error && (
        <Alert severity="error" className="fz-h4 fw-medium">
          {pedidosHook.error}
        </Alert>
      )}

      <div className="row g-3">
        {stats.map((stat) => (
          <div key={stat.label} className="col-12 col-sm-6 col-xl">
            <div className="pedidosStatCard h-100 p-3 d-flex flex-column gap-2">
              <span className="pedidosStatIcon">
                <MaterialSymbol icon={stat.icon} size="medium" />
              </span>
              <span className="fz-h5 fw-medium">{stat.label}</span>
              <strong className="fz-h2 fw-bold">{stat.value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="pedidosOrdersCard overflow-hidden">
        <div className="pedidosFilters p-3 p-md-4 d-flex justify-content-between align-items-center gap-3 flex-wrap">
          <h2 className="fz-h2 fw-semibold mb-0">Todos los pedidos</h2>

          <FormControl size="small" className="col-12 col-sm-5 col-lg-3">
            <InputLabel>Estado</InputLabel>
            <Select
              value={pedidosHook.filtro ?? 0}
              label="Estado"
              className="fz-h4 fw-regular"
              onChange={(event) =>
                pedidosHook.cambiarFiltro(
                  Number(event.target.value) === 0
                    ? null
                    : (Number(event.target.value) as EstadoPedidoType),
                )
              }
            >
              <MenuItem value={0} className="fz-h4 fw-regular">
                Todos
              </MenuItem>
              {Object.entries(estadoPedidoTexto).map(([value, label]) => (
                <MenuItem
                  key={value}
                  value={Number(value)}
                  className="fz-h4 fw-regular"
                >
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <PedidosComercioTable
          pedidos={pedidosHook.pedidos.items}
          loading={pedidosHook.loading}
          page={pedidosHook.pagina - 1}
          rowsPerPage={pedidosHook.rowsPerPage}
          total={pedidosHook.pedidos.totalItems}
          onPageChange={(page) => pedidosHook.setPagina(page + 1)}
          onRowsPerPageChange={pedidosHook.cambiarRowsPerPage}
          onDetalle={pedidosHook.seleccionar}
        />
      </div>

      <PedidoDetalleModal
        pedido={pedidosHook.detalle}
        loading={pedidosHook.procesando}
        onClose={() => pedidosHook.setDetalle(null)}
        onCambiarEstado={ejecutarEstado}
        onRevisarComprobante={abrirComprobante}
        onCambiarPago={(estado) => void pedidosHook.revisarPago(estado)}
      />

      <ComprobantePedidoModal
        open={Boolean(comprobanteUrl) || cargandoComprobante}
        loading={cargandoComprobante}
        comprobanteUrl={comprobanteUrl}
        numeroPedido={pedidosHook.detalle?.numeroPedido}
        estadoPago={pedidosHook.detalle?.estadoPago}
        onClose={cerrarComprobante}
        onAprobar={() => void revisarPago(true)}
        onRechazar={() => void revisarPago(false)}
      />
    </div>
  );
};
