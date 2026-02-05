import { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";

import { PlanesUserList } from "../../../components/Plan/PlanesUserList";
import { PlanCard } from "../../../components/Plan/PlanCard";
import { useSuscripciones } from "../../../hooks/useSuscripciones";
import { SuscripcionDetalleModal } from "../../../components/Suscripcion/SuscripcionDetalleModal";
import theme from "../../../theme/theme";
import { useCheckout } from "../../../hooks/useCheckout";
import type { JwtClaims } from "../../../services/auth.api";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../../context/UserContext ";
import { useActualizarJwt } from "../../../hooks/useActualizarJwt";
import toast from "react-hot-toast";
import { calcularDiasRestantesDesdeHoy } from "../../../utils/generalsFunctions";

const PlanesPage = () => {
  const { suscripcion, obtenerMiSuscripcion, loading } = useSuscripciones();

  const { cancelarPlan, isCancel } = useCheckout();

  const [openDetalle, setOpenDetalle] = useState(false);
  const [modoCambio, setModoCambio] = useState(false);
  const [isSubSuccess, setIsSubSuccess] = useState(false);

  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;
  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    obtenerMiSuscripcion();
  }, []);

  useEffect(() => {
    if (!loading && suscripcion.id != 0) {
      if (!isSubSuccess && !isCancel && !suscripcion) {
        return;
      }

      const checkEstado = async () => {
        try {
          if (!suscripcion) return;

          let mensaje: string | null = null;

          if (isSubSuccess) {
            mensaje = "Tu suscripción ya está activa";
          } else if (isCancel) {
            mensaje =
              "Tu suscripción fue cancelada y seguirá activa hasta el final del periodo";
          } else if (suscripcion.plan?.tipo === "FREE") {
            mensaje = "Tu cuenta ahora tiene el Plan Free activo";
          }
          await actualizarJwt({
            email: user.sub,
            updateJWT: true,
          });
          if (!mensaje) return;
          toast.success(mensaje, {
            duration: 3000,
            style: {
              background: "#FFFFFF",
              color: "#1C1C1E",
              borderRadius: "14px",
              padding: "14px 18px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              fontSize: "0.95rem",
              fontWeight: 500,
            },
            iconTheme: {
              primary: "#34C759",
              secondary: "#FFFFFF",
            },
          });
        } catch (error) {
          console.log(error);

          toast.error("Error verificando suscripción", {
            duration: 3000,
            style: {
              background: "#FFFFFF",
              color: "#1C1C1E",
              borderRadius: "14px",
              padding: "14px 18px",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
              fontSize: "0.95rem",
              fontWeight: 500,
            },
            iconTheme: {
              primary: "#a82913d0",
              secondary: "#FFFFFF",
            },
          });
        }
      };

      const timer = setTimeout(checkEstado, 1500);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isSubSuccess, isCancel, suscripcion]);

  if (loading) {
    return (
      <>
        {" "}
        <Box
          minHeight="100vh"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
        >
          <CircularProgress size={56} />
          <Typography fontWeight={600} color="text.secondary">
            Cargando informacion…
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          py: 5,
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={800}>
          {suscripcion && !modoCambio ? "Mi plan" : "Planes disponibles"}
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={1}>
          {suscripcion && !modoCambio
            ? "Administra tu suscripción actual"
            : "Elige el plan que mejor se adapte a tu negocio"}
        </Typography>
      </Box>

      <Box maxWidth={1200} mx="auto" px={{ xs: 2, md: 3 }}>
        {suscripcion && !modoCambio && (
          <Box maxWidth={420} mx="auto">
            {(!isMobile || !openDetalle) && (
              <>
                <PlanCard
                  nombre={suscripcion.plan.nombre}
                  tipo={suscripcion.plan.tipo}
                  dias={calcularDiasRestantesDesdeHoy(
                    suscripcion.fechaFin,
                  )}
                  maxNegocios={suscripcion.plan.maxNegocios}
                  maxProductos={suscripcion.plan.maxProductos}
                  maxFotos={suscripcion.plan.maxFotos}
                  precio={suscripcion.plan.precio}
                  esActivo={suscripcion.activa}
                  isMultiUsuario={suscripcion.plan.isMultiUsuario}
                  onCancelar={cancelarPlan}
                  onVerDetalle={() => setOpenDetalle(true)}
                  tieneAnalytics={suscripcion.plan.tieneAnalytics}
                  coloresPersonalizados={suscripcion.plan.coloresPersonalizados}
                  soportePrioritario={suscripcion.plan.tieneBadge}
                  permiteCatalogo={suscripcion.plan.permiteCatalogo}
                  claims={claims}
                />

                <Button
                  fullWidth
                  onClick={() => setModoCambio(true)}
                  sx={{
                    mt: 2,
                    py: 1.3,
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "#F2F4F7",
                    color: "#111827",
                    "&:hover": {
                      bgcolor: "#E5E7EB",
                    },
                  }}
                >
                  Cambiar plan
                </Button>
              </>
            )}

            <SuscripcionDetalleModal
              open={openDetalle}
              onClose={() => setOpenDetalle(false)}
              suscripcion={suscripcion}
            />
          </Box>
        )}

        {(!suscripcion || modoCambio) && (
          <>
            {suscripcion && (
              <Box textAlign="center" mb={3}>
                <Button
                  onClick={() => setModoCambio(false)}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    color: "#2563EB",
                  }}
                >
                  ← Volver a mi plan
                </Button>
              </Box>
            )}

            <PlanesUserList setIsSubSuccess={setIsSubSuccess} />
          </>
        )}
      </Box>
    </Box>
  );
};

export default PlanesPage;
