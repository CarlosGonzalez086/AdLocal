import Chart from "react-apexcharts";
import type { SuscripcionPorPlanDto } from "../../../services/dashboard.api";
import { adlocalColors } from "../../../utils/constantes";

interface Props {
  data: SuscripcionPorPlanDto[];
}

export const SubscriptionsByPlanChart = ({ data }: Props) => {
  const series = [
    {
      name: "Suscripciones",
      data: data.map((p) => p.total),
    },
  ];

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "Inter, system-ui, -apple-system",
      background: "transparent",
      animations: {
        enabled: true,
        speed: 600,
      },
    },
    colors: [
      adlocalColors.primary,
      adlocalColors.success,
      adlocalColors.warning,
      adlocalColors.purple,
    ],
    plotOptions: {
      bar: {
        borderRadius: 10,
        borderRadiusApplication: "end",
        columnWidth: "42%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: 700,
        colors: ["#fff"],
      },
      background: {
        enabled: false,
      },
    },
    xaxis: {
      categories: data.map((p) => p.plan),
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 600,
          colors: "#6e6e73",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "11px",
          colors: "#6e6e73",
        },
      },
    },
    grid: {
      borderColor: "rgba(0,0,0,0.06)",
      strokeDashArray: 5,
      xaxis: { lines: { show: false } },
    },
    legend: { show: false },
    tooltip: {
      theme: "light",
      style: { fontSize: "13px" },
      y: {
        formatter: (val) => `${val} suscripción${val !== 1 ? "es" : ""}`,
      },
    },
  };

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-header">
        <div>
          <h3 className="dashboard-chart-title">
            Distribución de planes
          </h3>
          <p className="dashboard-chart-subtitle">
            Proporción de suscripciones activas
          </p>
        </div>
      </div>

      <Chart options={options} series={series} type="bar" height={320} />
    </div>
  );
};
