import { Alert, Checkbox, FormControlLabel, TextField } from "@mui/material";
import { useState } from "react";
import { GenericModal } from "../../../../components/GenericModal";
import type { PedidoComercioDetalleDto } from "../../../../types/User/pedidosComercio";

export function CancelacionPedidoModal({
  pedido,
  onClose,
  onSave,
}: {
  pedido: PedidoComercioDetalleDto;
  onClose: () => void;
  onSave: (
    motivo: string,
    productos: { detalleUuid: string; cantidad: number }[],
  ) => Promise<boolean>;
}) {
  const [motivo, setMotivo] = useState("");
  const [cantidades, setCantidades] = useState<Record<string, number>>({});
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const guardar = async () => {
    const productos = Object.entries(cantidades)
      .filter(([, cantidad]) => cantidad > 0)
      .map(([detalleUuid, cantidad]) => ({ detalleUuid, cantidad }));
    if (
      !motivo.trim() ||
      !confirmado ||
      Object.values(cantidades).some((c) => !Number.isInteger(c) || c < 0) ||
      productos.some(
        (d) =>
          !Number.isInteger(d.cantidad) ||
          d.cantidad >
            (pedido.productos.find((p) => p.uuid === d.detalleUuid)
              ?.stockDescontado ?? 0),
      )
    ) {
      setError("Indica un motivo y confirma cantidades válidas.");
      return { noClose: true };
    }
    setLoading(true);
    try {
      return (await onSave(motivo.trim(), productos)) ? {} : { noClose: true };
    } finally {
      setLoading(false);
    }
  };
  return (
    <GenericModal
      open
      onClose={onClose}
      title="Cancelar pedido preparado"
      subtitle={pedido.numeroPedido}
      loading={loading}
      primaryAction={{
        label: "Cancelar y registrar inventario",
        disabled: !confirmado,
        onClick: guardar,
      }}
    >
      <div className="d-flex flex-column gap-3 mt-3">
        <Alert severity="warning">
          El pedido ya pasó a preparación. Sólo se repondrán unidades
          recuperadas y aptas para venta. Deja cero para productos consumidos,
          dañados o no recuperados.
        </Alert>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Motivo de cancelación"
          value={motivo}
          multiline
          rows={2}
          onChange={(e) => setMotivo(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 500 } }}
        />
        {pedido.productos
          .filter((p) => (p.stockDescontado ?? 0) > 0)
          .map((p) => (
            <div key={p.uuid} className="d-flex flex-column gap-2">
              <span className="text-break">{p.nombre}</span>
              <TextField
                fullWidth
                type="number"
                label="Unidades recuperadas"
                value={cantidades[p.uuid] ?? 0}
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
                    "aria-label": `Unidades recuperadas: ${p.nombre}`,
                  },
                }}
              />
            </div>
          ))}
        {pedido.productos.some((p) => p.stockDescontado == null) && (
          <Alert severity="info">
            Concilia el stock histórico antes de registrar reposición de estos
            productos antiguos.
          </Alert>
        )}
        <FormControlLabel
          control={
            <Checkbox
              checked={confirmado}
              onChange={(e) => setConfirmado(e.target.checked)}
            />
          }
          label="Revisé las unidades y su condición. Confirmo esta reposición."
        />
      </div>
    </GenericModal>
  );
}
