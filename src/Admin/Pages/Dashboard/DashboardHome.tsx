import { useEffect } from "react";
import { useDashboardSuscripciones } from "../../../hooks/useDashboardSuscripciones";
import { useComisionesAdmin } from "../../../hooks/useComisionesAdmin";
import { MetricKpiCard } from "../../../components/UI/MetricKpiCard";
import { ComisionesSemanaChart } from "./ComisionesSemanaChart";
import { SubscriptionsDonutChart } from "./SubscriptionsDonutChart";
import { SubscriptionsByPlanChart } from "./SubscriptionsByPlanChart";

export const DashboardHome = () => {
  const { data: suscripcionesData, loading: loadingSuscripciones } =
    useDashboardSuscripciones();
  const {
    dashboard: comisiones,
    loading: loadingComisiones,
    cargarDashboard,
  } = useComisionesAdmin();

  useEffect(() => {
    void cargarDashboard();
  }, [cargarDashboard]);

  const isLoading = loadingSuscripciones || loadingComisiones;

  return (
    <div className="w-100 pb-4">
      {/* Encabezado de bienvenida corporativo y amigable */}
      <div className="mb-4">
        <h1
          className="fz-h2 fw-bold mb-1"
          style={{
            color: "#1C1C1E",
            letterSpacing: "-0.5px",
          }}
        >
          Panel de Administración
        </h1>
        <p
          className="fz-body text-secondary mb-0"
          style={{ color: "#6E6E73" }}
        >
          Resumen general del rendimiento, ingresos y suscripciones de la plataforma.
        </p>
      </div>

      {/* Grid de KPIs con Bootstrap responsive grid */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <MetricKpiCard
            label="Comisiones de la semana"
            value={
              comisiones?.comisionesSemana !== undefined
                ? comisiones.comisionesSemana.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })
                : "$0.00"
            }
            icon="trending_up"
            color="primary"
            subtitle="Cobros procesados esta semana"
            loading={isLoading}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <MetricKpiCard
            label="Pendiente por liquidar"
            value={
              comisiones?.pendienteCobro !== undefined
                ? comisiones.pendienteCobro.toLocaleString("es-MX", {
                    style: "currency",
                    currency: "MXN",
                  })
                : "$0.00"
            }
            icon="pending_actions"
            color="warning"
            subtitle="Comisiones listas para cobro"
            loading={isLoading}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <MetricKpiCard
            label="Suscripciones activas (Semana)"
            value={suscripcionesData?.ultimaSemana ?? 0}
            icon="check_circle"
            color="success"
            subtitle="Nuevas suscripciones registradas"
            loading={isLoading}
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <MetricKpiCard
            label="Suscripciones (Últimos 3 meses)"
            value={suscripcionesData?.ultimosTresMeses ?? 0}
            icon="workspace_premium"
            color="purple"
            subtitle="Volumen consolidado del trimestre"
            loading={isLoading}
          />
        </div>
      </div>

      {/* Gráfica principal de comisiones */}
      {comisiones && (
        <div className="mb-4">
          <ComisionesSemanaChart data={comisiones} />
        </div>
      )}

      {/* Gráficas complementarias de suscripciones por plan */}
      {suscripcionesData?.porPlan && suscripcionesData.porPlan.length > 0 && (
        <div className="row g-4">
          <div className="col-12 col-lg-6">
            <SubscriptionsDonutChart data={suscripcionesData.porPlan} />
          </div>
          <div className="col-12 col-lg-6">
            <SubscriptionsByPlanChart data={suscripcionesData.porPlan} />
          </div>
        </div>
      )}
    </div>
  );
};
