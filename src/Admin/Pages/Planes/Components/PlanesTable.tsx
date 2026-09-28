import {
  IconButton,
  Tooltip,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { PlanCreateDto } from "../../../../types/Admin/planes";
import {
  GenericTable,
  type TableColumn,
} from "../../../../components/layouts/GenericTable";

const TIPO_COLOR: Record<string, string> = {
  FREE: "#8e8e93",
  BASIC: "#0a84ff",
  PRO: "#af52de",
  BUSINESS: "#ff9f0a",
};

interface Props {
  planes: PlanCreateDto[];
  total: number;
  loading: boolean;
  page: number;
  rows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onEdit: (plan: PlanCreateDto) => void;
  onDelete: (plan: PlanCreateDto) => void;
}

export const PlanesTable = ({
  planes,
  total,
  loading,
  page,
  rows,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: Props) => {
  const columns: TableColumn<PlanCreateDto>[] = [
    {
      key: "nombre",
      label: "Plan",
      render: (p) => (
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              flexShrink: 0,
              backgroundColor: TIPO_COLOR[p.tipo] ?? "#8e8e93",
              display: "inline-block",
            }}
          />
          <div className="d-flex flex-column">
            <span className="fz-body-sm fw-semibold text-dark">
              {p.nombre}
            </span>
            <span className="fz-caption text-muted">
              {p.tipo}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "precio",
      label: "Precio",
      render: (p) =>
        p.precio === 0 ? (
          <Chip
            label="Gratis"
            size="small"
            color="success"
            variant="outlined"
          />
        ) : (
          <span className="fz-body-sm fw-semibold text-dark">
            ${p.precio.toLocaleString()}
          </span>
        ),
    },
    {
      key: "duracionDias",
      label: "Duración",
      render: (p) => (
        <span className="fz-body-sm text-muted">
          {p.duracionDias} días
        </span>
      ),
    },
    {
      key: "nivelVisibilidad",
      label: "Visibilidad",
      render: (p) => (
        <Chip
          label={`${p.nivelVisibilidad}%`}
          size="small"
          color={
            p.nivelVisibilidad >= 70
              ? "success"
              : p.nivelVisibilidad >= 30
                ? "warning"
                : "default"
          }
        />
      ),
    },
    { key: "maxNegocios", label: "Negocios" },
    { key: "maxProductos", label: "Productos" },
    {
      key: "tieneBadge",
      label: "Badge",
      render: (p) =>
        p.tieneBadge ? (
          <Chip label={p.badgeTexto ?? "Badge"} size="small" color="primary" />
        ) : (
          <span className="text-muted fz-caption">
            —
          </span>
        ),
    },
    {
      key: "isMultiUsuario",
      label: "Multiusuario",
      render: (p) =>
        p.isMultiUsuario ? (
          <Chip label="Sí" size="small" color="primary" variant="outlined" />
        ) : (
          <span className="text-muted fz-caption">
            —
          </span>
        ),
    },
  ];

  return (
    <div className="card-adlocal p-3">
      <GenericTable<PlanCreateDto>
        columns={columns}
        data={planes}
        loading={loading}
        emptyText="No hay planes registrados"
        page={page}
        rowsPerPage={rows}
        total={total}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        actions={(p) => (
          <div className="d-flex align-items-center gap-1">
            <Tooltip title="Editar" disableTouchListener>
              <IconButton
                size="small"
                onClick={() => onEdit(p)}
                className="btn-adlocal-ghost p-1"
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar" disableTouchListener>
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(p)}
                className="btn-adlocal-ghost p-1 text-danger"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </div>
        )}
      />
    </div>
  );
};
