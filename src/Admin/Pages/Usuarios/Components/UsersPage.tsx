import { Box, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import type { UsuarioDto } from "../../../../types/Admin/usuarios";
import { useUsers } from "../../../../hooks/useUsers";
import { SearchInput } from "../../../../components/SearchInput";
import { OrderSelect } from "../../../../components/OrderSelect";
import { UsersTable } from "./UsersTable";
import { UserModal } from "./UserModal";

export const UsersPageAdmin = () => {
  const initialForm: UsuarioDto = {
    id: 0,
    uuid: "",

    nombre: "",
    email: "",
    telefono: null,
    fotoUrl: null,

    rol: "",
    activo: true,
    emailVerificado: false,

    codigo: null,
    codigoReferido: null,

    comercioId: null,

    stripeCustomerId: null,
    token: null,

    redeemMonthFree: false,
    redeemRewards: false,

    fechaCreacion: "",
    fechaActualizacion: null,
    ultimoAcceso: null,

    comercios: [],
    direcciones: [],
    suscripciones: [],
  };

  const { total, loading, listar, users } = useUsers();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [view, setView] = useState(false);
  const [user, setUser] = useState<UsuarioDto>(initialForm);
  const [orderBy, setOrderBy] = useState<"recent" | "old" | "az" | "za">("recent",);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listar({
      page,
      rows,
      orderBy,
      search,
    });
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
            setUser(row);
            setView(true);
          }}
        />
      </div>

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
