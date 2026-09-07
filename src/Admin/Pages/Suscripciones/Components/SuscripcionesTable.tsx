import { Chip } from "@mui/material";
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
        <div className="d-flex flex-column">
          <span className="fz-body-sm fw-semibold text-dark">
            {row.usuarioNombre}
          </span>
          <span className="fz-caption text-muted">
            {row.usuarioEmail}
          </span>
        </div>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: (row) => (
        <span className="fz-body-sm fw-medium text-dark">{row.planNombre}</span>
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
          <span className="fz-body-sm text-muted">
            {utcToLocal(row.fechaInicio)}
          </span>
        ) : (
          <span className="admin-cell-empty text-muted fz-caption">—</span>
        ),
    },
    {
      key: "fin",
      label: "Fin",
      render: (row) =>
        row.fechaFin ? (
          <span className="fz-body-sm text-muted">
            {utcToLocal(row.fechaFin)}
          </span>
        ) : (
          <span className="admin-cell-empty text-muted fz-caption">—</span>
        ),
    },
    {
      key: "autoRenew",
      label: "Renovación",
      render: (row) => (
        <span className="fz-body-sm text-muted">
          {row.autoRenew ? "Automática" : "Manual"}
        </span>
      ),
    },
    {
      key: "precio",
      label: "Precio",
      render: (row) => (
        <span className="fz-body-sm fw-semibold text-dark">${row.precio} MXN</span>
      ),
    },
  ];

  return (
    <div className="card-adlocal p-3">
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
    </div>
  );
};
