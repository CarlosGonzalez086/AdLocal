import { useEffect, useState } from "react";
import type { PlanCreateDto } from "../../../../types/Admin/planes";
import { usePlanes } from "../../../../hooks/usePlanes";
import { SearchToolbar } from "../../../../components/UI/SearchToolbar";
import { PlanesTable } from "./PlanesTable";
import { PlanModal } from "./PlanModal";

export const PlanesPageAdmin = () => {
  const initialForm: PlanCreateDto = {
    nombre: "",
    precio: 0,
    duracionDias: 30,
    tipo: "FREE",
    maxNegocios: 1,
    maxProductos: 0,
    maxFotos: 1,
    stripePriceId: "",
    nivelVisibilidad: 0,
    permiteCatalogo: false,
    coloresPersonalizados: false,
    tieneBadge: false,
    badgeTexto: null,
    tieneAnalytics: false,
    isMultiUsuario: false,
  };

  const { planes, total, loading, listar, guardar, eliminar } = usePlanes();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<PlanCreateDto>(initialForm);

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search, listar]);

  return (
    <div className="w-100">
      <SearchToolbar
        search={search}
        searchPlaceholder="Buscar plan..."
        onSearchChange={(value) => {
          setSearch(value);
          setPage(0);
        }}
        orderBy={orderBy}
        onOrderChange={(value) => {
          setOrderBy(value);
          setPage(0);
        }}
        actionButton={{
          label: "Nuevo Plan",
          icon: "add",
          onClick: () => {
            setPlan(initialForm);
            setOpen(true);
          },
        }}
      />
      <div className="mt-3">
        <PlanesTable
          planes={planes}
          total={total}
          loading={loading}
          page={page}
          rows={rows}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(0);
          }}
          onEdit={(p) => {
            setPlan(p);
            setOpen(true);
          }}
          onDelete={(p) =>
            eliminar(Number(p.id), { page, rows, orderBy, search })
          }
        />
      </div>

      {open && (
        <>
          <PlanModal
            key={`edit-${plan?.id ?? "new"}`}
            open={open}
            onClose={() => {
              setOpen(false);
              setPlan(initialForm);
            }}
            onSave={(p) => guardar(p, { page, rows, orderBy, search })}
            plan={plan}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};
