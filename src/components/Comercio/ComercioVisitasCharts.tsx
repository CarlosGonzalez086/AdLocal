import Chart from "react-apexcharts";
import { Box, Typography } from "@mui/material";

interface Props {
  ultimaSemana: { dia: string; total: number }[];
  ultimosTresMeses: { mes: string; total: number }[];
}

export default function ComercioVisitasCharts({
  ultimaSemana,
  ultimosTresMeses,
}: Props) {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 4,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
      }}
    >
      <Typography fontWeight={700} mb={2}>
        Visitas · Última semana
      </Typography>

      <Box
        sx={{
          width: "100%",
          maxWidth: {
            xs: "100%",
            sm: 520,
            md: 940,
          },
          mx: "auto",
        }}
      >
        <Chart
          type="bar"
          width="100%"
          height={350}
          series={[
            {
              name: "Visitas",
              data: ultimaSemana.map((d) => d.total),
            },
          ]}
          options={{
            chart: {
              toolbar: { show: false },
              zoom: { enabled: false },
            },

            dataLabels: { enabled: false },

            plotOptions: {
              bar: {
                borderRadius: 6,
                columnWidth: "45%",
              },
            },

            xaxis: {
              categories: ultimaSemana.map((d) => d.dia),
              labels: {
                rotate: -45,
                rotateAlways: true,
                hideOverlappingLabels: true,
                trim: false,
                style: {
                  fontSize: "11px",
                  fontWeight: 500,
                },
              },
            },

            grid: {
              strokeDashArray: 4,
              padding: {
                bottom: 20,
              },
            },

            colors: ["#007AFF"],

            tooltip: {
              enabled: true,
              followCursor: true,
              y: {
                formatter: (value: number) => `${value} visitas`,
              },
            },
          }}
        />
      </Box>
      <Typography fontWeight={700} mt={4} mb={2}>
        Visitas · Últimos 3 meses
      </Typography>
      <Box
        sx={{
          width: "100%",
          maxWidth: {
            xs: "100%",
            sm: 520,
            md: 940,
          },
          mx: "auto",
        }}
      >
        <Chart
          type="bar"
          width="100%"
          height={350}
          series={[
            {
              name: "Visitas",
              data: ultimosTresMeses.map((m) => m.total),
            },
          ]}
          options={{
            chart: {
              toolbar: { show: false },
              zoom: { enabled: false },
            },

            plotOptions: {
              bar: {
                borderRadius: 8,
                columnWidth: "45%",
              },
            },

            dataLabels: { enabled: false },

            xaxis: {
              categories: ultimosTresMeses.map((m) => m.mes),
              labels: {
                rotate: -45,
                rotateAlways: true,
                hideOverlappingLabels: true,
                trim: false,
                style: {
                  fontSize: "11px",
                  fontWeight: 500,
                },
              },
            },

            grid: {
              strokeDashArray: 4,
              padding: {
                bottom: 20,
              },
            },

            tooltip: {
              enabled: true,
              followCursor: true,
              y: {
                formatter: (value: number) => `${value} visitas`,
              },
            },

            colors: ["#34C759"],
          }}
        />
      </Box>
    </Box>
  );
}
