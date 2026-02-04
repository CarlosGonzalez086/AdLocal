import Chart from "react-apexcharts";
import { Box, Typography } from "@mui/material";
import type { SuscripcionPorPlanDto } from "../../services/dashboard.api";
import { iosColors } from "../../utils/constantes";


interface Props {
  data: SuscripcionPorPlanDto[];
}

export const SubscriptionsDonutChart = ({ data }: Props) => {
  const series = data.map((p) => p.total);

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "Inter, system-ui, -apple-system",
    },
    labels: data.map((p) => p.plan),
    colors: [
      iosColors.primary,
      iosColors.success,
      iosColors.warning,
      iosColors.purple,
    ],
    legend: {
      position: "bottom",
      fontSize: "13px",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              fontSize: "14px",
              fontWeight: 600,
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
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
        Distribución de planes
      </Typography>

      <Chart
        options={options}
        series={series}
        type="donut"
        height={320}
      />
    </Box>
  );
};
