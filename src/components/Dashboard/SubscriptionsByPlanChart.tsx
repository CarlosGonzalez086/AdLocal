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
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data.map((p) => p.plan),
      labels: {
        style: {
          fontSize: "13px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
    grid: {
      borderColor: "#E5E5EA",
      strokeDashArray: 4,
    },
    tooltip: {
      theme: "light",
    },
  };

  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        bgcolor: "#fff",
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Typography fontWeight={600} mb={2}>
        Suscripciones por plan
      </Typography>

      <Chart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </Box>
  );
};
