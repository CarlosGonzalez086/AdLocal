import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import type { SuscripcionDto } from "../../services/suscripcionApi";
import { utcToLocal } from "../../utils/generalsFunctions";


interface Props {
  open: boolean;
  onClose: () => void;
  suscripcion: SuscripcionDto | null;
}

export const SuscripcionDetalleModal = ({
  open,
  onClose,
  suscripcion,
}: Props) => {
  if (!suscripcion) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Detalle del Plan</DialogTitle>

      <DialogContent className="d-flex flex-column gap-3 mt-2">
        <TextField
          label="Plan"
          value={suscripcion.plan}
          disabled
          fullWidth
        />

        <TextField
          label="Tipo"
          value={suscripcion.tipo}
          disabled
          fullWidth
        />

        <TextField
          label="Monto"
          value={suscripcion.monto}
          disabled
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                {suscripcion.moneda}
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Fecha de inicio"
          value={utcToLocal(suscripcion.fechaInicio)}
          disabled
          fullWidth
        />

        <TextField
          label="Fecha de fin"
          value={utcToLocal(suscripcion.fechaFin)}
          disabled
          fullWidth
        />

        <TextField
          label="Estado"
          value={suscripcion.estado == "active" ? "Activo" :"No activo"}
          disabled
          fullWidth
        />

        <TextField
          label="Renovación automática"
          value={suscripcion.autoRenovacion ? "Sí" : "No"}
          disabled
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
};
