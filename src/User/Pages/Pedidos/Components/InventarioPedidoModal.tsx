import { Alert, MenuItem, TextField } from "@mui/material";
import { useState } from "react";
import { GenericModal } from "../../../../components/GenericModal";
import type { PedidoComercioDetalleDto } from "../../../../types/User/pedidosComercio";

export function InventarioPedidoModal({
  pedido,
  onClose,
  onSave,
}: {
  pedido: PedidoComercioDetalleDto;
  onClose: () => void;
  onSave: (
    referencia: string,
    stock: { detalleUuid: string; cantidad: number }[],
    restituirReserva?: boolean,
  ) => Promise<boolean>;
}) {
  const antiguos = pedido.productos.filter((p) => p.stockDescontado == null);
  const [datos, setDatos] = useState<Record<string, number>>({});
  const [referencia, setReferencia] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [politica, setPolitica] = useState<"" | "si" | "no">("");
  const requierePolitica =
    [3, 10].includes(pedido.estado) && pedido.restituirReserva == null;
  const guardar = async () => {
    if (
      !referencia.trim() ||
      antiguos.some((p) => datos[p.uuid] === undefined) ||
      (requierePolitica && !politica)
    ) {
      setError(
        "Indica la evidencia y el stock originalmente descontado de cada producto antiguo.",
      );
      return { noClose: true };
    }
    setLoading(true);
    try {
      return (await onSave(
        referencia.trim(),
        antiguos.map((p) => ({ detalleUuid: p.uuid, cantidad: datos[p.uuid] })),
        requierePolitica ? politica === "si" : undefined,
      ))
        ? {}
        : { noClose: true };
    } finally {
      setLoading(false);
    }
  };
  return (
    <GenericModal
      open
      onClose={onClose}
      title="Conciliar inventario del pedido"
      subtitle={pedido.numeroPedido}
      loading={loading}
      primaryAction={{ label: "Guardar conciliación", onClick: guardar }}
    >
      <div className="d-flex flex-column gap-3 mt-3">
        <Alert severity="warning">
          Verifica registros históricos. El control de stock actual del catálogo
          no demuestra qué ocurrió al comprar. Un dato incorrecto crea
          inventario ficticio.
        </Alert>
        {error && <Alert severity="error">{error}</Alert>}
        {requierePolitica && (
          <div className="d-flex flex-column gap-2">
            <span>
              ¿Se canceló antes de preparar y corresponde liberar la reserva?
            </span>
            <TextField
              select
              fullWidth
              label="Reposición de reserva"
              value={politica}
              onChange={(e) => setPolitica(e.target.value as "si" | "no")}
            >
              <MenuItem value="si">Sí, liberar reserva verificada</MenuItem>
              <MenuItem value="no">No, no reponer automáticamente</MenuItem>
            </TextField>
          </div>
        )}
        {antiguos.map((p) => (
          <div key={p.uuid} className="d-flex flex-column gap-2">
            <span className="text-break">{p.nombre}</span>
            <TextField
              select
              fullWidth
              label="Stock descontado al comprar"
              value={datos[p.uuid] ?? ""}
              onChange={(e) =>
                setDatos((d) => ({ ...d, [p.uuid]: Number(e.target.value) }))
              }
            >
              <MenuItem value={0}>No descontó stock</MenuItem>
              <MenuItem value={p.cantidad}>
                Descontó {p.cantidad} unidades
              </MenuItem>
            </TextField>
          </div>
        ))}
        {pedido.inventarioPendiente && (
          <Alert severity="info">
            Al guardar se reintentará la reposición pendiente. Si el producto
            fue eliminado o no tiene un stock válido, la incidencia seguirá
            abierta para revisión del catálogo.
          </Alert>
        )}
        <TextField
          multiline
          rows={2}
          label="Referencia y evidencia de la conciliación"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          slotProps={{ htmlInput: { maxLength: 500 } }}
        />
      </div>
    </GenericModal>
  );
}
