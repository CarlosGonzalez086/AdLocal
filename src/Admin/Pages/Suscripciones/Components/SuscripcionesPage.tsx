import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useSuscripcionesAdmin } from "../../../../hooks/useSuscripcionesAdmin";
import { SuscripcionesTable } from "./SuscripcionesTable";

export const SuscripcionesPage = () => {
  const { total, loading, listar, suscripciones } = useSuscripcionesAdmin();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);

  useEffect(() => {
    listar({ page, rows });
  }, [page, rows, listar]);

  return (
    <Box>
      <div className="filters-paper">
        <h2 className="fz-h2 fw-semibold">Suscripciones</h2>
        <h2 className="fz-h4 fw-regular" color="text.secondary">
          Listado de todas las suscripciones del sistema
        </h2>
      </div>
      <div className="mt-4">
        <SuscripcionesTable
          suscripciones={suscripciones}
          total={total}
          loading={loading}
          page={page}
          rows={rows}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => {
            setRows(r);
            setPage(0);
          }}
        />
      </div>
    </Box>
  );
};
