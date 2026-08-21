import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import type { UsuarioConSuscripcionDto } from "../../../../types/Admin/usuarios";
import {
  GenericTable,
  type TableColumn,
} from "../../../../components/layouts/GenericTable";
import { utcToLocal } from "../../../../utils/generalsFunctions";

interface Props {
  users: UsuarioConSuscripcionDto[];
  total: number;
  loading: boolean;
  page: number;
  rows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (row: UsuarioConSuscripcionDto) => void;
}

const TIPO_COLOR: Record<string, string> = {
  FREE: "#8e8e93",
  BASIC: "#0a84ff",
  PRO: "#af52de",
  BUSINESS: "#ff9f0a",
};

export const UsersTable = ({
  users,
  total,
  loading,
  page,
  rows,
  onPageChange,
  onRowsPerPageChange,
  onView,
}: Props) => {
  const columns: TableColumn<UsuarioConSuscripcionDto>[] = [
    {
      key: "fechaCreacion",
      label: "Registro",
      render: ({ usuario }) => (
        <Typography className="fz-h5 fw-regular" color="text.secondary">
          {utcToLocal(usuario.fechaCreacion)}
        </Typography>
      ),
    },
    {
      key: "nombre",
      label: "Usuario",
      render: ({ usuario }) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={usuario.fotoUrl ?? undefined}
            sx={{ width: 32, height: 32 }}
          />
          <Typography className="fz-h4 fw-semibold">
            {usuario.nombre}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "email",
      label: "Correo",
      render: ({ usuario }) => (
        <Typography className="fz-h4 fw-regular">{usuario.email}</Typography>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: ({ suscripcion }) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            className="admin-plan-dot"
            style={
              {
                "--tipo-color": TIPO_COLOR[suscripcion.plan.tipo] ?? "#8e8e93",
              } as React.CSSProperties
            }
          />
          <Typography className="fz-h4 fw-medium">
            {suscripcion.plan.nombre}
          </Typography>
        </Stack>
      ),
    },
  ];

  return (
    <Paper elevation={0} className="table-paper p-3">      
      <GenericTable<UsuarioConSuscripcionDto>
        columns={columns}
        data={users}
        loading={loading}
        emptyText="No hay usuarios registrados"
        page={page}
        rowsPerPage={rows}
        total={total}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        actions={(row) => (
          <Tooltip title="Ver usuario">
            <IconButton
              size="small"
              className="generic-table-mobile-actions-btn"
              onClick={() => onView(row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      />
    </Paper>
  );
};
