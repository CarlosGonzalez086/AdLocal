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
    <div>
      <div className="filters-paper">
        <h1 className="fz-h2 fw-semibold mb-1">Suscripciones</h1>
        <p className="fz-h4 fw-regular text-muted mb-0">
          Listado de todas las suscripciones del sistema
        </p>
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
    </div>
  );
};
