import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import type { SuscripcionDto } from "../../services/suscripcionApi";
import {
  calcularDiasEntreFechas,
  utcToLocal,
} from "../../utils/generalsFunctions";

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

  const { plan } = suscripcion;
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
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography fontWeight={900} fontSize="1.2rem">
              {plan.nombre}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Plan {plan.tipo}
            </Typography>
          </Box>

          <Chip
            label={esActivo ? "Activo" : "Cancelada"}
            sx={{
              fontWeight: 700,
              px: 1.2,
              bgcolor: esActivo ? "#E8F0FF" : "#b40f0f",
              color: esActivo ? "#2563EB" : "#ffffff",
            }}
          />
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 4,
              bgcolor: "#F9FAFB",
              textAlign: "center",
            }}
          >
            <Typography fontSize="2rem" fontWeight={900}>
              ${plan.precio.toLocaleString()}
              <Typography component="span" fontSize="1rem" fontWeight={600}>
                {" "}
                MXN
              </Typography>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Duración:{" "}
              {calcularDiasEntreFechas(
                suscripcion.fechaInicio,
                suscripcion.fechaFin,
              )}{" "}
              días
            </Typography>
          </Box>

          <Box>
            <Typography fontWeight={800} mb={1}>
              Beneficios incluidos
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={1}>
              {plan.permiteCatalogo && <Chip label="📦 Catálogo" />}
              {plan.coloresPersonalizados && (
                <Chip label="🎨 Colores personalizados" />
              )}
              {plan.tieneAnalytics && <Chip label="📊 Analytics" />}
              {plan.tieneBadge && (
                <Chip label={`🏷️ ${plan.badgeTexto || "Badge especial"}`} />
              )}
            </Stack>
          </Box>

          <Box>
            <Typography fontWeight={800} mb={1}>
              Capacidades del plan
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <LimitBox label="Negocios" value={plan.maxNegocios} />
              <LimitBox label="Productos" value={plan.maxProductos} />
              <LimitBox label="Fotos" value={plan.maxFotos} />
            </Box>
          </Box>

          <Box display="flex" gap={2}>
            <TextField
              label="Inicio"
              value={utcToLocal(suscripcion.fechaInicio)}
              fullWidth
              disabled
              sx={fieldStyle}
            />
            <TextField
              label="Fin"
              value={utcToLocal(suscripcion.fechaFin)}
              fullWidth
              disabled
              sx={fieldStyle}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            borderRadius: 3,
            py: 1.4,
            fontWeight: 800,
            fontSize: "1rem",
            textTransform: "none",
            color: "#fff",
            background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
            boxShadow: "0 12px 30px rgba(37,99,235,0.45)",
            "&:hover": {
              boxShadow: "0 18px 45px rgba(37,99,235,0.6)",
            },
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const LimitBox = ({ label, value }: { label: string; value: number }) => (
  <Box
    sx={{
      textAlign: "center",
      p: 2,
      borderRadius: 3,
      bgcolor: "#F9FAFB",
    }}
  >
    <Typography fontWeight={900} fontSize="1.2rem">
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Box>
);

const fieldStyle = {
  "& .MuiInputBase-root": {
    borderRadius: 3,
    backgroundColor: "#F9FAFB",
  },
  "& .MuiInputLabel-root": {
    fontWeight: 600,
  },
};
