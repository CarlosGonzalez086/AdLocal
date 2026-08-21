import {
  Alert,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { pagoComisionesApi } from "../../../services/pagoComisionesApi";
import type { ComercioPedidoSelectorDto } from "../../../types/User/pedidosComercio";
import type {
  CuentaAdLocal,
  EstadoComisionesComercio,
} from "../../../types/User/pagoComisiones";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

const moneda = (v: number) =>
  v.toLocaleString("es-MX", { style: "currency", currency: "MXN" });
export const ComisionesComercioPage = () => {
  const [comercios, setComercios] = useState<ComercioPedidoSelectorDto[]>([]);
  const [comercioId, setComercioId] = useState(0);
  const [cuenta, setCuenta] = useState<CuentaAdLocal | null>(null);
  const [estado, setEstado] = useState<EstadoComisionesComercio | null>(null);
  const [periodo, setPeriodo] = useState("semana");
  const [metodo, setMetodo] = useState("transferencia");
  const [archivo, setArchivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const cargarEstado = async (id: number) => {
    const { data } = await pagoComisionesApi.estado(id);
    setEstado(data.respuesta ?? null);
  };
  useEffect(() => {
    void (async () => {
      try {
        const [c, b] = await Promise.all([
          pagoComisionesApi.comercios(),
          pagoComisionesApi.cuenta(),
        ]);
        const lista = c.data.respuesta ?? [];
        setComercios(lista);
        setCuenta(b.data.respuesta ?? null);
        if (lista[0]) {
          setComercioId(lista[0].id);
          await cargarEstado(lista[0].id);
        }
      } catch (e: any) {
        setError(
          e?.response?.data?.mensaje || "No fue posible cargar las comisiones.",
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const seleccionar = (f?: File) => {
    setError(null);
    if (!f) return;
    if (
      !["image/jpeg", "image/png", "application/pdf"].includes(f.type) ||
      f.size > 10 * 1024 * 1024
    ) {
      setError("El comprobante debe ser JPG, PNG o PDF y no superar 10 MB.");
      setArchivo(null);
      return;
    }
    setArchivo(f);
  };
  const enviar = async () => {
    if (!archivo || !cuenta || !comercioId) return;
    setEnviando(true);
    setError(null);
    setMensaje(null);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () =>
          typeof r.result === "string" ? resolve(r.result) : reject();
        r.onerror = reject;
        r.readAsDataURL(archivo);
      });
      const { data } = await pagoComisionesApi.pagar({
        comercioId,
        cuentaBancariaUuid: cuenta.uuid,
        periodo,
        metodoPago: metodo,
        comprobanteBase64: base64,
      });
      setMensaje(data.mensaje);
      setArchivo(null);
      if (input.current) input.current.value = "";
      await cargarEstado(comercioId);
    } catch (e: any) {
      setError(e?.response?.data?.mensaje || "No fue posible enviar el pago.");
    } finally {
      setEnviando(false);
    }
  };
  const pendiente =
    periodo === "mes"
      ? (estado?.pendienteMes ?? 0)
      : (estado?.pendienteSemana ?? 0);
  if (loading)
    return (
      <div className="d-flex justify-content-center py-5">
        <CircularProgress />
      </div>
    );
  return (
    <div>
      <div className="filters-paper">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h1 className="fz-h2 fw-semibold mb-1">Comisiones ADLocal</h1>
            <p className="fz-h4 mb-0">
              Consulta tu saldo y envía el comprobante de pago.
            </p>
          </div>
          <FormControl size="small" className="commission-filter-select">
            <InputLabel>Comercio</InputLabel>
            <Select
              value={comercioId || ""}
              label="Comercio"
              onChange={(e) => {
                const id = Number(e.target.value);
                setComercioId(id);
                void cargarEstado(id);
              }}
            >
              {comercios.map((c) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      {error && (
        <Alert severity="error" className="mt-3">
          {error}
        </Alert>
      )}
      {mensaje && (
        <Alert severity="success" className="mt-3">
          {mensaje}
        </Alert>
      )}
      {estado?.pagoEnRevision && (
        <Alert severity="info" className="mt-3">
          Tu pago de {moneda(estado.pagoEnRevision.monto)} está pendiente de
          verificación.
        </Alert>
      )}
      <div className="row g-4 mt-1">
        <div className="col-12 col-lg-5">
          <div className="commission-payment-card h-100 p-4">
            <h2 className="fz-h3 fw-semibold">Saldo a pagar</h2>
            <div className="d-flex gap-2 mt-3">
              <Button
                className={
                  periodo === "semana"
                    ? "btn-adlocal btn-adlocal--solid"
                    : "btn-adlocal btn-adlocal--ghost"
                }
                onClick={() => setPeriodo("semana")}
              >
                Semana
              </Button>
              <Button
                className={
                  periodo === "mes"
                    ? "btn-adlocal btn-adlocal--solid"
                    : "btn-adlocal btn-adlocal--ghost"
                }
                onClick={() => setPeriodo("mes")}
              >
                Mes
              </Button>
            </div>
            <strong className="commission-payment-total d-block mt-4">
              {moneda(pendiente)}
            </strong>
            <span className="fz-h5 d-block mt-2">
              Incluye únicamente comisiones pendientes que todavía no están en
              revisión.
            </span>
          </div>
        </div>
        <div className="col-12 col-lg-7">
          <div className="commission-payment-card p-4">
            <h2 className="fz-h3 fw-semibold">Depositar o transferir a</h2>
            {cuenta ? (
              <div className="commission-bank-data mt-3 gap-2 p-3">
                <strong className="d-block">{cuenta.banco}</strong>
                <span className="d-block">
                  Beneficiario: {cuenta.beneficiario}
                </span>
                {cuenta.clabe && (
                  <span className="d-block">CLABE: {cuenta.clabe}</span>
                )}
                {cuenta.numeroCuenta && (
                  <span className="d-block">Cuenta: {cuenta.numeroCuenta}</span>
                )}
                {cuenta.numeroTarjeta && (
                  <span className="d-block">
                    Tarjeta: {cuenta.numeroTarjeta}
                  </span>
                )}
                {cuenta.instrucciones && (
                  <span className="d-block mt-2">{cuenta.instrucciones}</span>
                )}
              </div>
            ) : (
              <Alert severity="warning">
                ADLocal no ha configurado una cuenta bancaria.
              </Alert>
            )}
            <FormControl fullWidth className="mt-3">
              <InputLabel>Método</InputLabel>
              <Select
                value={metodo}
                label="Método"
                onChange={(e) => setMetodo(e.target.value)}
              >
                <MenuItem value="transferencia">Transferencia</MenuItem>
                <MenuItem value="deposito">Depósito</MenuItem>
              </Select>
            </FormControl>
            <input
              ref={input}
              className="form-control mt-3"
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={(e) => seleccionar(e.target.files?.[0])}
            />
            <Button
              fullWidth
              className="btn-adlocal btn-adlocal--solid mt-3"
              disabled={
                !archivo ||
                !cuenta ||
                pendiente <= 0 ||
                enviando ||
                Boolean(estado?.pagoEnRevision)
              }
              onClick={() => void enviar()}
            >
              {enviando ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                <MaterialSymbol icon="upload_file" size="small" />
              )}
              <span className="ms-2">Enviar comprobante</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
