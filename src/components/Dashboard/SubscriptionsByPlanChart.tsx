import Chart from "react-apexcharts";
import { Box, Typography } from "@mui/material";
import type { SuscripcionPorPlanDto } from "../../services/dashboard.api";
import { iosColors } from "../../utils/constantes";

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
      iosColors.primary,
      iosColors.success,
      iosColors.warning,
      iosColors.purple,
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
            Suscripciones por plan
          </Typography>
          <Typography fontSize="0.75rem" color="text.disabled" mt={0.2}>
            Distribución actual de planes activos
          </Typography>
        </Box>
        <Typography fontSize="1.4rem">📊</Typography>
      </Box>

      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </Box>
  );
};