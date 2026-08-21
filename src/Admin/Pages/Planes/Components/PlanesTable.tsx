import {
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Chip,
  Paper,
  Box,
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
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              flexShrink: 0,
              bgcolor: TIPO_COLOR[p.tipo] ?? "#8e8e93",
            }}
          />
          <Stack>
            <Typography fontWeight={600} fontSize="0.9rem">
              {p.nombre}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {p.tipo}
            </Typography>
          </Stack>
        </Stack>
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
          <Typography fontWeight={600} fontSize="0.875rem">
            ${p.precio.toLocaleString()}
          </Typography>
        ),
    },
    {
      key: "duracionDias",
      label: "Duración",
      render: (p) => (
        <Typography color="text.secondary" fontSize="0.875rem">
          {p.duracionDias} días
        </Typography>
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
          <Typography color="text.disabled" fontSize="0.8rem">
            —
          </Typography>
        ),
    },
    {
      key: "isMultiUsuario",
      label: "Multiusuario",
      render: (p) =>
        p.isMultiUsuario ? (
          <Chip label="Sí" size="small" color="primary" variant="outlined" />
        ) : (
          <Typography color="text.disabled" fontSize="0.8rem">
            —
          </Typography>
        ),
    },
  ];

  return (
    <Paper elevation={0} className="table-paper p-3">
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
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => onEdit(p)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(p)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      />
    </Paper>
  );
};
