import {
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
import { GenericModal } from "../../../../components/GenericModal";

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

  onClose: () => void;

  onSave: (
    estado: EstadoCitaType,
    nombreAtiende: string,
    motivo: string,
  ) => Promise<any> | any;
}

export function CitaDetalleModal({ cita, loading, onClose, onSave }: Props) {
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
        disabled: estado === EstadoCita.Cancelada && !motivo.trim(),
        onClick: handleSave,
      }}
    >
      <div className="d-flex flex-column gap-3 pt-2">
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
        />

        <FormControl fullWidth>
          <InputLabel>Estado</InputLabel>

          <Select
            label="Estado"
            value={estado}
            onChange={(event) =>
              setEstado(Number(event.target.value) as EstadoCitaType)
            }
          >
            {estados.map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {estado === EstadoCita.Cancelada && (
          <TextField
            label="Motivo de cancelación"
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
            multiline
            minRows={2}
            required
            fullWidth
          />
        )}
      </div>
    </GenericModal>
  );
}
