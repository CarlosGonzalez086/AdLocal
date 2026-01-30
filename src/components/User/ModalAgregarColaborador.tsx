import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Box,
  Button,
  Typography,
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

    if (Object.keys(newErrors).length == 0) {
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
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography fontWeight={800} fontSize="1.1rem">
            Agregar colaborador
          </Typography>

          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography fontSize={13} color="text.secondary" mb={3}>
          Ingresa los datos de la persona a registrar
        </Typography>

        <Box display="flex" flexDirection="column" gap={2.5}>
          <TextField
            label="Nombre"
            placeholder="Ej. Juan Pérez"
            value={nombre}
            error={!!errors.nombre}
            helperText={errors.nombre}
            fullWidth
            onChange={(e) => setNombre(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />

          <TextField
            label="Correo electrónico"
            placeholder="correo@ejemplo.com"
            value={correo}
            error={!!errors.correo}
            helperText={errors.correo}
            fullWidth
            onChange={(e) => setCorreo(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
              },
            }}
          />
        </Box>

        <Box mt={4} display="flex" gap={1.5} justifyContent="flex-end">
          <Button
            onClick={onClose}
            sx={{
              borderRadius: 999,
              px: 3,
              color: "text.secondary",
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              ml: "auto",
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background: "linear-gradient(135deg, #007AFF 0%, #005FCC 100%)",
              boxShadow: "0 6px 16px rgba(0,122,255,0.3)",
            }}
          >
            Guardar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
