import { Button, Box, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import type { PlanCreateDto } from "../../../../types/Admin/planes";
import { usePlanes } from "../../../../hooks/usePlanes";
import { SearchInput } from "../../../../components/SearchInput";
import { OrderSelect } from "../../../../components/OrderSelect";
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
  }, [page, rows, orderBy, search]);

  return (
    <Box>
      <div className="filters-paper">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
        >
          <SearchInput
            value={search}
            placeholder="Buscar plan…"
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
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
            onClick={() => {
              setPlan(initialForm);
              setOpen(true);
            }}
          >
            Nuevo
          </Button>
        </Stack>
      </div>
      <div className="mt-4">
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
    </Box>
  );
};
