import { IconButton, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useEffect, useState } from "react";
import { usePlanes } from "../../hooks/usePlanes";
import type { PlanCreateDto } from "../../services/planApi";
import { PlanModal } from "../../components/Plan/PlanModal";
import {
  GenericTable,
  type TableColumn,
} from "../../components/layouts/GenericTable";
import { SearchInput } from "../../components/SearchInput";
import { OrderSelect } from "../../components/OrderSelect";

interface Plan {
  id?: number;
  nombre: string;
  precio: number;
  duracionDias: number;
  tipo: string;
}

export const PlanesPage = () => {
  const initialForm: PlanCreateDto = {
    nombre: "",
    precio: 0,
    duracionDias: 0,
    tipo: "",
  };

  const { planes, total, loading, listar, guardar, eliminar } = usePlanes();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [plan, setPlan] = useState<PlanCreateDto>(initialForm);

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search]);

  const columns: TableColumn<Plan>[] = [
    { key: "nombre", label: "Nombre" },
    {
      key: "precio",
      label: "Precio",
      render: (p) => `$${p.precio}`,
    },
    { key: "duracionDias", label: "Días" },
    { key: "tipo", label: "Tipo" },
  ];

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
              setPlan(initialForm);
              setOpen(true);
            }}
            fullWidth
            className="w-100 w-md-auto"
          >
            Nuevo
          </Button>
        </div>
      </div>

      <GenericTable<Plan>
        columns={columns}
        data={planes}
        loading={loading}
        emptyText="No hay planes registrados"
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
                setPlan({
                  nombre: p.nombre,
                  precio: p.precio,
                  duracionDias: p.duracionDias,
                  tipo: p.tipo,
                  id: p.id,
                });
                setView(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              color="info"
              onClick={() => {
                setPlan({
                  nombre: p.nombre,
                  precio: p.precio,
                  duracionDias: p.duracionDias,
                  tipo: p.tipo,
                  id: p.id,
                });
                setOpen(true);
              }}
            >
              <EditIcon />
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

      <PlanModal
        open={open}
        onClose={() => {
          setOpen(false);
          setPlan(initialForm);
        }}
        onSave={(p) => guardar(p, { page, rows, orderBy, search })}
        plan={plan}
        loading={loading}
      />

      <PlanModal
        open={view}
        onClose={() => {
          setView(false);
          setPlan(initialForm);
        }}
        onSave={async () => {}}
        plan={plan}
        soloVer
        
      />
    </div>
  );
};
