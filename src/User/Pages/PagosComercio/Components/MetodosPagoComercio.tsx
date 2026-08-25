import { Button, FormControlLabel, Switch, TextField } from "@mui/material";

import { useEffect, useState } from "react";
import type { ConfiguracionPagoComercioDto } from "../../../../types/User/pagosComercio";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

interface Props {
  configuracion: ConfiguracionPagoComercioDto | null;

  loading: boolean;

  onGuardar: (dto: ConfiguracionPagoComercioDto) => Promise<boolean>;
}

const initialForm: ConfiguracionPagoComercioDto = {
  aceptaEfectivo: true,
  aceptaTransferencia: false,

  instruccionesTransferencia: "",
  costoEnvio: 0,
  compraMinimaEnvioGratis: null,

  activo: true,
};

export const MetodosPagoComercio = ({
  configuracion,
  loading,
  onGuardar,
}: Props) => {
  const [form, setForm] = useState<ConfiguracionPagoComercioDto>(initialForm);

  useEffect(() => {
    if (!configuracion) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialForm);

      return;
    }

    setForm({
      ...configuracion,

      instruccionesTransferencia:
        configuracion.instruccionesTransferencia ?? "",
    });
  }, [configuracion]);

  const guardar = async () => {
    await onGuardar({
      ...form,

      instruccionesTransferencia:
        form.instruccionesTransferencia?.trim() || null,
    });
  };

  return (
    <div className="pagoComercioCard">
      <div className="p-3 p-md-4">
        <div className="d-flex align-items-center gap-3 mb-4">
          <div className="pagoComercioHeaderIcon d-flex align-items-center justify-content-center flex-shrink-0">
            <MaterialSymbol icon="payments" size="medium" filled />
          </div>

          <div>
            <h2 className="fz-h3 fw-bold mb-1">Métodos de pago</h2>

            <p className="pagoComercioDescription fz-h5 fw-regular mb-0">
              Selecciona las formas de pago que aceptarás en tus pedidos.
            </p>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div
              className={`pagoComercioMethod h-100 p-3 ${
                form.aceptaEfectivo ? "pagoComercioMethodActive" : ""
              }`}
            >
              <div className="d-flex align-items-center gap-3 h-100">
                <div className="pagoComercioMethodIcon d-flex align-items-center justify-content-center flex-shrink-0">
                  <MaterialSymbol icon="payments" size="medium" />
                </div>

                <div className="flex-grow-1">
                  <strong className="fz-h4 fw-semibold d-block">
                    Efectivo
                  </strong>

                  <span className="pagoComercioMethodDescription fz-h5 fw-regular d-block mt-1">
                    El cliente paga al recoger o recibir su pedido.
                  </span>
                </div>

                <Switch
                  checked={form.aceptaEfectivo}
                  disabled={loading}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,

                      aceptaEfectivo: event.target.checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div
              className={`pagoComercioMethod h-100 p-3 ${
                form.aceptaTransferencia ? "pagoComercioMethodActive" : ""
              }`}
            >
              <div className="d-flex align-items-center gap-3 h-100">
                <div className="pagoComercioMethodIcon d-flex align-items-center justify-content-center flex-shrink-0">
                  <MaterialSymbol icon="account_balance" size="medium" />
                </div>

                <div className="flex-grow-1">
                  <strong className="fz-h4 fw-semibold d-block">
                    Transferencia
                  </strong>

                  <span className="pagoComercioMethodDescription fz-h5 fw-regular d-block mt-1">
                    El cliente realiza una transferencia bancaria.
                  </span>
                </div>

                <Switch
                  checked={form.aceptaTransferencia}
                  disabled={loading}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,

                      aceptaTransferencia: event.target.checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {form.aceptaTransferencia && (
            <div className="col-12">
              <TextField
                label="Instrucciones para transferencia"
                placeholder="Ej. Envía tu comprobante después de realizar la transferencia."
                value={form.instruccionesTransferencia ?? ""}
                multiline
                minRows={3}
                fullWidth
                disabled={loading}
                slotProps={{
                  htmlInput: {
                    maxLength: 300,
                  },
                }}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,

                    instruccionesTransferencia: event.target.value,
                  }))
                }
              />
            </div>
          )}

          <div className="col-12">
            <div className="pagoComercioOptions p-3">
              <div className="mb-3">
                <h3 className="fz-h4 fw-semibold mb-1">Tarifa de entrega a domicilio</h3>
                <p className="pagoComercioDescription fz-h5 fw-regular mb-0">Define el costo que cobrarás por cada envío. Este monto se mostrará separado del subtotal y quedará guardado en el pedido.</p>
              </div>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <TextField label="Costo de envío" type="number" value={form.costoEnvio} fullWidth disabled={loading} slotProps={{htmlInput:{min:0,step:"0.01"}}} onChange={event=>setForm(current=>({...current,costoEnvio:Math.max(0,Number(event.target.value)||0)}))}/>
                </div>
                <div className="col-12 col-md-6">
                  <TextField label="Envío gratis desde (opcional)" type="number" value={form.compraMinimaEnvioGratis??""} fullWidth disabled={loading} slotProps={{htmlInput:{min:0,step:"0.01"}}} onChange={event=>setForm(current=>({...current,compraMinimaEnvioGratis:event.target.value===""?null:Math.max(0,Number(event.target.value)||0)}))}/>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12">
            <div className="pagoComercioOptions p-3">
              <FormControlLabel
                className="m-0"
                control={
                  <Switch
                    checked={form.activo}
                    disabled={loading}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        activo: event.target.checked,
                      }))
                    }
                  />
                }
                label="Configuración de pagos activa"
              />
            </div>
          </div>

          <div className="col-12">
            <div className="d-flex justify-content-end">
              <Button
                type="button"
                disabled={
                  loading || (!form.aceptaEfectivo && !form.aceptaTransferencia)
                }
                className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
                onClick={guardar}
              >
                <MaterialSymbol icon="save" size="small" />

                <span className="ms-2">Guardar configuración</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
