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
import type { UsuarioDto } from "../../../../types/Admin/usuarios";
import {
  GenericTable,
  type TableColumn,
} from "../../../../components/layouts/GenericTable";
import { utcToLocal } from "../../../../utils/generalsFunctions";

interface Props {
  users: UsuarioDto[];
  total: number;
  loading: boolean;
  page: number;
  rows: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
  onView: (row: UsuarioDto) => void;
}

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
  const columns: TableColumn<UsuarioDto>[] = [
    {
      key: "fechaCreacion",
      label: "Registro",
      render: (usuario) => (
        <Typography className="fz-h5 fw-regular" color="text.secondary">
          {utcToLocal(usuario.fechaCreacion)}
        </Typography>
      ),
    },
    {
      key: "nombre",
      label: "Usuario",
      render: (usuario) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={usuario.fotoUrl ?? undefined}
            sx={{ width: 32, height: 32 }}
          >
            {!usuario.fotoUrl
              ? usuario.nombre?.charAt(0).toUpperCase()
              : undefined}
          </Avatar>

          <Typography className="fz-h4 fw-semibold">
            {usuario.nombre || "Sin nombre"}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "email",
      label: "Correo",
      render: (usuario) => (
        <Typography className="fz-h4 fw-regular">
          {usuario.email || "—"}
        </Typography>
      ),
    },
    {
      key: "emailVerificado",
      label: "Verificación",
      render: (usuario) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: usuario.emailVerificado
                ? "success.main"
                : "warning.main",
            }}
          />

          <Typography className="fz-h4 fw-regular">
            {usuario.emailVerificado ? "Verificado" : "Pendiente"}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (usuario) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: usuario.activo ? "success.main" : "error.main",
            }}
          />

          <Typography className="fz-h4 fw-semibold">
            {usuario.activo ? "Activo" : "Inactivo"}
          </Typography>
        </Stack>
      ),
    },
    {
      key: "ultimoAcceso",
      label: "Último acceso",
      render: (usuario) => (
        <Typography className="fz-h5 fw-regular" color="text.secondary">
          {usuario.ultimoAcceso
            ? utcToLocal(usuario.ultimoAcceso)
            : "Sin acceso"}
        </Typography>
      ),
    },
  ];
  return (
    <Paper elevation={0} className="table-paper p-3">
      <GenericTable<UsuarioDto>
        columns={columns}
        data={users}
        loading={loading}
        emptyText="No hay usuarios registrados"
        emptyDescription="No se encontraron usuarios para mostrar."
        page={page}
        rowsPerPage={rows}
        total={Number(total ?? 0)}
        rowsPerPageOptions={[10, 30, 100]}
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
