import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import { PlanesUserList } from "../../../components/Plan/PlanesUserList";
import { PlanCard } from "../../../components/Plan/PlanCard";
import { useSuscripciones } from "../../../hooks/useSuscripciones";
import { calcularDiasEntreFechas } from "../../../utils/generalsFunctions";
import { SuscripcionDetalleModal } from "../../../components/Suscripcion/SuscripcionDetalleModal";
import theme from "../../../theme/theme";

const PlanesPage = () => {
  const { suscripcion, obtenerMiSuscripcion, cancelar } = useSuscripciones();
  const [openDetalle, setOpenDetalle] = useState(false);

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    obtenerMiSuscripcion();
  }, [obtenerMiSuscripcion]);

  return (
    <Box>
      <Box
        sx={{
          py: 5,
          textAlign: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight={700}>
          {suscripcion ? "Mi plan" : "Planes disponibles"}
        </Typography>

        <Typography variant="body2" color="text.secondary" mt={1}>
          {suscripcion
            ? "Administra tu suscripción actual"
            : "Elige el plan que mejor se adapte a tu negocio"}
        </Typography>
      </Box>

      <Box maxWidth={1200} mx="auto" px={{ xs: 2, md: 3 }}>
        {suscripcion ? (
          <Box maxWidth={420} mx="auto">
            {(!isMobile || !openDetalle) && (
              <PlanCard
                nombre={suscripcion.plan}
                tipo="Mensual"
                dias={calcularDiasEntreFechas(
                  suscripcion.fechaInicio,
                  suscripcion.fechaFin
                )}
                precio={suscripcion.monto}
                moneda={suscripcion.moneda}
                esActivo
                onCancelar={cancelar}
                onVerDetalle={() => setOpenDetalle(true)}
              />
            )}

            <SuscripcionDetalleModal
              open={openDetalle}
              onClose={() => setOpenDetalle(false)}
              suscripcion={suscripcion}
            />
          </Box>
        ) : (
          <PlanesUserList />
        )}
      </Box>
    </Box>
  );
};

export default PlanesPage;
