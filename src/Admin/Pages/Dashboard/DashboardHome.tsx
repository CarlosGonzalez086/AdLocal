import { Box, Typography, Skeleton } from "@mui/material";
import { useEffect } from "react";
import { useDashboardSuscripciones } from "../../../hooks/useDashboardSuscripciones";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import { iosColors } from "../../../utils/constantes";
import { SubscriptionsByPlanChart } from "./SubscriptionsByPlanChart";
import { SubscriptionsDonutChart } from "./SubscriptionsDonutChart";
import { useComisionesAdmin } from "../../../hooks/useComisionesAdmin";
import { ComisionesSemanaChart } from "./ComisionesSemanaChart";

export const DashboardHome = () => {
  const { data, loading } = useDashboardSuscripciones();
  const { dashboard: comisiones, cargarDashboard } = useComisionesAdmin();
  useEffect(() => { void cargarDashboard(); }, [cargarDashboard]);

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
      {/* KPIs */}
      <Box className="dashboard-kpi-grid">
        <Box
          className="dashboard-kpi-card"
          style={{ "--kpi-accent": iosColors.primary } as React.CSSProperties}
        >
          <Box className="dashboard-kpi-icon">
            <MaterialSymbol icon="calendar_view_week" size="medium" filled />
          </Box>
          <Box>
            <Typography className="dashboard-kpi-label">
              Suscripciones última semana
            </Typography>
            <Typography className="dashboard-kpi-value">
              {data.ultimaSemana}
            </Typography>
          </Box>
        </Box>

        <Box
          className="dashboard-kpi-card"
          style={{ "--kpi-accent": iosColors.success } as React.CSSProperties}
        >
          <Box className="dashboard-kpi-icon">
            <MaterialSymbol icon="calendar_month" size="medium" filled />
          </Box>
          <Box>
            <Typography className="dashboard-kpi-label">
              Últimos 3 meses
            </Typography>
            <Typography className="dashboard-kpi-value">
              {data.ultimosTresMeses}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Charts */}
      <Box className="dashboard-charts-grid">
        <SubscriptionsByPlanChart data={data.porPlan} />
        <SubscriptionsDonutChart data={data.porPlan} />
      </Box>

      {comisiones && <>
        <div className="dashboard-kpi-grid mt-4">
          <div className="dashboard-kpi-card"><div className="dashboard-kpi-icon"><MaterialSymbol icon="trending_up" size="medium" filled /></div><div><span className="dashboard-kpi-label d-block">Comisiones esta semana</span><strong className="dashboard-kpi-value">{comisiones.comisionesSemana.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</strong></div></div>
          <div className="dashboard-kpi-card"><div className="dashboard-kpi-icon"><MaterialSymbol icon="pending_actions" size="medium" filled /></div><div><span className="dashboard-kpi-label d-block">Pendiente por cobrar</span><strong className="dashboard-kpi-value">{comisiones.pendienteCobro.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}</strong></div></div>
        </div>
        <div className="mt-4"><ComisionesSemanaChart data={comisiones} /></div>
      </>}
    </Box>
  );
};
