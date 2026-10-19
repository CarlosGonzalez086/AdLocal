import { Alert, Autocomplete, Button, TextField } from "@mui/material";
import { useMemo, useRef, useState } from "react";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
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
    <div className="card-adlocal p-3 p-md-4 mb-4 border bg-white rounded-3">
      <div className="d-flex align-items-center gap-2 mb-3">
        <MaterialSymbol icon="schedule" size="medium" />
        <div>
          <h4 className="fz-h5 fw-bold mb-0">Zona horaria del negocio</h4>
          <span className="fz-caption text-muted">
            Define la referencia temporal para citas y horarios de operación.
          </span>
        </div>
      </div>

      <Alert severity="info" className="mb-3 fz-body-sm">
        Zona guardada actual: <strong>{actual}</strong>. Los horarios y las citas se
        interpretan en esa zona. Para cambiarla deben resolverse primero las
        citas activas; las citas históricas conservan su zona.
      </Alert>

      {error && <Alert severity="error" className="mb-3 fz-body-sm">{error}</Alert>}

      <div className="row g-3 align-items-center">
        <div className="col-12 col-md-8">
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
                label="Zona horaria"
                size="small"
                helperText="Busca una región IANA (ej. America/Mexico_City, America/Tijuana, America/Cancun)"
              />
            )}
          />
        </div>

        {comercioId > 0 && editable && (
          <div className="col-12 col-md-4 d-flex align-items-center">
            <Button
              variant="contained"
              className="btn-adlocal btn-adlocal-primary w-100"
              style={{ minHeight: "40px" }}
              disabled={loading || elegida === actual}
              onClick={() => void guardar()}
            >
              {loading ? "Guardando..." : "Guardar zona horaria"}
            </Button>
          </div>
        )}
      </div>

      {comercioId > 0 && editable && (
        <p className="fz-caption text-muted mb-0 mt-2">
          La zona se guarda con este botón, independientemente de los demás datos del formulario.
        </p>
      )}
    </div>
  );
}
