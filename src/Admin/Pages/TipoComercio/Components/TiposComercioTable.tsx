import {
  IconButton,
  Tooltip,
  Stack,
  Typography,
  Chip,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  GenericTable,
  type TableColumn,
} from "../../../../components/layouts/GenericTable";
import type { TipoComercioCreateDto } from "../../../../types/Admin/tipoComercio";

interface Props {
  tipos: TipoComercioCreateDto[];
  total: number;
  loading: boolean;
  page: number;
  rows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onEdit: (tipo: TipoComercioCreateDto) => void;
  onDelete: (tipo: TipoComercioCreateDto) => void;
}

export const TiposComercioTable = ({
  tipos,
  total,
  loading,
  page,
  rows,
  onPageChange,
  onRowsPerPageChange,
  onEdit,
  onDelete,
}: Props) => {
  const columns: TableColumn<TipoComercioCreateDto>[] = [
    {
      key: "nombre",
      label: "Nombre",
      render: (t) => (
        <Typography className="fz-h4 fw-semibold">{t.nombre}</Typography>
      ),
    },
    {
      key: "descripcion",
      label: "Descripción",
      render: (t) =>
        t.descripcion ? (
          <Typography className="fz-h4 fw-regular" color="text.secondary">
            {t.descripcion}
          </Typography>
        ) : (
          <Typography className="admin-cell-empty">—</Typography>
        ),
    },
    {
      key: "activo",
      label: "Activo",
      render: (t) =>
        t.activo ? (
          <Chip label="Sí" color="success" size="small" variant="outlined" />
        ) : (
          <Chip label="No" size="small" variant="outlined" />
        ),
    },
  ];

  return (
    <Paper elevation={0} className="table-paper p-3">
      <GenericTable<TipoComercioCreateDto>
        columns={columns}
        data={tipos}
        loading={loading}
        emptyText="No hay tipos de comercio registrados"
        page={page}
        rowsPerPage={rows}
        total={total}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        actions={(t) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Editar">
              <IconButton size="small" onClick={() => onEdit(t)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(t)}
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
