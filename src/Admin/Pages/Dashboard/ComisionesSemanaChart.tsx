import type { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import type { ComisionesDashboard } from "../../../types/Admin/comisiones";

export const ComisionesSemanaChart = ({ data }: { data: ComisionesDashboard }) => {
  const options: ApexOptions = { chart: { toolbar: { show: false }, fontFamily: "Inter, sans-serif" }, colors: ["#0f766e"], dataLabels: { enabled: false }, stroke: { curve: "smooth", width: 3 }, xaxis: { categories: data.semana.map((x) => x.dia) }, yaxis: { labels: { formatter: (v) => `$${v.toFixed(0)}` } }, tooltip: { y: { formatter: (v) => v.toLocaleString("es-MX", { style: "currency", currency: "MXN" }) } }, grid: { borderColor: "#e9ecef" } };
  return <div className="dashboard-commission-chart"><div className="p-3"><h2 className="fz-h3 fw-semibold mb-1">Comisiones de la semana</h2><p className="fz-h5 mb-0">Ingresos generados por día.</p></div><Chart type="area" height={310} options={options} series={[{ name: "Comisiones", data: data.semana.map((x) => x.monto) }]} /></div>;
};
