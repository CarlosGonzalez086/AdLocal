import type { ApexOptions } from "apexcharts";
import { type FC } from "react";
import Chart from "react-apexcharts";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

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
  const total = values.reduce(
    (accumulator, currentValue) => accumulator + currentValue,
    0,
  );

  const hasData = categories.length > 0 && values.length > 0;

  const options = buildChartOptions(categories, color, colorSecondary);

  const series: ApexAxisChartSeries = [
    {
      name: "Visitas",

      data: values,
    },
  ];

  return (
    <div className="commerceVisitsChartSection h-100">
      <div className="d-flex flex-column flex-sm-row align-items-sm-start justify-content-between gap-3 mb-4">
        <div className="d-flex align-items-start gap-3">
          <div className="commerceVisitsChartTitleIcon flex-shrink-0">
            <MaterialSymbol icon={icon} size="medium" />
          </div>

          <div>
            <h3 className="commerceVisitsChartTitle fz-h3 fw-bold mb-1">
              {title}
            </h3>

            <p className="commerceVisitsChartDescription fz-h4 fw-regular mb-0">
              {description}
            </p>
          </div>
        </div>

        <div className="commerceVisitsTotalBadge flex-shrink-0">
          <span className="commerceVisitsTotalLabel fz-h5 fw-medium">
            Total
          </span>

          <strong className="commerceVisitsTotalValue fz-h2 fw-bold">
            {total.toLocaleString("es-MX")}
          </strong>
        </div>
      </div>

      {hasData ? (
        <div className="commerceVisitsChartContainer">
          <Chart
            type="bar"
            width="100%"
            height={330}
            series={series}
            options={options}
          />
        </div>
      ) : (
        <div className="commerceVisitsEmptyState">
          <div className="commerceVisitsEmptyIcon">
            <MaterialSymbol icon="query_stats" size="large" />
          </div>

          <h4 className="commerceVisitsEmptyTitle fz-h3 fw-bold mb-2">
            Sin visitas registradas
          </h4>

          <p className="commerceVisitsEmptyDescription fz-h4 fw-regular mb-0">
            Todavía no hay información disponible para este periodo.
          </p>
        </div>
      )}
    </div>
  );
};

export default function ComercioVisitasCharts({
  ultimaSemana,
  ultimosTresMeses,
}: Props) {
  /* ============================================
     WEEKLY
  ============================================ */

  const weeklyData: VisitData[] = (ultimaSemana ?? []).map((item) => ({
    dia: item.dia?.trim() || "Sin fecha",

    total: normalizeValue(item.total),
  }));

  const weeklyCategories = weeklyData.map((item) => item.dia ?? "");

  const weeklyValues = weeklyData.map((item) => item.total);

  const monthlyData: VisitData[] = (ultimosTresMeses ?? []).map((item) => ({
    mes: item.mes?.trim() || "Sin mes",

    total: normalizeValue(item.total),
  }));

  const monthlyCategories = monthlyData.map((item) => item.mes ?? "");

  const monthlyValues = monthlyData.map((item) => item.total);

  return (
    <div
      className="commerceVisitsContainer"
      aria-label="Estadísticas de visitas del comercio"
    >
      <div className="d-flex align-items-start gap-3 mb-4">
        <div className="commerceVisitsHeaderIcon flex-shrink-0">
          <MaterialSymbol icon="monitoring" size="medium" filled />
        </div>

        <div>
          <h2 className="commerceVisitsHeaderTitle fz-h2 fw-bold mb-1">
            Rendimiento de visitas
          </h2>

          <p className="commerceVisitsHeaderDescription fz-h4 fw-regular mb-0">
            Consulta la actividad reciente de tu comercio y compara su alcance.
          </p>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-6">
          <ChartSection
            title="Última semana"
            description="Visitas recibidas durante los últimos siete días."
            icon="date_range"
            categories={weeklyCategories}
            values={weeklyValues}
            color="#007AFF"
            colorSecondary="#5AC8FA"
          />
        </div>

        <div className="col-12 col-xl-6">
          <ChartSection
            title="Últimos tres meses"
            description="Evolución mensual de las visitas al comercio."
            icon="calendar_month"
            categories={monthlyCategories}
            values={monthlyValues}
            color="#34C759"
            colorSecondary="#30D158"
          />
        </div>
      </div>
    </div>
  );
}
