import { Box, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import type {
  SuscripcionDto,
  UsuarioDto,
} from "../../../../types/Admin/usuarios";
import { useUsers } from "../../../../hooks/useUsers";
import { SearchInput } from "../../../../components/SearchInput";
import { OrderSelect } from "../../../../components/OrderSelect";
import { UsersTable } from "./UsersTable";
import { UserModal } from "./UserModal";

export const UsersPageAdmin = () => {
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

  return (
    <Box>
      <Paper elevation={0} className="filters-paper">
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
      <div className="mt-4">
        <UsersTable
          users={users}
          total={total}
          loading={loading}
          page={page}
          rows={rows}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(0);
          }}
          onView={(row) => {
            setUser(row.usuario);
            setSub(row.suscripcion);
            setView(true);
          }}
        />
      </div>

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
