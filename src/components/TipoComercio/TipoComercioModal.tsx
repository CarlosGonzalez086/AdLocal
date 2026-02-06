import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useState, useEffect } from "react";
import type { TipoComercioCreateDto } from "../../services/tipoComercioApi";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: TipoComercioCreateDto) => Promise<void>;
  tipo: TipoComercioCreateDto;
  soloVer?: boolean;
  loading?: boolean;
}

const defaultForm: TipoComercioCreateDto = {
  nombre: "",
  descripcion: "",
  activo: true,
};

export const TipoComercioModal = ({
  open,
  onClose,
  onSave,
  tipo,
  soloVer,
  loading,
}: Props) => {
  const [form, setForm] = useState<TipoComercioCreateDto>(defaultForm);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({ ...defaultForm, ...tipo });
  }, [tipo, open]);

  const handleSave = async () => {
    await onSave(form);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle>{form.id ? "Editar Tipo de Comercio" : "Nuevo Tipo de Comercio"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Nombre"
            value={form.nombre}
            disabled={soloVer}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          />

          <TextField
            label="Descripción"
            value={form.descripcion ?? ""}
            disabled={soloVer}
            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          />

          <FormControlLabel
            control={
              <Switch
                checked={form.activo}
                disabled={soloVer}
                onChange={(e) =>
                  setForm({ ...form, activo: e.target.checked })
                }
              />
            }
            label="Activo"
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Cerrar</Button>
        {!soloVer && (
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{ borderRadius: 3, backgroundColor: "#007AFF" }}
          >
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
