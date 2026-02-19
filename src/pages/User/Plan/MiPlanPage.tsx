import { useContext, useEffect, useState } from "react";
import {
  Typography,
  Box,
  Button,
  useMediaQuery,
  CircularProgress,
  Backdrop,
  Skeleton,
  Stack,
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
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SwapHorizRoundedIcon from "@mui/icons-material/SwapHorizRounded";

const PlanesPage = () => {
  const { suscripcion, obtenerMiSuscripcion, loading } = useSuscripciones();
  const { cancelarPlan, isCancel } = useCheckout();

  const [openDetalle, setOpenDetalle] = useState(false);
  const [modoCambio, setModoCambio] = useState(false);
  const [isSubSuccess, setIsSubSuccess] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt ? jwtDecode<JwtClaims>(dataJwt) : null;
  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => { obtenerMiSuscripcion(); }, []);

  useEffect(() => {
    if (isSubSuccess) {
      const timer = setTimeout(() => obtenerMiSuscripcion(), 1500);
      return () => clearTimeout(timer);
    }
  }, [isSubSuccess]);

  useEffect(() => {
    if ((isSubSuccess || isCancel) && !loading) setShowProcessing(true);

    if (!loading) {
      const checkEstado = async () => {
        try {
          if (!suscripcion) return;
          let mensaje: string | null = null;
          if (isSubSuccess) mensaje = "Tu suscripción ya está activa";
          else if (isCancel) mensaje = "Tu suscripción fue cancelada y seguirá activa hasta el final del periodo";
          else if (suscripcion.plan?.tipo === "FREE") mensaje = "Tu cuenta ahora tiene el Plan Free activo";

          await actualizarJwt({ email: user.sub, updateJWT: true });
          if (mensaje) toast.success(mensaje);
        } catch {
          toast.error("Error verificando suscripción");
        } finally {
          setIsSubSuccess(false);
          setShowProcessing(false);
        }
      };
      const timer = setTimeout(checkEstado, 1500);
      return () => clearTimeout(timer);
    }
  }, [isSubSuccess, isCancel, suscripcion, loading]);

  /* ─── LOADING ─── */
  if (loading) {
    return (
      <Box>
        {/* Header skeleton */}
        <Box textAlign="center" py={5} mb={2}>
          <Skeleton variant="rounded" width={200} height={36} sx={{ borderRadius: 999, mx: "auto", mb: 1.5 }} />
          <Skeleton variant="rounded" width={280} height={18} sx={{ borderRadius: 999, mx: "auto" }} />
        </Box>
        <Box maxWidth={420} mx="auto" px={2}>
          <Skeleton variant="rounded" height={380} sx={{ borderRadius: 5 }} />
          <Skeleton variant="rounded" height={52} sx={{ borderRadius: 999, mt: 2 }} />
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* BACKDROP procesando */}
      <Backdrop
        open={showProcessing}
        sx={{
          zIndex: (t) => t.zIndex.modal + 10,
          bgcolor: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(12px)",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress
          size={52}
          thickness={4}
          sx={{ color: isCancel ? "#FF3B30" : "#007AFF" }}
        />
        <Stack alignItems="center" spacing={0.5}>
          <Typography fontWeight={800} fontSize="1rem" color="text.primary">
            {isCancel ? "Procesando cancelación…" : "Activando tu suscripción…"}
          </Typography>
          <Typography fontSize="0.8rem" color="text.disabled">
            Esto solo tomará unos segundos
          </Typography>
        </Stack>
      </Backdrop>

      {/* HERO HEADER */}
      <Box
        sx={{
          py: { xs: 4, sm: 5 },
          textAlign: "center",
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "1.5rem", sm: "1.9rem" },
            fontWeight: 800,
            color: "#1c1c1e",
            letterSpacing: "-0.5px",
          }}
        >
          {suscripcion && !modoCambio ? "📋 Mi plan" : "🚀 Planes disponibles"}
        </Typography>
        <Typography fontSize="0.875rem" color="text.disabled" mt={0.8}>
          {suscripcion && !modoCambio
            ? "Administra tu suscripción actual"
            : "Elige el plan que mejor se adapte a tu negocio"}
        </Typography>
      </Box>

      <Box maxWidth={1200} mx="auto" px={{ xs: 2, md: 3 }}>

        {/* PLAN ACTUAL */}
        {suscripcion && !modoCambio && (
          <Box maxWidth={440} mx="auto">
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
                  startIcon={<SwapHorizRoundedIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    mt: 2,
                    py: 1.4,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    bgcolor: "rgba(0,0,0,0.05)",
                    color: "text.primary",
                    border: "1px solid rgba(0,0,0,0.08)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(0,0,0,0.09)",
                      transform: "translateY(-1px)",
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

        {/* LISTA DE PLANES */}
        {(!suscripcion || modoCambio) && (
          <>
            {suscripcion && (
              <Box textAlign="center" mb={3}>
                <Button
                  onClick={() => setModoCambio(false)}
                  startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#007AFF",
                    px: 2.5,
                    py: 0.9,
                    border: "1px solid rgba(0,122,255,0.20)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(0,122,255,0.06)",
                      borderColor: "rgba(0,122,255,0.35)",
                      transform: "translateX(-2px)",
                    },
                  }}
                >
                  Volver a mi plan
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