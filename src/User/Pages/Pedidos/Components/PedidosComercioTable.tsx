import { Button, Chip } from "@mui/material";
import {
  GenericTable,
  type TableColumn,
} from "../../../../components/layouts/GenericTable";
import type { PedidoComercioListadoDto } from "../../../../types/User/pedidosComercio";
import {
  colorEstadoPago,
  dateFormatter,
  estadoPagoTexto,
  estadoPedidoTexto,
  moneyFormatter,
} from "../pedidoComercioPresentation";

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

const columns: TableColumn<PedidoComercioListadoDto>[] = [
  {
    key: "numeroPedido",
    label: "Pedido",
    minWidth: 150,
    render: (pedido) => (
      <div>
        <strong className="fz-h4 fw-semibold d-block">
          {pedido.numeroPedido}
        </strong>
        <small className="text-muted fz-h6 fw-regular d-block mt-1">
          {pedido.totalProductos} productos
        </small>
      </div>
    ),
  },
  { key: "clienteNombre", label: "Cliente", minWidth: 170 },
  {
    key: "fechaCreacion",
    label: "Fecha",
    minWidth: 180,
    render: (pedido) => dateFormatter.format(new Date(pedido.fechaCreacion)),
  },
  {
    key: "estado",
    label: "Estado",
    minWidth: 170,
    render: (pedido) => (
      <Chip size="small" label={estadoPedidoTexto[pedido.estado]} />
    ),
  },
  {
    key: "estadoPago",
    label: "Pago",
    minWidth: 170,
    render: (pedido) => (
      <Chip
        size="small"
        color={colorEstadoPago(pedido.estadoPago)}
        label={estadoPagoTexto[pedido.estadoPago]}
      />
    ),
  },
  {
    key: "total",
    label: "Total",
    align: "right",
    minWidth: 120,
    render: (pedido) => (
      <strong className="fz-h4 fw-semibold">
        {moneyFormatter.format(pedido.total)}
      </strong>
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
      <Button
        type="button"
        className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm fz-h5 fw-semibold"
        onClick={() => onDetalle(pedido.uuid)}
      >
        Ver detalle
      </Button>
    )}
  />
);
