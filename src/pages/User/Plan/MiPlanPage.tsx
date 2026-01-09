import { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { PlanesUserList } from "../../../components/Plan/PlanesUserList";
import { PlanCard } from "../../../components/Plan/PlanCard";
import { useSuscripciones } from "../../../hooks/useSuscripciones";
import { calcularDiasEntreFechas } from "../../../utils/generalsFunctions";
import { SuscripcionDetalleModal } from "../../../components/Suscripcion/SuscripcionDetalleModal";

const PlanesPage = () => {
  const { suscripcion, obtenerMiSuscripcion, cancelar } = useSuscripciones();
  const [openDetalle, setOpenDetalle] = useState(false);

  useEffect(() => {
    obtenerMiSuscripcion();
  }, [obtenerMiSuscripcion]);

  return (
    <div className="container-fluid">
      <Box className="text-center py-4">
        <Typography variant="h4" fontWeight="bold">
          {suscripcion ? <>Mi plan</> : <>Mis planes disponibles</>}
        </Typography>
      </Box>

      {suscripcion ? (
        <Box maxWidth={400} mx="auto">
          <PlanCard
            nombre={suscripcion.plan}
            tipo={"Mensual"}
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
          <SuscripcionDetalleModal
            open={openDetalle}
            onClose={() => setOpenDetalle(false)}
            suscripcion={suscripcion}
          />
        </Box>
      ) : (
        <PlanesUserList />
      )}
    </div>
  );
};

export default PlanesPage;
