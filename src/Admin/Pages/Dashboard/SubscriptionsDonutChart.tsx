import Chart from "react-apexcharts";
import { Box, Typography } from "@mui/material";
import type { SuscripcionPorPlanDto } from "../../../services/dashboard.api";
import { iosColors } from "../../../utils/constantes";

interface Props {
  data: SuscripcionPorPlanDto[];
}

export const SubscriptionsDonutChart = ({ data }: Props) => {
  const series = data.map((p) => p.total);
  const total = series.reduce((a, b) => a + b, 0);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, system-ui, -apple-system",
      background: "transparent",
      animations: {
        enabled: true,
        speed: 600,
      },
    },
    labels: data.map((p) => p.plan),
    colors: [
      iosColors.primary,
      iosColors.success,
      iosColors.warning,
      iosColors.purple,
    ],
    stroke: {
      width: 2,
      colors: ["#fff"],
    },
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontWeight: 600,
      labels: { colors: "#6e6e73" },

      itemMargin: { horizontal: 10, vertical: 4 },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "72%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "13px",
              fontWeight: 600,
              color: "#6e6e73",
              offsetY: -4,
            },
            value: {
              show: true,
              fontSize: "22px",
              fontWeight: 800,
              color: "#1c1c1e",
              offsetY: 6,
            },
            total: {
              show: true,
              label: "Total",
              fontSize: "13px",
              fontWeight: 600,
              color: "#6e6e73",
              formatter: () => String(total),
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      theme: "light",
      style: { fontSize: "13px" },
      y: {
        formatter: (val) => `${val} suscripción${val !== 1 ? "es" : ""}`,
      },
    },
  };

  return (
    <Box className="dashboard-chart-card">
      <Box className="dashboard-chart-header">
        <Box>
          <Typography className="dashboard-chart-title">
            Distribución de planes {/* o "Suscripciones por plan" */}
          </Typography>
          <Typography className="dashboard-chart-subtitle">
            Proporción de suscripciones activas {/* o el otro subtítulo */}
          </Typography>
        </Box>
      </Box>

      <Chart options={options} series={series} type="donut" height={320} />
    </Box>
  );
};
