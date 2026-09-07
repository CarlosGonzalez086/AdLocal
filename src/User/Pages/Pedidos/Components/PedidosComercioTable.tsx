import {
  GenericTable,
  type TableColumn,
} from "../../../../components/layouts/GenericTable";
import type { PedidoComercioListadoDto } from "../../../../types/User/pedidosComercio";
import {
  EstadoPagoPedido,
  EstadoPedido,
} from "../../../../types/User/pedidosComercio";
import {
  dateFormatter,
  estadoPagoTexto,
  estadoPedidoTexto,
  moneyFormatter,
} from "../pedidoComercioPresentation";
import { StatusBadge, type StatusVariant } from "../../../../components/UI/StatusBadge";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

interface Props {
  pedidos: PedidoComercioListadoDto[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  total: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onDetalle: (pedidoUuid: string) => void;
}

const getEstadoPedidoVariant = (estado: number): StatusVariant => {
  switch (estado) {
    case EstadoPedido.PendienteAprobacion:
      return "warning";
    case EstadoPedido.Aprobado:
    case EstadoPedido.ListoParaRecoger:
    case EstadoPedido.ListoParaEnviar:
      return "info";
    case EstadoPedido.Preparando:
    case EstadoPedido.Enviado:
      return "purple";
    case EstadoPedido.Entregado:
    case EstadoPedido.Completado:
      return "success";
    case EstadoPedido.Rechazado:
    case EstadoPedido.Cancelado:
      return "error";
    default:
      return "neutral";
  }
};

const getEstadoPagoVariant = (estadoPago: number): StatusVariant => {
  switch (estadoPago) {
    case EstadoPagoPedido.Pagado:
      return "success";
    case EstadoPagoPedido.PendienteVerificacion:
      return "warning";
    case EstadoPagoPedido.Rechazado:
      return "error";
    default:
      return "neutral";
  }
};

const columns: TableColumn<PedidoComercioListadoDto>[] = [
  {
    key: "numeroPedido",
    label: "Pedido",
    minWidth: 160,
    render: (pedido) => (
      <div>
        <div className="fw-bold fz-body-sm text-dark">
          #{pedido.numeroPedido}
        </div>
        <div className="fz-caption text-muted mt-1">
          {pedido.totalProductos} {pedido.totalProductos === 1 ? "producto" : "productos"}
        </div>
      </div>
    ),
  },
  {
    key: "clienteNombre",
    label: "Cliente",
    minWidth: 170,
    render: (pedido) => (
      <span className="fz-body-sm fw-semibold text-dark">
        {pedido.clienteNombre}
      </span>
    ),
  },
  {
    key: "fechaCreacion",
    label: "Fecha",
    minWidth: 160,
    render: (pedido) => (
      <span className="fz-body-sm text-muted">
        {dateFormatter.format(new Date(pedido.fechaCreacion))}
      </span>
    ),
  },
  {
    key: "estado",
    label: "Estado",
    minWidth: 170,
    render: (pedido) => (
      <StatusBadge
        label={estadoPedidoTexto[pedido.estado] || "Desconocido"}
        variant={getEstadoPedidoVariant(pedido.estado)}
        dot
        size="small"
      />
    ),
  },
  {
    key: "estadoPago",
    label: "Pago",
    minWidth: 160,
    render: (pedido) => (
      <StatusBadge
        label={estadoPagoTexto[pedido.estadoPago] || "Pendiente"}
        variant={getEstadoPagoVariant(pedido.estadoPago)}
        size="small"
      />
    ),
  },
  {
    key: "total",
    label: "Total",
    align: "right",
    minWidth: 130,
    render: (pedido) => (
      <span className="fw-bold fz-body-sm text-dark">
        {moneyFormatter.format(pedido.total)}
      </span>
    ),
  },
];

export const PedidosComercioTable = ({
  pedidos,
  loading,
  page,
  rowsPerPage,
  total,
  onPageChange,
  onRowsPerPageChange,
  onDetalle,
}: Props) => (
  <GenericTable<PedidoComercioListadoDto>
    columns={columns}
    data={pedidos}
    loading={loading}
    emptyText="No hay pedidos"
    emptyDescription="No existen pedidos que coincidan con el filtro seleccionado."
    page={page}
    rowsPerPage={rowsPerPage}
    total={total}
    onPageChange={onPageChange}
    onRowsPerPageChange={onRowsPerPageChange}
    getRowKey={(pedido) => pedido.uuid}
    actions={(pedido) => (
      <button
        type="button"
        className="btn-adlocal btn-adlocal-outline-primary btn-adlocal-sm d-inline-flex align-items-center gap-1"
        onClick={() => onDetalle(pedido.uuid)}
      >
        <MaterialSymbol icon="visibility" size="small" />
        <span>Detalle</span>
      </button>
    )}
  />
);
