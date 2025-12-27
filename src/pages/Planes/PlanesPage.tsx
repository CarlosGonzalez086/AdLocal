import { IconButton, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import { useState } from "react";
import { usePlanes } from "../../hooks/usePlanes";
import type { PlanCreateDto } from "../../services/planApi";
import { PlanModal } from "../../components/Plan/PlanModal";
import {
  GenericTable,
  type TableColumn,
} from "../../components/layouts/GenericTable";

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

  const { planes, loading, guardar, eliminar } = usePlanes();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(5);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(false);
  const [plan, setPlan] = useState<PlanCreateDto>({
    nombre: "",
    precio: 0,
    duracionDias: 0,
    tipo: "",
  });

  const data = planes.slice(page * rows, page * rows + rows);

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
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setPlan(initialForm);
            setOpen(true);
          }}
        >
          Nuevo
        </Button>
      </div>

      <GenericTable<Plan>
        columns={columns}
        data={data}
        loading={loading}
        emptyText="No hay planes registrados"
        page={page}
        rowsPerPage={rows}
        total={planes.length}
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
                setPlan(p);
                setView(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              color="info"
              onClick={() => {
                setPlan(p);
                setOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>

            <IconButton color="error" onClick={() => eliminar(Number(p.id))}>
              <DeleteIcon />
            </IconButton>
          </>
        )}
      />

      <PlanModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={guardar}
        plan={plan}
      />

      <PlanModal
        open={view}
        onClose={() => setView(false)}
        onSave={() => {}}
        plan={plan}
        soloVer
      />
    </div>
  );
};
