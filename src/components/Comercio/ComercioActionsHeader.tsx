import { Box, Button, Paper, Stack, Typography, LinearProgress } from "@mui/material";
import type { JwtClaims } from "../../services/auth.api";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";
import { Link } from "react-router-dom";

interface Props {
  claims: JwtClaims | null;
  total: number;
}

export function ComercioActionsHeader({ claims, total }: Props) {
  const max = Number(claims?.maxNegocios);
  const restantes = max - total;
  const limiteAlcanzado = restantes <= 0;
  const porcentaje = max > 0 ? (total / max) * 100 : 0;

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        p: { xs: 2.5, sm: 3 },
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.06)",
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        gap={2}
      >
        {/* Info uso */}
        <Box flex={1}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Typography fontWeight={700} fontSize="0.9rem" color="text.primary">
              Negocios registrados
            </Typography>
            <Box
              sx={{
                px: 1.2,
                py: 0.2,
                borderRadius: 999,
                bgcolor: limiteAlcanzado
                  ? "rgba(255,59,48,0.10)"
                  : "rgba(52,199,89,0.10)",
                border: `1px solid ${limiteAlcanzado ? "rgba(255,59,48,0.20)" : "rgba(52,199,89,0.20)"}`,
              }}
            >
              <Typography
                fontSize="0.72rem"
                fontWeight={700}
                color={limiteAlcanzado ? "error.main" : "success.main"}
              >
                {total} / {max}
              </Typography>
            </Box>
          </Stack>

          {/* Barra de progreso */}
          <LinearProgress
            variant="determinate"
            value={Math.min(porcentaje, 100)}
            sx={{
              height: 6,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.06)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                bgcolor: limiteAlcanzado ? "error.main" : "success.main",
              },
            }}
          />

          <Typography fontSize="0.75rem" color="text.disabled" mt={0.8}>
            {limiteAlcanzado
              ? "Llegaste al límite de negocios de tu plan actual"
              : `Puedes registrar ${restantes} negocio${restantes !== 1 ? "s" : ""} más`}
          </Typography>
        </Box>

        {/* Botón */}
        {!limiteAlcanzado ? (
          <Link to="nuevo" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                px: 3,
                py: 1.2,
                background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
                boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
                whiteSpace: "nowrap",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              Nuevo negocio
            </Button>
          </Link>
        ) : (
          <Button
            variant="outlined"
            disabled
            startIcon={<LockRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem",
              px: 3,
              py: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            Límite alcanzado
          </Button>
        )}
      </Stack>
    </Paper>
  );
}