import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Stack,
  useMediaQuery,
} from "@mui/material";
import theme from "../../theme/theme";

export interface PlanCardProps {
  nombre: string;
  tipo: string;
  dias: number;
  precio: number;
  moneda?: string;
  onSelect?: () => void;

  esActivo?: boolean;
  onCancelar?: () => void;
  onVerDetalle?: () => void;
}

export const PlanCard = ({
  nombre,
  tipo,
  dias,
  precio,
  moneda = "$",
  onSelect,
  esActivo = false,
  onCancelar,
  onVerDetalle,
}: PlanCardProps) => {
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 5,
        px: 0.5,
        background: esActivo
          ? "linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%)"
          : "#ffffff",
        boxShadow: esActivo
          ? "0 12px 35px rgba(0,0,0,0.15)"
          : "0 8px 25px rgba(0,0,0,0.08)",
        transition: "all .3s ease",
        ...(isMobile
          ? {}
          : {
              "&:hover": {
                transform: esActivo ? "none" : "translateY(-6px)",
                boxShadow: "0 16px 45px rgba(0,0,0,0.18)",
              },
            }),
      }}
    >
      <CardContent sx={{ pb: 2 }}>
        <Box mb={1.5}>
          <Chip
            label={esActivo ? "PLAN ACTIVO" : tipo}
            size="small"
            sx={{
              fontWeight: 700,
              letterSpacing: 0.6,
              bgcolor: esActivo ? "#E8F0FF" : "#F1F3F7",
              color: esActivo ? "#2563EB" : "#374151",
            }}
          />
        </Box>

        <Typography
          variant="h6"
          fontWeight={800}
          sx={{
            mb: 0.5,
            lineHeight: 1.2,
            letterSpacing: -0.3,
          }}
        >
          {nombre}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          Duración: <strong>{dias} días</strong>
        </Typography>

        <Box mt={3}>
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              lineHeight: 1,
              letterSpacing: -1,
            }}
          >
            $
            {precio.toLocaleString()} {""}
            {moneda}
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: "text.secondary", mt: 0.5 }}
          >
            IVA incluido
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        {esActivo ? (
          <Stack spacing={1.2} width="100%">
            <Button
              variant="outlined"
              onClick={onVerDetalle}
              fullWidth
              sx={{
                borderRadius: 3,
                fontWeight: 600,
                textTransform: "none",
                borderColor: "#CBD5E1",
              }}
            >
              Ver detalles
            </Button>

            <Button
              variant="contained"
              color="error"
              onClick={onCancelar}
              fullWidth
              sx={{
                borderRadius: 3,
                fontWeight: 700,
                textTransform: "none",
                boxShadow: "none",
                "&:hover": {
                  boxShadow: "0 6px 18px rgba(239,68,68,0.4)",
                },
              }}
            >
              Cancelar plan
            </Button>
          </Stack>
        ) : (
          <Button
            variant="contained"
            size="large"
            onClick={onSelect}
            fullWidth
            sx={{
              borderRadius: 3,
              py: 1.3,
              fontWeight: 800,
              textTransform: "none",
              fontSize: "1rem",
              background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
              boxShadow: "0 10px 25px rgba(37,99,235,0.4)",
              "&:hover": {
                boxShadow: "0 14px 35px rgba(37,99,235,0.55)",
              },
            }}
          >
            Elegir plan
          </Button>
        )}
      </CardActions>
    </Card>
  );
};
