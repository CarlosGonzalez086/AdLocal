import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Tooltip,
  Avatar,
  Chip,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useEffect, useState } from "react";

import { useUsers } from "../../../hooks/useUsers";

import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import { SearchInput } from "../../../components/SearchInput";
import { OrderSelect } from "../../../components/OrderSelect";
import { UserModal } from "../../../components/UserModal";
import { utcToLocal } from "../../../utils/generalsFunctions";
import type {
  SuscripcionDto,
  UsuarioConSuscripcionDto,
  UsuarioDto,
} from "../../../services/usersApi";

export const UsersPage = () => {
  const initialForm: UsuarioDto = {
    id: 0,
    nombre: "",
    email: "",
    fotoUrl: null,
    fechaCreacion: "",
  };

  const initialSuscripcion: SuscripcionDto = {
    id: 0,
    status: "active",
    currentPeriodStart: "",
    currentPeriodEnd: "",
    autoRenew: false,
    plan: {
      id: 0,
      nombre: "",
      tipo: "FREE",
      precio: 0,
      maxFotos: 0,
    },
  };

  const { total, loading, listar, users } = useUsers();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState<"recent" | "old" | "az" | "za">(
    "recent",
  );
  const [search, setSearch] = useState("");
  const [view, setView] = useState(false);
  const [user, setUser] = useState<UsuarioDto>(initialForm);
  const [sub, setSub] = useState<SuscripcionDto>(initialSuscripcion);

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search, listar]);

  const columns: TableColumn<UsuarioConSuscripcionDto>[] = [
    {
      key: "fechaCreacion",
      label: "Registro",
      render: ({ usuario }) => (
        <Typography fontSize={13} color="text.secondary">
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
          <Typography fontWeight={600}>{usuario.nombre}</Typography>
        </Stack>
      ),
    },
    {
      key: "email",
      label: "Correo",
      render: ({ usuario }) => (
        <Typography fontSize={14}>{usuario.email}</Typography>
      ),
    },
    {
      key: "plan",
      label: "Plan",
      render: ({ suscripcion }) => (
        <Chip
          size="small"
          label={suscripcion.plan.nombre}
          color={
            suscripcion.plan.tipo === "PRO"
              ? "primary"
              : suscripcion.plan.tipo === "BASIC"
                ? "success"
                : "default"
          }
        />
      ),
    },
  ];

  console.log(users);

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
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
              setOrderBy(value as "recent" | "old" | "az" | "za");
              setPage(0);
            }}
          />
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        <GenericTable<UsuarioConSuscripcionDto>
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
          actions={(row) => (
            <Tooltip title="Ver usuario">
              <IconButton
                size="small"
                sx={{
                  bgcolor: "#F2F2F7",
                  "&:hover": { bgcolor: "#E5E5EA" },
                }}
                onClick={() => {
                  setUser(row.usuario);
                  setSub(row.suscripcion);
                  setView(true);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        />
      </Paper>

      <UserModal
        open={view}
        onClose={() => {
          setView(false);
          setUser(initialForm);
          setSub(initialSuscripcion);
        }}
        suscripcion={sub}
        usuario={user}
        soloVer
      />
    </Box>
  );
};
