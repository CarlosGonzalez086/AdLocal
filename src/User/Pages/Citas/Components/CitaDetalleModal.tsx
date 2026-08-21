import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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

const estados = [
  [EstadoCita.Pendiente, "Pendiente"],
  [EstadoCita.Confirmada, "Confirmada"],
  [EstadoCita.EnAtencion, "En atención"],
  [EstadoCita.Completada, "Completada"],
  [EstadoCita.Cancelada, "Cancelada"],
  [EstadoCita.NoAsistio, "No asistió"],
] as const;
export function CitaDetalleModal({
  cita,
  loading,
  onClose,
  onSave,
}: {
  cita: CitaDto | null;
  loading: boolean;
  onClose: () => void;
  onSave: (
    estado: EstadoCitaType,
    nombreAtiende: string,
    motivo: string,
  ) => void;
}) {
  const [estado, setEstado] = useState<EstadoCitaType>(EstadoCita.Pendiente);
  const [atiende, setAtiende] = useState("");
  const [motivo, setMotivo] = useState("");
  useEffect(() => {
    if (cita) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEstado(cita.estado);
      setAtiende(cita.nombreAtiende ?? "");
      setMotivo("");
    }
  }, [cita]);
  return (
    <Dialog
      open={Boolean(cita)}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className="fz-h2 fw-semibold">
        Detalle de la cita
      </DialogTitle>
      <DialogContent>
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
            onChange={(e) => setAtiende(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              value={estado}
              onChange={(e) =>
                setEstado(Number(e.target.value) as EstadoCitaType)
              }
            >
              {estados.map(([v, l]) => (
                <MenuItem key={v} value={v}>
                  {l}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {estado === EstadoCita.Cancelada && (
            <TextField
              label="Motivo de cancelación"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              multiline
              minRows={2}
              required
            />
          )}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cerrar
        </Button>
        <Button
          className="btn-adlocal"
          disabled={
            loading || (estado === EstadoCita.Cancelada && !motivo.trim())
          }
          onClick={() => onSave(estado, atiende, motivo)}
        >
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}
