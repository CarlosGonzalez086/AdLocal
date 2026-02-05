import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  Divider,
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

  const features = [
    { label: `Hasta ${maxNegocios} negocios`, active: true },
    { label: `Hasta ${maxProductos} productos por negocio`, active: true },
    { label: `Hasta ${maxFotos} fotos por negocio`, active: true },
    { label: "Catálogo público", active: permiteCatalogo },
    { label: "Analytics", active: tieneAnalytics },
    { label: "Multiusuario", active: isMultiUsuario },
    { label: "Colores personalizados", active: coloresPersonalizados },
    { label: "Soporte prioritario", active: soportePrioritario },
  ];

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 5,
        background: esActivo
          ? "linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%)"
          : "#ffffff",
        boxShadow: esActivo
          ? "0 14px 40px rgba(0,0,0,0.18)"
          : "0 10px 30px rgba(0,0,0,0.1)",
        transition: "all .35s ease",
        ...(isMobile
          ? {}
          : {
              "&:hover": {
                transform: esActivo ? "none" : "translateY(-6px)",
                boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
              },
            }),
      }}
    >
      <CardContent>
        <Box mb={2}>
          <Chip
            label={esActivo ? "PLAN ACTIVO" : tipo}
            size="small"
            sx={{
              fontWeight: 800,
              letterSpacing: 0.6,
              bgcolor: esActivo ? "#E8F0FF" : "#F1F3F7",
              color: esActivo ? "#2563EB" : "#374151",
            }}
          />
        </Box>

        <Typography variant="h6" fontWeight={900} mb={0.5}>
          {nombre}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Duración: {dias > 60 ? "Ilimitado" : <strong>{dias} días</strong>}
        </Typography>

        <Box mt={3} mb={2}>
          <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: -1 }}>
            ${precio.toLocaleString()} MXN
          </Typography>

          <Typography variant="caption" color="text.secondary">
            IVA incluido
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1.2}>
          {features.map((feature) => (
            <Feature
              key={feature.label}
              label={feature.label}
              active={feature.active}
            />
          ))}
        </Stack>
      </CardContent>
      {isPublic ? (
        <></>
      ) : (
        <>
          {" "}
          <CardActions sx={{ px: 2, pb: 2 }}>
            {esActivo ? (
              <Stack spacing={1.4} width="100%">
                <Button
                  variant="outlined"
                  onClick={onVerDetalle}
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  Ver detalles
                </Button>

                {/* ESTADO CANCELADA */}
                {claims?.esatdo === "cancelada" || claims?.esatdo === "canceling" ? (
                  <Box>
                    <Box
                      sx={{
                        mb: 1,
                        px: 2,
                        py: 0.7,
                        borderRadius: 99,
                        background: "rgba(255,59,48,.12)",
                        color: "#FF3B30",
                        fontSize: 12,
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      Suscripción cancelada
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      Tu plan seguirá activo hasta el final de tu periodo
                    </Typography>
                  </Box>
                ) : /* CANCELAR PLAN */
                claims?.planTipo == "FREE" ? (
                  <></>
                ) : (
                  <>
                    {" "}
                    <Button
                      variant="contained"
                      onClick={onCancelar}
                      fullWidth
                      sx={{
                        py: 1.2,
                        borderRadius: 4,
                        fontWeight: 800,
                        textTransform: "none",
                        background: "linear-gradient(135deg, #FF3B30, #D70015)",
                        boxShadow: "0 10px 25px rgba(255,59,48,.35)",
                        "&:hover": {
                          background:
                            "linear-gradient(135deg, #D70015, #B00010)",
                        },
                      }}
                    >
                      Cancelar plan
                    </Button>
                  </>
                )}
              </Stack>
            ) : claims?.planTipo === tipo ? null : (
              <Button
                variant="contained"
                size="large"
                onClick={onSelect}
                fullWidth
                sx={{
                  borderRadius: 4,
                  py: 1.4,
                  fontWeight: 900,
                  textTransform: "none",
                  background: "linear-gradient(135deg, #007AFF, #005BBB)",
                  boxShadow: "0 14px 30px rgba(0,122,255,.45)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #005BBB, #004799)",
                  },
                }}
              >
                {(claims?.esatdo === "cancelada" || claims?.esatdo === "canceling")
                  ? "Reactivar suscripción"
                  : "Cambiar mi plan"}
              </Button>
            )}
          </CardActions>
        </>
      )}
    </Card>
  );
};
