import { useEffect, useState } from "react";
import type { TipoComercioCreateDto } from "../../../../types/Admin/tipoComercio";
import { useTiposComercio } from "../../../../hooks/useTiposComercio";
import { SearchToolbar } from "../../../../components/UI/SearchToolbar";
import { TiposComercioTable } from "./TiposComercioTable";
import { TipoComercioModal } from "./TipoComercioModal";

export const TiposComercioPageAdmin = () => {
  const initialForm: TipoComercioCreateDto = {
    nombre: "",
    descripcion: "",
    activo: true,
  };

  const { tipos, total, loading, listar, guardar, eliminar } =
    useTiposComercio();

  const [page, setPage] = useState(1);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<TipoComercioCreateDto>(initialForm);

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search, listar]);

  return (
    <div className="w-100">
      <SearchToolbar
        search={search}
        searchPlaceholder="Buscar tipo de comercio..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        orderBy={orderBy}
        onOrderChange={(value) => {
          setOrderBy(value);
          setPage(1);
        }}
        actionButton={{
          label: "Nuevo Tipo",
          icon: "add",
          onClick: () => {
            setTipo(initialForm);
            setOpen(true);
          },
        }}
      />
      <div className="mt-3">
        <TiposComercioTable
          tipos={tipos}
          total={total}
          loading={loading}
          page={page - 1}
          rows={rows}
          onPageChange={(p) => setPage(p + 1)}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(1);
          }}
          onEdit={(t) => {
            setTipo(t);
            setOpen(true);
          }}
          onDelete={(t) =>
            eliminar(Number(t.id), { page, rows, orderBy, search })
          }
        />
      </div>
      {open && (
        <TipoComercioModal
          key={`edit-${tipo?.id ?? "new"}`}
          open={open}
          onClose={() => {
            setOpen(false);
            setTipo(initialForm);
          }}
          onSave={(t) => guardar(t, { page, rows, orderBy, search })}
          tipo={tipo}
          loading={loading}
        />
      )}
    </div>
  );
};
