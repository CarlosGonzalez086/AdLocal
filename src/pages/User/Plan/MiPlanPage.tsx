import { useContext, useEffect, useState } from "react";
import { Typography, Box, Button, useMediaQuery } from "@mui/material";

import { PlanesUserList } from "../../../components/Plan/PlanesUserList";
import { PlanCard } from "../../../components/Plan/PlanCard";
import { useSuscripciones } from "../../../hooks/useSuscripciones";
import { calcularDiasEntreFechas } from "../../../utils/generalsFunctions";
import { SuscripcionDetalleModal } from "../../../components/Suscripcion/SuscripcionDetalleModal";
import theme from "../../../theme/theme";
import { useCheckout } from "../../../hooks/useCheckout";
import type { JwtClaims } from "../../../services/auth.api";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../../../context/UserContext ";
import { useActualizarJwt } from "../../../hooks/useActualizarJwt";

const PlanesPage = () => {
  const { suscripcion, obtenerMiSuscripcion } = useSuscripciones();

  const { cancelarPlan } = useCheckout();

  const [openDetalle, setOpenDetalle] = useState(false);
  const [modoCambio, setModoCambio] = useState(false);

  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;
  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    obtenerMiSuscripcion();
  }, [obtenerMiSuscripcion]);

  useEffect(() => {
    actualizarJwt({
      email: user.sub,
      updateJWT: true,
    });
  }, [suscripcion]);

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
                  dias={calcularDiasEntreFechas(
                    suscripcion.fechaInicio,
                    suscripcion.fechaFin,
                  )}
                  maxNegocios={suscripcion.plan.maxNegocios}
                  maxProductos={suscripcion.plan.maxProductos}
                  maxFotos={suscripcion.plan.maxFotos}
                  precio={suscripcion.plan.precio}
                  esActivo={suscripcion.activa}
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

            <PlanesUserList />
          </>
        )}
      </Box>
    </Box>
  );
};

export default PlanesPage;
