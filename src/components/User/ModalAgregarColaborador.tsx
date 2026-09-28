import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nombre: string;
    correo: string;
    idComercio: number;
  }) => void;
  id: number;
}

export default function ModalAgregarColaborador({
  open,
  onClose,
  onSubmit,
  id,
}: Props) {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [errors, setErrors] = useState<{ nombre?: string; correo?: string }>(
    {},
  );

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!nombre.trim()) newErrors.nombre = "Ingresa un nombre";
    if (!correo.trim()) newErrors.correo = "Ingresa un correo electrónico";
    else if (!/^\S+@\S+\.\S+$/.test(correo))
      newErrors.correo = "Correo no válido";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({ nombre, correo, idComercio: id });
      setNombre("");
      setCorreo("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          backdropFilter: "blur(20px)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,.95), rgba(245,245,245,.92))",
          boxShadow: "0 30px 80px rgba(0,0,0,.25)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <div className="d-flex align-items-center justify-content-between">
          <h2 className="fz-h5 fw-bold mb-0">
            Agregar colaborador
          </h2>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
      </DialogTitle>

      <DialogContent>
        <p className="fz-body-sm text-muted mb-3">
          Ingresa los datos de la persona a registrar
        </p>

        <div className="d-flex flex-column gap-3">
          <TextField
            label="Nombre"
            placeholder="Ej. Juan Pérez"
            value={nombre}
            error={!!errors.nombre}
            helperText={errors.nombre}
            fullWidth
            onChange={(e) => setNombre(e.target.value)}
            className="form-control-mui-adlocal"
          />

          <TextField
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={correo}
            error={!!errors.correo}
            helperText={errors.correo}
            fullWidth
            onChange={(e) => setCorreo(e.target.value)}
            className="form-control-mui-adlocal"
          />
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button
            onClick={onClose}
            className="btn-adlocal btn-adlocal-ghost"
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            className="btn-adlocal btn-adlocal-primary"
          >
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
