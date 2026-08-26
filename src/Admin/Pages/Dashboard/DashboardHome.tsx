import { Box, Skeleton } from "@mui/material";
import { useEffect } from "react";
import { useDashboardSuscripciones } from "../../../hooks/useDashboardSuscripciones";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import { useComisionesAdmin } from "../../../hooks/useComisionesAdmin";
import { ComisionesSemanaChart } from "./ComisionesSemanaChart";

export const DashboardHome = () => {
  const { data, loading } = useDashboardSuscripciones();
  const { dashboard: comisiones, cargarDashboard } = useComisionesAdmin();
  useEffect(() => {
    void cargarDashboard();
  }, [cargarDashboard]);

  if (loading || !data) {
    return (
      <Box>
        <Box className="dashboard-kpi-grid">
          {[0, 1].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={92}
              sx={{ borderRadius: "20px" }}
            />
          ))}
        </Box>
        <Box className="dashboard-charts-grid">
          <Skeleton
            variant="rounded"
            height={360}
            sx={{ borderRadius: "16px" }}
          />
          <Skeleton
            variant="rounded"
            height={360}
            sx={{ borderRadius: "16px" }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {comisiones && (
        <>
          <div className="dashboard-kpi-grid mt-4">
            <div className="dashboard-kpi-card">
              <div className="dashboard-kpi-icon">
                <MaterialSymbol icon="trending_up" size="medium" filled />
              </div>
              <div>
                <span className="dashboard-kpi-label d-block">
                  Comisiones esta semana
                </span>
                <strong className="dashboard-kpi-value">
                  {comisiones.comisionesSemana.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </strong>
              </div>
            </div>
            <div className="dashboard-kpi-card">
              <div className="dashboard-kpi-icon">
                <MaterialSymbol icon="pending_actions" size="medium" filled />
              </div>
              <div>
                <span className="dashboard-kpi-label d-block">
                  Pendiente por cobrar
                </span>
                <strong className="dashboard-kpi-value">
                  {comisiones.pendienteCobro.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })}
                </strong>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <ComisionesSemanaChart data={comisiones} />
          </div>
        </>
      )}
    </Box>
  );
};
