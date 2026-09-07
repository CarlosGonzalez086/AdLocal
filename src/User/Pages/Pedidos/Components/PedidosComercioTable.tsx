import { Button, Box, Typography } from "@mui/material";
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
      <Box>
        <Typography sx={{ fontWeight: 700, fontSize: "14.5px", color: "#1C1C1E" }}>
          #{pedido.numeroPedido}
        </Typography>
        <Typography sx={{ fontSize: "12px", color: "#8E8E93", mt: 0.3 }}>
          {pedido.totalProductos} {pedido.totalProductos === 1 ? "producto" : "productos"}
        </Typography>
      </Box>
    ),
  },
  {
    key: "clienteNombre",
    label: "Cliente",
    minWidth: 170,
    render: (pedido) => (
      <Typography sx={{ fontSize: "14px", fontWeight: 550, color: "#1C1C1E" }}>
        {pedido.clienteNombre}
      </Typography>
    ),
  },
  {
    key: "fechaCreacion",
    label: "Fecha",
    minWidth: 160,
    render: (pedido) => (
      <Typography sx={{ fontSize: "13px", color: "#6E6E73" }}>
        {dateFormatter.format(new Date(pedido.fechaCreacion))}
      </Typography>
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
      <Typography sx={{ fontWeight: 750, fontSize: "14.5px", color: "#1C1C1E" }}>
        {moneyFormatter.format(pedido.total)}
      </Typography>
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
        variant="outlined"
        size="small"
        onClick={() => onDetalle(pedido.uuid)}
        startIcon={<MaterialSymbol icon="visibility" size="small" />}
        sx={{
          minHeight: "36px",
          borderRadius: "8px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "13px",
          py: 0.6,
          px: 1.5,
          color: "#007AFF",
          borderColor: "rgba(0, 122, 255, 0.25)",
          backgroundColor: "rgba(0, 122, 255, 0.04)",
          "&:hover": {
            borderColor: "#007AFF",
            backgroundColor: "rgba(0, 122, 255, 0.08)",
          },
        }}
      >
        Detalle
      </Button>
    )}
  />
);
