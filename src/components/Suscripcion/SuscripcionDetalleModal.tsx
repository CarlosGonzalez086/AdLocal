import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import type { SuscripcionDto } from "../../services/suscripcionApi";
import { calcularDiasRestantesDesdeHoy, utcToLocal } from "../../utils/generalsFunctions";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";

interface Props {
  open: boolean;
  onClose: () => void;
  suscripcion: SuscripcionDto | null;
}

const PLAN_GRADIENT: Record<string, string> = {
  BASIC:    "linear-gradient(135deg, #007AFF, #005FCC)",
  PRO:      "linear-gradient(135deg, #5856D6, #3634A3)",
  BUSINESS: "linear-gradient(135deg, #FF9500, #CC7700)",
  FREE:     "linear-gradient(135deg, #8e8e93, #636366)",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "rgba(0,0,0,0.03)",
    "& fieldset": { borderColor: "rgba(0,0,0,0.08)" },
  },
  "& .MuiInputLabel-root": { fontWeight: 600 },
};

export const SuscripcionDetalleModal = ({ open, onClose, suscripcion }: Props) => {
  if (!suscripcion) return null;

  const { plan } = suscripcion;
  const esActivo = suscripcion.estado === "active";
  const planGradient = PLAN_GRADIENT[plan.tipo] ?? PLAN_GRADIENT.FREE;
  const diasRestantes = calcularDiasRestantesDesdeHoy(suscripcion.fechaFin);

  const beneficios = [
    plan.permiteCatalogo        && "📦 Catálogo",
    plan.coloresPersonalizados  && "🎨 Colores personalizados",
    plan.tieneAnalytics         && "📊 Analytics",
    plan.tieneBadge             && `🏷️ ${plan.badgeTexto || "Badge especial"}`,
    plan.isMultiUsuario         && "👥 Multiusuario",
  ].filter(Boolean) as string[];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 5,
          overflow: "hidden",
          bgcolor: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          px: 3, pt: 3, pb: 2.5,
          background: planGradient,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -40, right: -40,
            width: 150, height: 150,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.07)",
          },
        }}
      >
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Stack spacing={0.4}>
            <Typography fontWeight={900} fontSize="1.2rem" color="#fff" letterSpacing="-0.3px">
              {plan.nombre}
            </Typography>
            <Typography fontSize="0.78rem" sx={{ color: "rgba(255,255,255,0.72)" }}>
              Plan {plan.tipo}
            </Typography>
            <Stack direction="row" spacing={0.8} mt={0.5}>
              <Box
                sx={{
                  px: 1.5, py: 0.35, borderRadius: 999,
                  bgcolor: esActivo ? "rgba(52,199,89,0.25)" : "rgba(255,59,48,0.25)",
                  border: `1px solid ${esActivo ? "rgba(52,199,89,0.40)" : "rgba(255,59,48,0.40)"}`,
                }}
              >
                <Typography fontSize="0.68rem" fontWeight={800} color="#fff">
                  {esActivo ? "✅ Activo" : "❌ Cancelada"}
                </Typography>
              </Box>
              <Box
                sx={{
                  px: 1.5, py: 0.35, borderRadius: 999,
                  bgcolor: suscripcion.autoRenew ? "rgba(0,122,255,0.25)" : "rgba(255,255,255,0.12)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <Typography fontSize="0.68rem" fontWeight={800} color="#fff">
                  {suscripcion.autoRenew ? "🔄 Auto-renovación" : "Sin renovación"}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              width: 30, height: 30, borderRadius: 999,
              bgcolor: "rgba(255,255,255,0.18)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.28)" },
            }}
          >
            <CloseRoundedIcon sx={{ fontSize: 16, color: "#fff" }} />
          </IconButton>
        </Box>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
        <Stack spacing={3}>

          {/* PRECIO */}
          <Box
            sx={{
              p: 2.5, borderRadius: 4, textAlign: "center",
              bgcolor: "rgba(0,0,0,0.02)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}
          >
            <Typography
              fontWeight={900}
              sx={{
                fontSize: "2rem",
                background: planGradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-1px",
                lineHeight: 1,
              }}
            >
              ${plan.precio.toLocaleString()}
              <Typography
                component="span"
                fontSize="0.9rem"
                fontWeight={600}
                sx={{ WebkitTextFillColor: "#8e8e93", ml: 0.5 }}
              >
                MXN
              </Typography>
            </Typography>
            <Typography fontSize="0.78rem" color="text.disabled" mt={0.8}>
              {diasRestantes > 0 ? `${diasRestantes} días restantes` : "Periodo finalizado"}
            </Typography>
          </Box>

          {/* CAPACIDADES */}
          <Box>
            <Typography fontWeight={700} fontSize="0.82rem" color="text.disabled"
              letterSpacing="0.06em" textTransform="uppercase" mb={1.5}>
              Capacidades del plan
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1.5 }}>
              <LimitBox label="Negocios"  value={plan.maxNegocios}  gradient={planGradient} />
              <LimitBox label="Productos" value={plan.maxProductos} gradient={planGradient} />
              <LimitBox label="Fotos"     value={plan.maxFotos}     gradient={planGradient} />
            </Box>
          </Box>

          {/* BENEFICIOS */}
          {beneficios.length > 0 && (
            <Box>
              <Typography fontWeight={700} fontSize="0.82rem" color="text.disabled"
                letterSpacing="0.06em" textTransform="uppercase" mb={1.5}>
                Beneficios incluidos
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {beneficios.map((b) => (
                  <Chip
                    key={b}
                    label={b}
                    size="small"
                    sx={{
                      borderRadius: 999,
                      height: 28,
                      fontSize: "0.78rem",
                      fontWeight: 600,
                      bgcolor: "rgba(0,0,0,0.05)",
                      border: "1px solid rgba(0,0,0,0.07)",
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}

          <Divider sx={{ opacity: 0.5 }} />

          {/* FECHAS */}
          <Box>
            <Stack direction="row" alignItems="center" spacing={0.8} mb={1.5}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 15, color: "text.disabled" }} />
              <Typography fontWeight={700} fontSize="0.82rem" color="text.disabled"
                letterSpacing="0.06em" textTransform="uppercase">
                Período de suscripción
              </Typography>
            </Stack>
            <Box display="flex" gap={2}>
              <TextField label="Inicio" value={utcToLocal(suscripcion.fechaInicio)} fullWidth disabled sx={fieldSx} />
              <TextField label="Fin"    value={utcToLocal(suscripcion.fechaFin)}    fullWidth disabled sx={fieldSx} />
            </Box>
          </Box>
        </Stack>
      </DialogContent>

      {/* FOOTER */}
      <Box
        sx={{
          px: 3, py: 2.5, mt: 2,
          borderTop: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Button
          onClick={onClose}
          fullWidth
          sx={{
            borderRadius: 999,
            py: 1.4,
            fontWeight: 700,
            fontSize: "0.95rem",
            textTransform: "none",
            color: "#fff",
            background: planGradient,
            boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
            transition: "all 0.25s ease",
            "&:hover": {
              boxShadow: "0 12px 28px rgba(0,0,0,0.24)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          Cerrar
        </Button>
      </Box>
    </Dialog>
  );
};

const LimitBox = ({ label, value, gradient }: { label: string; value: number; gradient: string }) => (
  <Box
    sx={{
      textAlign: "center",
      p: 2,
      borderRadius: 3,
      bgcolor: "rgba(0,0,0,0.02)",
      border: "1px solid rgba(0,0,0,0.06)",
    }}
  >
    <Typography
      fontWeight={900}
      fontSize="1.4rem"
      letterSpacing="-0.5px"
      sx={{
        background: gradient,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {value}
    </Typography>
    <Typography fontSize="0.72rem" color="text.disabled" fontWeight={500} mt={0.2}>
      {label}
    </Typography>
  </Box>
);