import {
  Avatar,
  IconButton,
  Tooltip,
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
        <span className="fz-body-sm text-muted">
          {utcToLocal(usuario.fechaCreacion)}
        </span>
      ),
    },
    {
      key: "nombre",
      label: "Usuario",
      render: (usuario) => (
        <div className="d-flex align-items-center gap-2">
          <Avatar
            src={usuario.fotoUrl ?? undefined}
            style={{ width: 32, height: 32 }}
          >
            {!usuario.fotoUrl
              ? usuario.nombre?.charAt(0).toUpperCase()
              : undefined}
          </Avatar>

          <span className="fz-body-sm fw-semibold text-dark">
            {usuario.nombre || "Sin nombre"}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Correo",
      render: (usuario) => (
        <span className="fz-body-sm text-dark">
          {usuario.email || "—"}
        </span>
      ),
    },
    {
      key: "emailVerificado",
      label: "Verificación",
      render: (usuario) => (
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              display: "inline-block",
              backgroundColor: usuario.emailVerificado ? "var(--success)" : "var(--warning)",
            }}
          />

          <span className="fz-body-sm text-dark">
            {usuario.emailVerificado ? "Verificado" : "Pendiente"}
          </span>
        </div>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (usuario) => (
        <div className="d-flex align-items-center gap-2">
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              display: "inline-block",
              backgroundColor: usuario.activo ? "var(--success)" : "var(--error)",
            }}
          />

          <span className="fz-body-sm fw-semibold text-dark">
            {usuario.activo ? "Activo" : "Inactivo"}
          </span>
        </div>
      ),
    },
    {
      key: "ultimoAcceso",
      label: "Último acceso",
      render: (usuario) => (
        <span className="fz-body-sm text-muted">
          {usuario.ultimoAcceso
            ? utcToLocal(usuario.ultimoAcceso)
            : "Sin acceso"}
        </span>
      ),
    },
  ];

  return (
    <div className="card-adlocal p-3">
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
          <Tooltip title="Ver usuario" disableTouchListener>
            <IconButton
              size="small"
              className="btn-adlocal-ghost p-1"
              onClick={() => onView(row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      />
    </div>
  );
};
