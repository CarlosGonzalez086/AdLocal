import { Box, Typography, Paper } from "@mui/material";
import { SubscriptionsByPlanChart } from "../../components/Dashboard/SubscriptionsByPlanChart";
import { SubscriptionsDonutChart } from "../../components/Dashboard/SubscriptionsDonutChart";
import { useDashboardSuscripciones } from "../../hooks/useDashboardSuscripciones";

export const DashboardHome = () => {
  const { data, loading } = useDashboardSuscripciones();

  if (loading || !data) {
    return <Typography>Cargando dashboard…</Typography>;
  }

  return (
    <Box>
      {/* KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography color="text.secondary">
              Suscripciones última semana
            </Typography>
            <Typography fontSize={32} fontWeight={700}>
              {data.ultimaSemana}
            </Typography>
          </Paper>
        </div>

        <div className="col-12 col-md-6">
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <Typography color="text.secondary">
              Últimos 3 meses
            </Typography>
            <Typography fontSize={32} fontWeight={700}>
              {data.ultimosTresMeses}
            </Typography>
          </Paper>
        </div>
      </div>

      {/* Charts */}
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <SubscriptionsByPlanChart data={data.porPlan} />
        </div>

        <div className="col-12 col-lg-5">
          <SubscriptionsDonutChart data={data.porPlan} />
        </div>
      </div>
    </Box>
  );
};
