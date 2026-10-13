import {
  Alert,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  EstadoCita,
  type CitaDto,
  type EstadoCita as EstadoCitaType,
} from "../../../../types/User/citas";
import {
  GenericModal,
  type GenericModalResult,
} from "../../../../components/GenericModal";

const estados = [
  [EstadoCita.Pendiente, "Pendiente"],
  [EstadoCita.Confirmada, "Confirmada"],
  [EstadoCita.EnAtencion, "En atención"],
  [EstadoCita.Completada, "Completada"],
  [EstadoCita.Cancelada, "Cancelada"],
  [EstadoCita.NoAsistio, "No asistió"],
] as const;

interface Props {
  cita: CitaDto | null;

  loading: boolean;
  error?: string;

  onClose: () => void;

  onSave: (
    estado: EstadoCitaType,
    nombreAtiende: string,
    motivo: string,
  ) =>
    | Promise<GenericModalResult | void | undefined>
    | GenericModalResult
    | void
    | undefined;
}

export function CitaDetalleModal({
  cita,
  loading,
  error,
  onClose,
  onSave,
}: Props) {
  const cerrada = Boolean(
    cita &&
    [
      EstadoCita.Completada,
      EstadoCita.Cancelada,
      EstadoCita.NoAsistio,
    ].includes(cita.estado as 4 | 5 | 6),
  );
  const [estado, setEstado] = useState<EstadoCitaType>(EstadoCita.Pendiente);

  const [atiende, setAtiende] = useState("");

  const [motivo, setMotivo] = useState("");

  useEffect(() => {
    if (!cita) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado(cita.estado);

    setAtiende(cita.nombreAtiende ?? "");

    setMotivo("");
  }, [cita]);

  const handleSave = async () => {
    if (estado === EstadoCita.Cancelada && !motivo.trim()) {
      return {
        noClose: true,
      };
    }

    const result = await onSave(estado, atiende.trim(), motivo.trim());

    return result;
  };

  return (
    <GenericModal
      open={Boolean(cita)}
      onClose={onClose}
      title="Detalle de la cita"
      subtitle="Consulta la información y actualiza el estado de la cita."
      icon="event"
      maxWidth="sm"
      loading={loading}
      secondaryLabel="Cerrar"
      primaryAction={{
        label: "Guardar cambios",
        loadingLabel: "Guardando...",
        icon: "save",
        type: "button",
        disabled:
          !cita ||
          cerrada ||
          (estado === EstadoCita.Cancelada && !motivo.trim()),
        onClick: handleSave,
      }}
    >
      <div className="d-flex flex-column gap-3 pt-2">
        {error && <Alert severity="error">{error}</Alert>}
        {cerrada && (
          <Alert severity="info">
            Esta cita está cerrada y no puede reabrirse.
          </Alert>
        )}
        <p className="mb-0">
          {cita?.fechaInicio.slice(0, 10)} · {cita?.fechaInicio.slice(11, 16)} a{" "}
          {cita?.fechaFin.slice(11, 16)} · {cita?.zonaHoraria}
        </p>
        {cita?.motivoCancelacion && (
          <Alert severity="info">
            Motivo registrado: {cita.motivoCancelacion}
          </Alert>
        )}
        <div className="appointment-detail-card p-3 gap-2">
          <h3 className="fz-h3 fw-semibold mb-2">{cita?.servicio}</h3>

          <p className="mb-1">
            <strong>Persona atendida:</strong> {cita?.nombrePersona}
          </p>

          <p className="mb-1">
            <strong>Reservó:</strong> {cita?.cliente}
          </p>

          <p className="mb-1">
            <strong>Teléfono:</strong>{" "}
            {cita?.telefonoCliente || "No registrado"}
          </p>

          <p className="mb-0">
            <strong>Notas:</strong> {cita?.notasCliente || "Sin notas"}
          </p>
        </div>

        <TextField
          label="Nombre de quien atenderá"
          value={atiende}
          onChange={(event) => setAtiende(event.target.value)}
          fullWidth
          disabled={loading || cerrada}
          slotProps={{ htmlInput: { maxLength: 100 } }}
        />

        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>

          <Select
            disabled={loading || cerrada}
            label="Estado"
            value={estado}
            onChange={(event) =>
              setEstado(Number(event.target.value) as EstadoCitaType)
            }
          >
            {estados
              .filter(
                ([value]) =>
                  value === cita?.estado ||
                  cita?.accionesDisponibles.includes(value),
              )
              .map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {estado === EstadoCita.Cancelada && !cerrada && (
          <TextField
            label="Motivo de cancelación"
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
            multiline
            minRows={2}
            required
            fullWidth
            slotProps={{ htmlInput: { maxLength: 500 } }}
          />
        )}
      </div>
    </GenericModal>
  );
}
