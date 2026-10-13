import { Alert, Autocomplete, Button, TextField } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import { comercioApi } from "../../../../services/comercioApi";
import { extraerMensajeError } from "../../../../utils/errorHandler";

export function ComercioZonaHoraria({
  comercioId,
  actual,
  editable,
  onConfirmada,
}: {
  comercioId: number;
  actual: string;
  editable: boolean;
  onConfirmada: (zona: string) => void;
}) {
  const [elegida, setElegida] = useState(actual);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const vuelo = useRef(false);
  const zonas = useMemo(() => {
    const intl = Intl as typeof Intl & {
      supportedValuesOf?: (key: string) => string[];
    };
    return [
      ...new Set([
        actual,
        "Etc/UTC",
        "America/Mexico_City",
        "America/Tijuana",
        "America/Cancun",
        "America/Hermosillo",
        ...(intl.supportedValuesOf?.("timeZone") ?? []),
      ]),
    ].sort();
  }, [actual]);
  const guardar = async () => {
    if (vuelo.current || !editable || !elegida) return;
    vuelo.current = true;
    setLoading(true);
    setError("");
    try {
      const r = await comercioApi.zonaHoraria(comercioId, elegida, actual);
      if (r.data.codigo !== "200" || r.data.respuesta !== elegida)
        throw new Error(r.data.mensaje || "Respuesta incompleta.");
      onConfirmada(r.data.respuesta);
    } catch (e) {
      setError(
        extraerMensajeError(
          e,
          "No se confirmó la zona. Actualiza el comercio antes de reintentar.",
        ),
      );
    } finally {
      vuelo.current = false;
      setLoading(false);
    }
  };
  return (
    <div className="d-flex flex-column gap-3 mb-4">
      <Alert severity="info">
        Zona guardada: <strong>{actual}</strong>. Los horarios y las citas se
        interpretan en esa zona. Para cambiarla deben resolverse primero las
        citas activas; las citas históricas conservan su zona.
      </Alert>
      {error && <Alert severity="error">{error}</Alert>}
      <Autocomplete
        options={zonas}
        value={elegida}
        disabled={!editable || loading}
        onChange={(_, valor) => {
          if (valor) {
            setElegida(valor);
            if (!comercioId) onConfirmada(valor);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Zona horaria del comercio"
            helperText="Busca una región IANA, por ejemplo America/Tijuana o America/Cancun."
          />
        )}
      />
      {comercioId > 0 && editable && (
        <div>
          <Button
            disabled={loading || elegida === actual}
            onClick={() => void guardar()}
          >
            {loading ? "Guardando zona..." : "Guardar zona horaria"}
          </Button>
          <p className="mb-0">
            La zona se guarda con este botón, independientemente de los demás
            datos del formulario.
          </p>
        </div>
      )}
    </div>
  );
}
