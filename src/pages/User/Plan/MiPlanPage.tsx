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
import { Backdrop } from "@mui/material";

const PlanesPage = () => {
  const { suscripcion, obtenerMiSuscripcion, loading } = useSuscripciones();

  const { cancelarPlan, isCancel } = useCheckout();

  const [openDetalle, setOpenDetalle] = useState(false);
  const [modoCambio, setModoCambio] = useState(false);
  const [isSubSuccess, setIsSubSuccess] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

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
    if (isSubSuccess) {
      const checkEstado = async () => {
        obtenerMiSuscripcion();
      };
      const timer = setTimeout(checkEstado, 1500);

      return () => clearTimeout(timer);
    }
  }, [isSubSuccess]);

  useEffect(() => {
    if ((isSubSuccess || isCancel) && !loading) {
      console.log("Entro");

      setShowProcessing(true);
    }

    if (!loading) {
      const checkEstado = async () => {
        try {
          if (!suscripcion) return;

          let mensaje: string | null = null;
          console.log("Entro Check");
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
          console.log("Entro JWT");
          if (mensaje) {
            toast.success(mensaje, {
              /* tu config */
            });
          }
        } catch (error) {
          toast.error("Error verificando suscripción");
        } finally {
          console.log("Entro Finally");
          setIsSubSuccess(false);
          setShowProcessing(false);
        }
      };

      const timer = setTimeout(checkEstado, 1500);

      return () => clearTimeout(timer);
    }
  }, [isSubSuccess, isCancel, suscripcion, loading]);

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
      <Backdrop
        open={showProcessing}
        sx={{
          zIndex: (theme) => theme.zIndex.modal + 10,
          bgcolor: "rgba(255,255,255,0.85)",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress size={64} />
        <Typography fontWeight={700} fontSize={16} color="text.primary">
          {isCancel
            ? "Procesando cancelación del plan…"
            : "Activando tu suscripción…"}
        </Typography>

        <Typography fontSize={13} color="text.secondary">
          Esto solo tomará unos segundos
        </Typography>
      </Backdrop>

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
                  dias={calcularDiasRestantesDesdeHoy(suscripcion.fechaFin)}
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
