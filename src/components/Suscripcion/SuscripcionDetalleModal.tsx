import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  InputAdornment,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
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

  const esActivo = suscripcion.estado === "active";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{ letterSpacing: -0.3 }}
          >
            Detalle del plan
          </Typography>

          <Chip
            label={esActivo ? "Activo" : "Inactivo"}
            size="small"
            sx={{
              fontWeight: 700,
              bgcolor: esActivo ? "#E8F0FF" : "#F3F4F6",
              color: esActivo ? "#2563EB" : "#6B7280",
            }}
          />
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={2.5}>
          <TextField
            label="Plan"
            value={suscripcion.plan}
            fullWidth
            disabled
            sx={fieldStyle}
          />

          <TextField
            label="Tipo"
            value={suscripcion.tipo}
            fullWidth
            disabled
            sx={fieldStyle}
          />

          <TextField
            label="Monto"
            value={suscripcion.monto.toLocaleString()}
            fullWidth
            disabled
            sx={fieldStyle}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  {suscripcion.moneda}
                </InputAdornment>
              ),
            }}
          />

          <Box display="flex" gap={2} flexWrap="wrap">
            <TextField
              label="Fecha de inicio"
              value={utcToLocal(suscripcion.fechaInicio)}
              fullWidth
              disabled
              sx={fieldStyle}
            />

            <TextField
              label="Fecha de fin"
              value={utcToLocal(suscripcion.fechaFin)}
              fullWidth
              disabled
              sx={fieldStyle}
            />
          </Box>

          <TextField
            label="Renovación automática"
            value={suscripcion.autoRenovacion ? "Sí" : "No"}
            fullWidth
            disabled
            sx={fieldStyle}
          />
        </Stack>
      </DialogContent>


      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          variant="contained"
          onClick={onClose}
          fullWidth
          sx={{
            borderRadius: 3,
            py: 1.3,
            fontWeight: 800,
            textTransform: "none",
            fontSize: "1rem",
            background:
              "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
            boxShadow: "0 10px 25px rgba(37,99,235,0.4)",
            "&:hover": {
              boxShadow: "0 14px 35px rgba(37,99,235,0.55)",
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ===== Estilo iOS para inputs ===== */
const fieldStyle = {
  "& .MuiInputBase-root": {
    borderRadius: 3,
    backgroundColor: "#F9FAFB",
  },
  "& .MuiInputLabel-root": {
    fontWeight: 600,
  },
};
