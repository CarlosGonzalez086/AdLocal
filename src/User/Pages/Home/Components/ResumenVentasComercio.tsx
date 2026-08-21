import {
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
} from "@mui/material";
import type { ApexOptions } from "apexcharts";
import { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import { pedidosComercioApi } from "../../../../services/pedidosComercioApi";
import type {
  ComercioPedidoSelectorDto,
  PedidoComercioListadoDto,
  PedidosComercioDashboardDto,
} from "../../../../types/User/pedidosComercio";
import {
  colorEstadoPago,
  dateFormatter,
  estadoPagoTexto,
  estadoPedidoTexto,
  moneyFormatter,
} from "../../Pedidos/pedidoComercioPresentation";

export const ResumenVentasComercio = () => {
  const navigate = useNavigate();
  const [comercios, setComercios] = useState<ComercioPedidoSelectorDto[]>([]);
  const [comercioId, setComercioId] = useState(0);
  const [dashboard, setDashboard] =
    useState<PedidosComercioDashboardDto | null>(null);
  const [pedidos, setPedidos] = useState<PedidoComercioListadoDto[]>([]);
  const [loading, setLoading] = useState(true);

  const ventasPorDia = dashboard?.ventasPorDia ?? [];

  useEffect(() => {
    void pedidosComercioApi.comercios().then(({ data }) => {
      const disponibles = data.respuesta ?? [];
      setComercios(disponibles);
      setComercioId(disponibles[0]?.id ?? 0);
      if (disponibles.length === 0) setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!comercioId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    void Promise.all([
      pedidosComercioApi.dashboard(comercioId),
      pedidosComercioApi.listar(comercioId, 1, 5),
    ])
      .then(([resumen, ultimos]) => {
        setDashboard(resumen.data.respuesta);
        setPedidos(ultimos.data.respuesta.items);
      })
      .finally(() => setLoading(false));
  }, [comercioId]);

  const chartOptions = useMemo<ApexOptions>(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    () => ({
      chart: { toolbar: { show: false }, fontFamily: "Inter, sans-serif" },
      colors: ["#6F4E37"],
      dataLabels: { enabled: false },
      grid: { borderColor: "#E7DDD4", strokeDashArray: 4 },
      plotOptions: { bar: { borderRadius: 7, columnWidth: "48%" } },
      xaxis: {
        categories:
          ventasPorDia.length > 0
            ? ventasPorDia.map((venta) => venta.dia)
            : [
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
                "Domingo",
              ],
        labels: { style: { colors: "#8A7A70" } },
      },
      yaxis: {
        labels: { formatter: (value) => moneyFormatter.format(value) },
      },
      tooltip: {
        y: { formatter: (value) => moneyFormatter.format(value) },
      },
    }),
    [dashboard?.ventasPorDia],
  );

  const series = [
    {
      name: "Ventas",
      data:
        ventasPorDia.length > 0
          ? ventasPorDia.map((venta) => venta.total)
          : [0, 0, 0, 0, 0, 0, 0],
    },
  ];

  if (comercios.length === 0 && !loading) return null;

  return (
    <section className="d-flex flex-column gap-4">
      <div className="d-flex justify-content-between align-items-end gap-3 flex-wrap">
        <div>
          <h2 className="fz-h2 fw-bold mb-1">Resumen de ventas</h2>
          <p className="fz-h4 fw-regular mb-0">
            Actividad de pedidos y pagos de la semana actual.
          </p>
        </div>

        {comercios.length > 1 && (
          <FormControl size="small" className="col-12 col-sm-5 col-lg-3">
            <InputLabel>Comercio</InputLabel>
            <Select
              value={comercioId}
              label="Comercio"
              className="fz-h4 fw-regular"
              onChange={(event) => setComercioId(Number(event.target.value))}
            >
              {comercios.map((comercio) => (
                <MenuItem
                  key={comercio.id}
                  value={comercio.id}
                  className="fz-h4 fw-regular"
                >
                  {comercio.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <div className="row g-3">
        {[
          [
            "payments",
            "Ventas esta semana",
            moneyFormatter.format(dashboard?.ventasSemana ?? 0),
          ],
          [
            "today",
            "Ventas de hoy",
            moneyFormatter.format(dashboard?.ventasHoy ?? 0),
          ],
          [
            "pending_actions",
            "Pedidos por aprobar",
            dashboard?.pendientesAprobacion ?? 0,
          ],
          [
            "fact_check",
            "Pagos por verificar",
            dashboard?.comprobantesPendientes ?? 0,
          ],
        ].map(([icon, label, value]) => (
          <div key={String(label)} className="col-12 col-sm-6 col-xl-3">
            <div className="inicioVentaStat h-100 p-3 d-flex align-items-center gap-3">
              <span className="inicioVentaStatIcon d-flex align-items-center justify-content-center flex-shrink-0">
                <MaterialSymbol icon={String(icon)} size="medium" />
              </span>
              <span className="d-flex flex-column">
                <small className="fz-h6 fw-medium">{label}</small>
                <strong className="fz-h3 fw-bold">{value}</strong>
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="inicioVentaPanel h-100 p-3 p-md-4">
            <h3 className="fz-h3 fw-semibold mb-3">Ventas por día</h3>
            {loading ? (
              <Skeleton variant="rounded" height={310} />
            ) : (
              <ReactApexChart
                type="bar"
                height={310}
                options={chartOptions}
                series={series}
              />
            )}
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="inicioVentaPanel h-100 p-3 p-md-4 d-flex flex-column gap-3">
            <div className="d-flex justify-content-between align-items-center gap-2">
              <h3 className="fz-h3 fw-semibold mb-0">Últimos pedidos</h3>
              <Button
                type="button"
                className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm fz-h5 fw-semibold"
                onClick={() => navigate("/usuario/app/pedidos")}
              >
                Ver todos
              </Button>
            </div>

            {loading ? (
              <Skeleton variant="rounded" height={310} />
            ) : pedidos.length === 0 ? (
              <div className="text-center py-5">
                <MaterialSymbol icon="receipt_long" size="large" />
                <p className="fz-h5 fw-regular mt-2 mb-0">
                  Todavía no hay pedidos.
                </p>
              </div>
            ) : (
              pedidos.map((pedido) => (
                <button
                  key={pedido.uuid}
                  type="button"
                  className="inicioPedidoItem p-3 text-start w-100"
                  onClick={() =>
                    navigate(`/usuario/app/pedidos?pedido=${pedido.uuid}`)
                  }
                >
                  <span className="d-flex justify-content-between align-items-start gap-2">
                    <span>
                      <strong className="fz-h5 fw-semibold d-block">
                        {pedido.numeroPedido}
                      </strong>
                      <small className="fz-h6 fw-regular d-block">
                        {pedido.clienteNombre}
                      </small>
                    </span>
                    <strong className="fz-h5 fw-bold">
                      {moneyFormatter.format(pedido.total)}
                    </strong>
                  </span>
                  <span className="d-flex justify-content-between align-items-center gap-2 flex-wrap mt-2">
                    <small className="fz-h6 fw-regular">
                      {dateFormatter.format(new Date(pedido.fechaCreacion))}
                    </small>
                    <span className="d-flex gap-1 flex-wrap">
                      <Chip
                        size="small"
                        label={estadoPedidoTexto[pedido.estado]}
                      />
                      <Chip
                        size="small"
                        color={colorEstadoPago(pedido.estadoPago)}
                        label={estadoPagoTexto[pedido.estadoPago]}
                      />
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
