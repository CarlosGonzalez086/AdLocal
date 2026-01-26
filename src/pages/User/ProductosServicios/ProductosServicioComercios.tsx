import { jwtDecode } from "jwt-decode";
import type { JwtClaims } from "../../../services/auth.api";
import { useComercio } from "../../../hooks/useComercio";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import ComercioCard from "../../../components/Comercio/ComercioCard";

export default function ProductosServicioComercios() {
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;
  const { loading, comercios, getAllComerciosByUser } = useComercio();
  const navigate = useNavigate();
  const page = 0;
  const rows = Number(claims?.maxNegocios);
  useEffect(() => {
    if (
      claims?.rol == "Comercio" &&
      (claims?.planTipo == "PRO" || claims?.planTipo == "BUSINESS")
    ) {
      getAllComerciosByUser(page, rows);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Tu plan actual no incluye acceso a esta sección. Actualiza tu plan para desbloquear esta funcionalidad.",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#0d6efd",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        navigate("/app/productos-servicios");
      });

      return;
    }
  }, []);
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: "linear-gradient(135deg, #f9fafb, #eef2f7)",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4.5}
          sx={{
            color: "#6F4E37",
          }}
        />

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "text.secondary",
            letterSpacing: "0.3px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          Cargando comercios...
        </Typography>

        <style>
          {`
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
        `}
        </style>
      </Box>
    );
  }
  if (!loading && comercios.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          textAlign: "center",
          px: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: "3rem",
          }}
        >
          🏪
        </Typography>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "1.3rem",
          }}
        >
          Aún no tienes un comercio registrado
        </Typography>

        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          Para registrar productos o servicios, primero da de alta tu negocio o
          comercio.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/app/comercio")}
          sx={{
            mt: 1,
            px: 4,
            py: 1.2,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Registrar comercio
        </Button>
      </Box>
    );
  }
  return (
    <>
      {" "}
      <div className="container-fluid">
        <div className="row align-items-stretch">
          {comercios.map((c) => (
            <div
              key={c.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex pb-3"
            >
              <ComercioCard comercio={c} isProductOrServiceCreation={true} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
