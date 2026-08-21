import { Chip, Paper, Stack, Typography } from "@mui/material";
import type { SuscripcionListadoDto } from "../../../../types/Admin/suscripciones";
import {
  GenericTable,
  type TableColumn,
} from "../../../../components/layouts/GenericTable";
import { utcToLocal } from "../../../../utils/generalsFunctions";

const getEstadoChip = (estado: string) => {
  switch (estado) {
    case "active":
      return { label: "Activa", color: "success" as const };
    case "canceling":
      return { label: "Por cancelar", color: "warning" as const };
    case "canceled":
      return { label: "Cancelada", color: "default" as const };
    case "past_due":
    case "unpaid":
      return { label: "Por pagar", color: "error" as const };
    default:
      return { label: estado, color: "default" as const };
  }
};

interface Props {
  suscripciones: SuscripcionListadoDto[];
  total: number;
  loading: boolean;
  page: number;
  rows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export const SuscripcionesTable = ({
  suscripciones,
  total,
  loading,
  page,
  rows,
  onPageChange,
  onRowsPerPageChange,
}: Props) => {
  const columns: TableColumn<SuscripcionListadoDto>[] = [
    {
      key: "usuario",
      label: "Usuario",
      render: (row) => (
        <Stack>
          <Typography className="fz-h4 fw-semibold">
            {row.usuarioNombre}
          </Typography>
          <Typography className="fz-h6 fw-regular" color="text.secondary">
            {row.usuarioEmail}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (row) => (
        <Typography className="fz-h4 fw-medium">{row.planNombre}</Typography>
      ),
    },
    {
      key: "estado",
      label: "Estado",
      render: (row) => {
        const chip = getEstadoChip(row.estado);
        return (
          <Chip
            size="small"
            label={chip.label}
            color={chip.color}
            variant="outlined"
          />
        );
      },
    },
    {
      key: "inicio",
      label: "Inicio",
      render: (row) =>
        row.fechaInicio ? (
          <Typography className="fz-h5 fw-regular" color="text.secondary">
            {utcToLocal(row.fechaInicio)}
          </Typography>
        ) : (
          <Typography className="admin-cell-empty">—</Typography>
        ),
    },
    {
      key: "fin",
      label: "Fin",
      render: (row) =>
        row.fechaFin ? (
          <Typography className="fz-h5 fw-regular" color="text.secondary">
            {utcToLocal(row.fechaFin)}
          </Typography>
        ) : (
          <Typography className="admin-cell-empty">—</Typography>
        ),
    },
    {
      key: "autoRenew",
      label: "Renovación",
      render: (row) => (
        <Typography className="fz-h5 fw-regular" color="text.secondary">
          {row.autoRenew ? "Automática" : "Manual"}
        </Typography>
      ),
    },
    {
      key: "precio",
      label: "Precio",
      render: (row) => (
        <Typography className="fz-h4 fw-semibold">${row.precio} MXN</Typography>
      ),
    },
  ];

  return (
    <Paper elevation={0} className="table-paper p-3">
      <GenericTable<SuscripcionListadoDto>
        columns={columns}
        data={suscripciones}
        loading={loading}
        emptyText="No hay suscripciones registradas"
        page={page}
        rowsPerPage={rows}
        total={total}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
};
