import Chart from "react-apexcharts";
import { Box, Typography } from "@mui/material";
import type { SuscripcionPorPlanDto } from "../../services/dashboard.api";
import { iosColors } from "../../utils/constantes";

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
    <Box
      sx={{
        p: { xs: 2.5, sm: 3 },
        borderRadius: 4,
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
        transition: "box-shadow 0.25s ease",
        "&:hover": {
          boxShadow: "0 8px 28px rgba(0,0,0,0.11)",
        },
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2.5}>
        <Box>
          <Typography fontWeight={700} fontSize="0.95rem" color="text.primary">
            Distribución de planes
          </Typography>
          <Typography fontSize="0.75rem" color="text.disabled" mt={0.2}>
            Proporción de suscripciones activas
          </Typography>
        </Box>
        <Typography fontSize="1.4rem">🍩</Typography>
      </Box>

      <Chart
        options={options}
        series={series}
        type="donut"
        height={320}
      />
    </Box>
  );
};