import { jwtDecode } from "jwt-decode";
import type { JwtClaims } from "../../../services/auth.api";
import { useComercio } from "../../../hooks/useComercio";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Box, Button, Skeleton, Stack, Typography } from "@mui/material";
import ComercioCard from "../../../components/Comercio/ComercioCard";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";

export default function ProductosServicioComercios() {
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt ? jwtDecode<JwtClaims>(dataJwt) : null;
  const { loading, comercios, getAllComerciosByUser } = useComercio();
  const navigate = useNavigate();

  const isAllowed =
    claims?.rol === "Comercio" &&
    (claims?.planTipo === "PRO" || claims?.planTipo === "BUSINESS");

  useEffect(() => {
    if (isAllowed) {
      getAllComerciosByUser(0, Number(claims?.maxNegocios));
    } else {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Tu plan actual no incluye acceso a esta sección. Actualiza tu plan para desbloquear esta funcionalidad.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#007AFF",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => navigate("/app/productos-servicios"));
    }
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2,1fr)",
            md: "repeat(3,1fr)",
            lg: "repeat(4,1fr)",
          },
          gap: 2,
        }}
      >
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={260}
            sx={{ borderRadius: 4, bgcolor: "rgba(0,0,0,0.06)" }}
          />
        ))}
      </Box>
    );
  }

  if (comercios.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          textAlign: "center",
          px: 3,
        }}
      >
        <Box
          sx={{
            width: 72, height: 72,
            borderRadius: 4,
            bgcolor: "rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.07)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 0.5,
          }}
        >
          <StorefrontRoundedIcon sx={{ fontSize: 32, color: "text.disabled" }} />
        </Box>

        <Stack spacing={0.5} alignItems="center">
          <Typography fontWeight={800} fontSize="1.1rem" color="text.primary">
            Aún no tienes un comercio registrado
          </Typography>
          <Typography fontSize="0.82rem" color="text.disabled" maxWidth={380}>
            Para registrar productos o servicios, primero da de alta tu negocio.
          </Typography>
        </Stack>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
          onClick={() => navigate("/app/comercio")}
          sx={{
            mt: 1,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.875rem",
            px: 3, py: 1.2,
            background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
            transition: "all 0.25s ease",
            "&:hover": {
              boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          Registrar comercio
        </Button>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2,1fr)",
          md: "repeat(3,1fr)",
          lg: "repeat(4,1fr)",
        },
        gap: 2,
      }}
    >
      {comercios.map((c) => (
        <ComercioCard key={c.id} comercio={c} isProductOrServiceCreation />
      ))}
    </Box>
  );
}