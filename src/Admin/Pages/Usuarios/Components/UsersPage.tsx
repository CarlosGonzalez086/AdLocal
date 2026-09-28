import { useEffect, useState } from "react";
import type { UsuarioDto } from "../../../../types/Admin/usuarios";
import { useUsers } from "../../../../hooks/useUsers";
import { SearchToolbar } from "../../../../components/UI/SearchToolbar";
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
  const [orderBy, setOrderBy] = useState<"recent" | "old" | "az" | "za">("recent");
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
    <div className="w-100">
      <SearchToolbar
        search={search}
        searchPlaceholder="Buscar usuario..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        orderBy={orderBy}
        onOrderChange={(value) => {
          setOrderBy(value as "recent" | "old" | "az" | "za");
          setPage(0);
        }}
      />
      <div className="mt-3">
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
    </div>
  );
};
