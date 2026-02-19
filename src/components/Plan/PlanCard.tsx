import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Stack,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme/theme";
import { Feature } from "../Feature";
import type { JwtClaims } from "../../services/auth.api";

export interface PlanCardProps {
  nombre: string;
  tipo: string;
  dias: number;
  precio: number;
  maxNegocios: number;
  maxProductos: number;
  maxFotos: number;
  permiteCatalogo: boolean;
  tieneAnalytics: boolean;
  isMultiUsuario: boolean;
  coloresPersonalizados: boolean;
  soportePrioritario: boolean;
  onSelect?: () => void;
  esActivo?: boolean;
  onCancelar?: () => void;
  onVerDetalle?: () => void;
  claims?: JwtClaims | null;
  isPublic?: boolean;
}

const PLAN_CONFIG: Record<string, { gradient: string; glow: string; emoji: string }> = {
  BASIC:    { gradient: "linear-gradient(135deg, #007AFF, #005FCC)", glow: "rgba(0,122,255,0.30)",    emoji: "⚡" },
  PRO:      { gradient: "linear-gradient(135deg, #5856D6, #3634A3)", glow: "rgba(88,86,214,0.30)",   emoji: "🚀" },
  BUSINESS: { gradient: "linear-gradient(135deg, #FF9500, #CC7700)", glow: "rgba(255,149,0,0.30)",   emoji: "💼" },
  FREE:     { gradient: "linear-gradient(135deg, #8e8e93, #636366)", glow: "rgba(142,142,147,0.20)", emoji: "🆓" },
};

export const PlanCard = ({
  nombre,
  tipo,
  dias,
  precio,
  maxNegocios,
  maxProductos,
  maxFotos,
  permiteCatalogo,
  tieneAnalytics,
  isMultiUsuario,
  coloresPersonalizados,
  soportePrioritario,
  onSelect,
  esActivo = false,
  onCancelar,
  onVerDetalle,
  claims,
  isPublic = false,
}: PlanCardProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const planCfg = PLAN_CONFIG[tipo] ?? PLAN_CONFIG.FREE;
  const isCanceled = claims?.esatdo === "cancelada" || claims?.esatdo === "canceling";
  const isSamePlan = claims?.planTipo === tipo;

  const features = [
    { label: `Hasta ${maxNegocios} negocios`,             active: true },
    { label: `Hasta ${maxProductos} productos por negocio`, active: true },
    { label: `Hasta ${maxFotos} fotos por negocio`,       active: true },
    { label: "Catálogo público",          active: permiteCatalogo },
    { label: "Analytics",                  active: tieneAnalytics },
    { label: "Multiusuario",               active: isMultiUsuario },
    { label: "Colores personalizados",     active: coloresPersonalizados },
    { label: "Soporte prioritario",        active: soportePrioritario },
  ];

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 5,
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        border: esActivo
          ? `1.5px solid ${planCfg.glow.replace("0.30", "0.40")}`
          : "1px solid rgba(0,0,0,0.06)",
        boxShadow: esActivo
          ? `0 16px 40px ${planCfg.glow}`
          : "0 4px 16px rgba(0,0,0,0.07)",
        transition: "all .3s ease",
        display: "flex",
        flexDirection: "column",
        ...(!isMobile && !esActivo && {
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: `0 20px 48px ${planCfg.glow}`,
          },
        }),
      }}
    >
      {/* HEADER GRADIENTE */}
      <Box
        sx={{
          px: 3,
          pt: 3,
          pb: 2.5,
          background: planCfg.gradient,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: -30,
            right: -30,
            width: 120,
            height: 120,
            borderRadius: "50%",
            bgcolor: "rgba(255,255,255,0.08)",
          },
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
          <Typography fontSize="1.6rem" lineHeight={1}>{planCfg.emoji}</Typography>
          {esActivo && (
            <Box
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.20)",
                border: "1px solid rgba(255,255,255,0.30)",
              }}
            >
              <Typography fontSize="0.68rem" fontWeight={800} color="#fff" letterSpacing="0.06em">
                ACTIVO
              </Typography>
            </Box>
          )}
        </Stack>

        <Typography fontWeight={900} fontSize="1.2rem" color="#fff" letterSpacing="-0.3px">
          {nombre}
        </Typography>

        <Typography fontSize="0.75rem" sx={{ color: "rgba(255,255,255,0.72)" }} mt={0.3}>
          {dias > 60 ? "Sin vencimiento" : `${dias} días de duración`}
        </Typography>

        <Box mt={2}>
          <Typography
            fontWeight={900}
            sx={{
              fontSize: { xs: "1.8rem", sm: "2rem" },
              color: "#fff",
              letterSpacing: "-1px",
              lineHeight: 1,
            }}
          >
            ${precio.toLocaleString()}
            <Typography component="span" fontSize="0.9rem" fontWeight={500} sx={{ opacity: 0.8, ml: 0.5 }}>
              MXN
            </Typography>
          </Typography>
          <Typography fontSize="0.7rem" sx={{ color: "rgba(255,255,255,0.60)" }} mt={0.3}>
            IVA incluido
          </Typography>
        </Box>
      </Box>

      {/* FEATURES */}
      <CardContent sx={{ px: 3, pt: 2.5, pb: 1, flex: 1 }}>
        <Stack spacing={1.2}>
          {features.map((f) => (
            <Feature key={f.label} label={f.label} active={f.active} />
          ))}
        </Stack>
      </CardContent>

      {/* ACTIONS */}
      {!isPublic && (
        <CardActions sx={{ px: 3, pb: 3, pt: 1 }}>
          {esActivo ? (
            <Stack spacing={1.2} width="100%">
              <Button
                variant="outlined"
                onClick={onVerDetalle}
                fullWidth
                sx={{
                  borderRadius: 999,
                  fontWeight: 700,
                  textTransform: "none",
                  py: 1.2,
                  borderColor: "rgba(0,0,0,0.15)",
                  color: "text.primary",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" },
                }}
              >
                Ver detalles
              </Button>

              {isCanceled ? (
                <Box
                  sx={{
                    px: 2,
                    py: 1.2,
                    borderRadius: 3,
                    bgcolor: "rgba(255,59,48,0.07)",
                    border: "1px solid rgba(255,59,48,0.15)",
                    textAlign: "center",
                  }}
                >
                  <Typography fontSize="0.78rem" fontWeight={700} color="#FF3B30" mb={0.3}>
                    Suscripción cancelada
                  </Typography>
                  <Typography fontSize="0.72rem" color="text.disabled">
                    Tu plan seguirá activo hasta el final del periodo
                  </Typography>
                </Box>
              ) : claims?.planTipo !== "FREE" && (
                <Button
                  variant="contained"
                  onClick={onCancelar}
                  fullWidth
                  sx={{
                    py: 1.2,
                    borderRadius: 999,
                    fontWeight: 700,
                    textTransform: "none",
                    background: "linear-gradient(135deg, #FF3B30, #D70015)",
                    boxShadow: "0 6px 18px rgba(255,59,48,0.28)",
                    transition: "all 0.25s ease",
                    "&:hover": {
                      boxShadow: "0 10px 24px rgba(255,59,48,0.40)",
                      transform: "translateY(-1px)",
                    },
                    "&:active": { transform: "scale(0.98)" },
                  }}
                >
                  Cancelar plan
                </Button>
              )}
            </Stack>
          ) : !isSamePlan && (
            <Button
              variant="contained"
              size="large"
              onClick={onSelect}
              fullWidth
              sx={{
                borderRadius: 999,
                py: 1.4,
                fontWeight: 800,
                textTransform: "none",
                background: planCfg.gradient,
                boxShadow: `0 8px 22px ${planCfg.glow}`,
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: `0 12px 28px ${planCfg.glow}`,
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              {isCanceled ? "Reactivar suscripción" : "Seleccionar plan"}
            </Button>
          )}
        </CardActions>
      )}
    </Card>
  );
};