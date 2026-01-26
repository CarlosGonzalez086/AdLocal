import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
  Stack,
  Chip,
} from "@mui/material";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useLocation } from "react-router-dom";

const UpgradePlanPage = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          borderRadius: 4,
          background: "linear-gradient(180deg, #ffffff 0%, #f6f7fb 100%)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Stack spacing={3} alignItems="center" textAlign="center">
            {/* Icon */}
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #5B8CFF, #7F5BFF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <LockOutlinedIcon sx={{ fontSize: 34 }} />
            </Box>

            <Chip
              label="Plan Free"
              sx={{
                bgcolor: "#EEF2FF",
                color: "#4F46E5",
                fontWeight: 600,
              }}
            />

            <Typography variant="h5" fontWeight={700}>
              Estás usando el Plan Free
            </Typography>

            <Typography color="text.secondary">
              Ideal para comenzar, pero con funcionalidades limitadas.
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ maxWidth: 420 }}
            >
              Actualmente puedes registrar un negocio, mostrar una foto y
              aparecer en búsquedas básicas. Es perfecto para probar la
              plataforma sin costo y sin compromiso.
            </Typography>

            <Box
              sx={{
                width: "100%",
                borderRadius: 3,
                p: 2,
                backgroundColor: "#F9FAFB",
              }}
            >
              <Stack spacing={1}>
                {[
                  "Más visibilidad en búsquedas",
                  "Catálogo de productos o servicios",
                  "Más fotos y mejor presentación",
                  "Prioridad frente a otros negocios",
                ].map((text) => (
                  <Typography key={text} variant="body2" color="text.secondary">
                    • {text}
                  </Typography>
                ))}
              </Stack>
            </Box>
            <Link to={"/app/plan"}>
              <Button
                size="large"
                variant="contained"
                startIcon={<RocketLaunchIcon />}
                sx={{
                  mt: 2,
                  px: 4,
                  py: 1.4,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #5B8CFF, #7F5BFF)",
                  boxShadow: "0 10px 20px rgba(91,140,255,0.35)",
                  "&:hover": {
                    boxShadow: "0 12px 24px rgba(91,140,255,0.45)",
                  },
                }}
              >
                Mejorar mi plan
              </Button>
            </Link>

            <Typography variant="caption" color="text.secondary">
              Planes desde $149 MXN/mes · Cancela cuando quieras
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default UpgradePlanPage;
