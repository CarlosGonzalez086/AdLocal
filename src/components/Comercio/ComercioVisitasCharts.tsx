import { Box, Typography } from "@mui/material";
import type { ApexOptions } from "apexcharts";
import { useMemo, type FC } from "react";
import Chart from "react-apexcharts";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles/ComercioVisitasCharts.module.css";

interface VisitData {
  dia?: string;
  mes?: string;
  total: number;
}

interface Props {
  ultimaSemana: {
    dia: string;
    total: number;
  }[];

  ultimosTresMeses: {
    mes: string;
    total: number;
  }[];
}

interface ChartSectionProps {
  title: string;
  description: string;
  icon: string;
  categories: string[];
  values: number[];
  color: string;
  colorSecondary: string;
}

const normalizeValue = (value: unknown): number => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
};

const formatVisitLabel = (value: number): string => {
  return `${value} ${value === 1 ? "visita" : "visitas"}`;
};

const buildChartOptions = (
  categories: string[],
  color: string,
  colorSecondary: string,
): ApexOptions => ({
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    foreColor: "#74777f",
    animations: {
      enabled: true,
      speed: 500,
      animateGradually: {
        enabled: true,
        delay: 80,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },

  colors: [color],

  dataLabels: {
    enabled: false,
  },

  plotOptions: {
    bar: {
      borderRadius: 7,
      borderRadiusApplication: "end",
      columnWidth: "48%",
      distributed: false,
    },
  },

  fill: {
    type: "gradient",
    gradient: {
      type: "vertical",
      shadeIntensity: 0.15,
      gradientToColors: [colorSecondary],
      inverseColors: false,
      opacityFrom: 1,
      opacityTo: 0.82,
      stops: [0, 100],
    },
  },

  stroke: {
    show: false,
  },

  xaxis: {
    categories,
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    labels: {
      rotate: -35,
      rotateAlways: categories.length > 5,
      hideOverlappingLabels: true,
      trim: false,
      style: {
        colors: "#7b7e86",
        fontSize: "11px",
        fontWeight: 550,
      },
    },
    tooltip: {
      enabled: false,
    },
  },

  yaxis: {
    min: 0,
    forceNiceScale: true,
    decimalsInFloat: 0,
    labels: {
      formatter: (value: number) => Math.round(value).toString(),
      style: {
        colors: "#9a9da4",
        fontSize: "11px",
        fontWeight: 500,
      },
    },
  },

  grid: {
    show: true,
    borderColor: "rgba(15, 23, 42, 0.08)",
    strokeDashArray: 4,
    padding: {
      top: 4,
      right: 8,
      bottom: 12,
      left: 4,
    },
  },

  tooltip: {
    enabled: true,
    followCursor: true,
    theme: "light",
    y: {
      formatter: formatVisitLabel,
      title: {
        formatter: () => "",
      },
    },
  },

  states: {
    hover: {
      filter: {
        type: "lighten",
      },
    },
    active: {
      filter: {
        type: "none",
      },
    },
  },

  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: {
          height: 290,
        },
        plotOptions: {
          bar: {
            columnWidth: "58%",
            borderRadius: 5,
          },
        },
        xaxis: {
          labels: {
            rotate: -45,
            fontSize: "10px",
          },
        },
        grid: {
          padding: {
            right: 2,
            left: 0,
            bottom: 16,
          },
        },
      },
    },
  ],
});

const ChartSection: FC<ChartSectionProps> = ({
  title,
  description,
  icon,
  categories,
  values,
  color,
  colorSecondary,
}) => {
  const total = useMemo(
    () =>
      values.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        0,
      ),
    [values],
  );

  const hasData = categories.length > 0 && values.length > 0;

  const options = useMemo(
    () => buildChartOptions(categories, color, colorSecondary),
    [categories, color, colorSecondary],
  );

  const series = useMemo<ApexAxisChartSeries>(
    () => [
      {
        name: "Visitas",
        data: values,
      },
    ],
    [values],
  );

  return (
    <Box component="section" className={styles.chartSection}>
      <Box className={styles.sectionHeader}>
        <Box className={styles.titleContainer}>
          <Box className={styles.titleIcon}>
            <MaterialSymbol icon={icon} size="medium" />
          </Box>

          <Box className={styles.titleText}>
            <Typography component="h3" className={styles.title}>
              {title}
            </Typography>

            <Typography component="p" className={styles.description}>
              {description}
            </Typography>
          </Box>
        </Box>

        <Box className={styles.totalBadge}>
          <Typography component="span" className={styles.totalLabel}>
            Total
          </Typography>

          <Typography component="strong" className={styles.totalValue}>
            {total.toLocaleString("es-MX")}
          </Typography>
        </Box>
      </Box>

      {hasData ? (
        <Box className={styles.chartContainer}>
          <Chart
            type="bar"
            width="100%"
            height={330}
            series={series}
            options={options}
          />
        </Box>
      ) : (
        <Box className={styles.emptyState}>
          <Box className={styles.emptyIcon}>
            <MaterialSymbol icon="query_stats" size="large" />
          </Box>

          <Typography component="h4" className={styles.emptyTitle}>
            Sin visitas registradas
          </Typography>

          <Typography component="p" className={styles.emptyDescription}>
            Todavía no hay información disponible para este periodo.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default function ComercioVisitasCharts({
  ultimaSemana,
  ultimosTresMeses,
}: Props) {
  const weeklyData = useMemo<VisitData[]>(
    () =>
      (ultimaSemana ?? []).map((item) => ({
        dia: item.dia?.trim() || "Sin fecha",

        total: normalizeValue(item.total),
      })),
    [ultimaSemana],
  );

  const monthlyData = useMemo<VisitData[]>(
    () =>
      (ultimosTresMeses ?? []).map((item) => ({
        mes: item.mes?.trim() || "Sin mes",

        total: normalizeValue(item.total),
      })),
    [ultimosTresMeses],
  );

  const weeklyCategories = useMemo(
    () => weeklyData.map((item) => item.dia ?? ""),
    [weeklyData],
  );

  const weeklyValues = useMemo(
    () => weeklyData.map((item) => item.total),
    [weeklyData],
  );

  const monthlyCategories = useMemo(
    () => monthlyData.map((item) => item.mes ?? ""),
    [monthlyData],
  );

  const monthlyValues = useMemo(
    () => monthlyData.map((item) => item.total),
    [monthlyData],
  );

  return (
    <Box
      component="section"
      className={styles.container}
      aria-label="Estadísticas de visitas del comercio"
    >
      <Box className={styles.header}>
        <Box className={styles.headerIcon}>
          <MaterialSymbol icon="monitoring" size="medium" filled />
        </Box>

        <Box>
          <Typography component="h2" className={styles.headerTitle}>
            Rendimiento de visitas
          </Typography>

          <Typography component="p" className={styles.headerDescription}>
            Consulta la actividad reciente de tu comercio y compara su alcance.
          </Typography>
        </Box>
      </Box>

      <Box className={styles.chartsGrid}>
        <ChartSection
          title="Última semana"
          description="Visitas recibidas durante los últimos siete días."
          icon="date_range"
          categories={weeklyCategories}
          values={weeklyValues}
          color="#007AFF"
          colorSecondary="#5AC8FA"
        />

        <ChartSection
          title="Últimos tres meses"
          description="Evolución mensual de las visitas al comercio."
          icon="calendar_month"
          categories={monthlyCategories}
          values={monthlyValues}
          color="#34C759"
          colorSecondary="#30D158"
        />
      </Box>
    </Box>
  );
}
