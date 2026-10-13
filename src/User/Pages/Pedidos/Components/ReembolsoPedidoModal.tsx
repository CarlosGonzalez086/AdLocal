import {
  Alert,
  Checkbox,
  FormControlLabel,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";
import { GenericModal } from "../../../../components/GenericModal";
import type {
  PedidoComercioDetalleDto,
  RegistrarReembolsoPedidoDto,
} from "../../../../types/User/pedidosComercio";
import {
  claveReembolso,
  leerReembolsoPendiente,
  prepararReembolso,
  validarReembolso,
} from "../../../../utils/reembolsoOperacion";
import { extraerMensajeError } from "../../../../utils/errorHandler";
import Swal from "../../../../utils/sweetalert";
import { moneyFormatter } from "../pedidoComercioPresentation";

export function ReembolsoPedidoModal({
  pedido,
  cuenta,
  comercioId,
  onClose,
  onSave,
}: {
  pedido: PedidoComercioDetalleDto;
  cuenta: string;
  comercioId: number;
  onClose: () => void;
  onSave: (
    dto: RegistrarReembolsoPedidoDto,
  ) => Promise<PedidoComercioDetalleDto>;
}) {
  const clave = claveReembolso(cuenta, comercioId, pedido.uuid);
  const [inicio] = useState(() => {
    try {
      return { dto: leerReembolsoPendiente(localStorage, clave), error: "" };
    } catch {
      return {
        dto: null,
        error:
          "No se pudo leer la solicitud guardada. Actualiza y revisa el pedido antes de registrar un reembolso.",
      };
    }
  });
  const [pendiente, setPendiente] = useState(inicio.dto);
  const [metodo, setMetodo] = useState<1 | 2>(
    inicio.dto?.metodo ?? pedido.metodoPago,
  );
  const [referencia, setReferencia] = useState(inicio.dto?.referencia ?? "");
  const [motivo, setMotivo] = useState(inicio.dto?.motivo ?? "");
  const [cantidades, setCantidades] = useState<Record<string, number>>(() =>
    Object.fromEntries(
      inicio.dto?.productosDevueltos.map((d) => [d.detalleUuid, d.cantidad]) ??
        [],
    ),
  );
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(inicio.error);
  const entregado =
    [4, 5, 6, 7, 8, 9].includes(pedido.estado) ||
    pedido.restituirReserva === false;
  const guardar = async () => {
    if (!confirmado || loading || !cuenta || inicio.error)
      return { noClose: true };
    if (
      !pendiente &&
      Object.entries(cantidades).some(
        ([uuid, cantidad]) =>
          !Number.isInteger(cantidad) ||
          cantidad < 0 ||
          cantidad >
            (pedido.productos.find((p) => p.uuid === uuid)?.stockDescontado ??
              0),
      )
    ) {
      setError(
        "Las unidades devueltas deben ser enteras, desde cero hasta el stock original.",
      );
      return { noClose: true };
    }
    const nuevo: RegistrarReembolsoPedidoDto = {
      versionPedido: pedido.version,
      idempotencyKey: crypto.randomUUID(),
      monto: pedido.total,
      metodo,
      referencia: referencia.trim(),
      motivo: motivo.trim(),
      productosDevueltos: Object.entries(cantidades)
        .filter(([, cantidad]) => cantidad > 0)
        .map(([detalleUuid, cantidad]) => ({ detalleUuid, cantidad })),
    };
    const validacion = pendiente ? null : validarReembolso(pedido, nuevo);
    if (validacion) {
      setError(validacion);
      return { noClose: true };
    }
    setLoading(true);
    setError("");
    try {
      const dto = prepararReembolso(localStorage, clave, nuevo);
      setPendiente(dto);
      await onSave(dto);
      localStorage.removeItem(clave);
      return {};
    } catch (e) {
      setError(
        extraerMensajeError(
          e,
          "No se confirmó el registro. Revisa el pedido y conserva esta solicitud para reintentar. No devuelvas el dinero otra vez.",
        ),
      );
      return { noClose: true };
    } finally {
      setLoading(false);
    }
  };
  const descartar = async () => {
    const resultado = await Swal.fire({
      title: "Descartar solicitud guardada",
      text: "Primero revisa el detalle actualizado y la referencia del reembolso. Descartar esta solicitud sólo borra el intento local; no revierte un reembolso ni mueve dinero.",
      showCancelButton: true,
      confirmButtonText: "Ya revisé el pedido",
      cancelButtonText: "Conservar",
    });
    if (resultado.isConfirmed) {
      localStorage.removeItem(clave);
      onClose();
    }
  };
  return (
    <GenericModal
      open
      onClose={onClose}
      title="Registrar reembolso realizado"
      subtitle={pedido.numeroPedido}
      loading={loading}
      primaryAction={{
        label: pendiente
          ? "Reintentar el mismo registro"
          : "Registrar devolución",
        onClick: guardar,
        disabled: !confirmado || !cuenta || Boolean(inicio.error),
      }}
    >
      <div className="d-flex flex-column gap-3 mt-3">
        <Alert severity="warning">
          Registra la devolución de {moneyFormatter.format(pedido.total)}{" "}
          después de haberla realizado. Este formulario no transfiere dinero. El
          reembolso es total, incluido el envío.
        </Alert>
        {pendiente && (
          <Alert severity="info">
            Hay una solicitud guardada. Se reenviará con la misma clave y los
            mismos datos. No hagas otra devolución de dinero.
          </Alert>
        )}
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          select
          label="Método de devolución"
          value={metodo}
          disabled={Boolean(pendiente) || loading}
          onChange={(e) => setMetodo(Number(e.target.value) as 1 | 2)}
        >
          <MenuItem value={1}>Efectivo</MenuItem>
          <MenuItem value={2}>Transferencia</MenuItem>
        </TextField>
        <TextField
          label="Referencia de transferencia o recibo de efectivo"
          value={referencia}
          disabled={Boolean(pendiente) || loading}
          onChange={(e) => setReferencia(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 150 } }}
        />
        <TextField
          label="Motivo"
          multiline
          rows={2}
          value={motivo}
          disabled={Boolean(pendiente) || loading}
          onChange={(e) => setMotivo(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 500 } }}
        />
        {entregado ? (
          <>
            <Alert severity="info">
              Sólo repón unidades recibidas y aptas para vender. Deja cero si no
              se devolvieron productos. El dinero se devuelve aunque no haya
              reposición.
            </Alert>
            {pedido.productos
              .filter((p) => (p.stockDescontado ?? 0) > 0)
              .map((p) => (
                <div key={p.uuid} className="d-flex flex-column gap-2">
                  <span className="text-break">{p.nombre}</span>
                  <TextField
                    fullWidth
                    type="number"
                    label="Unidades recibidas"
                    value={cantidades[p.uuid] ?? 0}
                    disabled={Boolean(pendiente) || loading}
                    onChange={(e) =>
                      setCantidades((c) => ({
                        ...c,
                        [p.uuid]: Number(e.target.value),
                      }))
                    }
                    slotProps={{
                      htmlInput: {
                        min: 0,
                        max: p.stockDescontado,
                        step: 1,
                        "aria-label": `Unidades recibidas: ${p.nombre}`,
                      },
                    }}
                  />
                </div>
              ))}
            {pedido.productos.some((p) => p.stockDescontado == null) && (
              <Alert severity="warning">
                Este pedido antiguo requiere conciliar el stock original antes
                de registrar unidades devueltas. Puedes reembolsar sin reponer
                inventario.
              </Alert>
            )}
          </>
        ) : (
          <Alert severity="info">
            El pedido quedará cancelado. Se liberará el stock reservado antes de
            preparar; cualquier conciliación pendiente aparecerá en el detalle.
          </Alert>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmado}
              disabled={loading}
              onChange={(e) => setConfirmado(e.target.checked)}
            />
          }
          label="Confirmo que el cliente ya recibió el total y que la referencia es correcta."
        />
        {(pendiente || inicio.error) && (
          <Button disabled={loading} onClick={() => void descartar()}>
            Revisar y descartar intento local
          </Button>
        )}
      </div>
    </GenericModal>
  );
}
