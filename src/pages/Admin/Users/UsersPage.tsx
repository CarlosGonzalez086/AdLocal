import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";

import { useUsers } from "../../../hooks/useUsers";
import type { UserDto } from "../../../services/usersApi";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import { SearchInput } from "../../../components/SearchInput";
import { OrderSelect } from "../../../components/OrderSelect";
import { UserModal } from "../../../components/UserModal";
import { utcToLocal } from "../../../utils/generalsFunctions";

export const UsersPage = () => {
  const initialForm: UserDto = {
    id: 0,
    nombre: "",
    email: "",
    fotoUrl: "",
    fechaCreacion: "",
  };

  const { total, loading, listar, users } = useUsers();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [search, setSearch] = useState("");
  const [view, setView] = useState(false);
  const [user, setUser] = useState<UserDto>(initialForm);

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search]);

  const columns: TableColumn<UserDto>[] = [
    {
      key: "fechaCreacion",
      label: "Registro",
      render: (row) => (
        <Typography fontSize={13} color="text.secondary">
          {utcToLocal(row.fechaCreacion)}
        </Typography>
      ),
    },
    {
      key: "nombre",
      label: "Usuario",
      render: (row) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar
            src={row.fotoUrl}
            sx={{ width: 32, height: 32 }}
          />
          <Typography fontWeight={600}>{row.nombre}</Typography>
        </Stack>
      ),
    },
    {
      key: "email",
      label: "Correo",
      render: (row) => (
        <Typography fontSize={14}>{row.email}</Typography>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          background:
            "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
        >

          <SearchInput
            value={search}
            placeholder="Buscar usuario…"
            onChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
          />

          <OrderSelect
            value={orderBy}
            onChange={(value) => {
              setOrderBy(value);
              setPage(0);
            }}
          />
        </Stack>
      </Paper>

      {/* Tabla */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <GenericTable<UserDto>
          columns={columns}
          data={users}
          loading={loading}
          emptyText="No hay usuarios registrados"
          page={page}
          rowsPerPage={rows}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(0);
          }}
          actions={(p) => (
            <Tooltip title="Ver usuario">
              <IconButton
                size="small"
                sx={{
                  bgcolor: "#F2F2F7",
                  "&:hover": { bgcolor: "#E5E5EA" },
                }}
                onClick={() => {
                  setUser(p);
                  setView(true);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        />
      </Paper>

      {/* Modal */}
      <UserModal
        open={view}
        onClose={() => {
          setView(false);
          setUser(initialForm);
        }}
        usuario={user}
        soloVer
      />
    </Box>
  );
};
