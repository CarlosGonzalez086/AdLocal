import { IconButton, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

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

  const { total, loading, listar, eliminar, users } = useUsers();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [search, setSearch] = useState("");
  const [view, setView] = useState(false);
  const [user, setUser] = useState<UserDto>(initialForm);

  const columns: TableColumn<UserDto>[] = [
    {
      key: "fechaCreacion",
      label: "Fecha Registro",
      render: (row: UserDto) => utcToLocal(row.fechaCreacion),
    },

    { key: "nombre", label: "Nombre" },
    {
      key: "email",
      label: "Correo",
    },
  ];

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search]);

  return (
    <div>
      <div className="row align-items-center mb-3">
        <div className="col-12 col-md-7 mb-2 mb-md-0">
          <SearchInput
            value={search}
            placeholder="Buscar plan..."
            onChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
          />
        </div>

        <div className="col-12 col-md-3 mb-2 mb-md-0">
          <OrderSelect
            value={orderBy}
            onChange={(value) => {
              setOrderBy(value);
              setPage(0);
            }}
          />
        </div>

        <div className="col-12 col-md-2 d-flex justify-content-md-end">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setUser(initialForm);
              setView(true);
            }}
            fullWidth
            className="w-100 w-md-auto"
          >
            Nuevo
          </Button>
        </div>
      </div>

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
          <>
            <IconButton
              color="primary"
              onClick={() => {
                setUser({
                  nombre: p.nombre,
                  email: p.email,
                  fotoUrl: p.fotoUrl,
                  id: p.id,
                  fechaCreacion: p.fechaCreacion,
                });
                setView(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              color="error"
              onClick={() =>
                eliminar(Number(p.id), { page, rows, orderBy, search })
              }
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      />

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
