import { useEffect, useState } from "react";
import { CircularProgress, Typography, Box } from "@mui/material";
import { usePlanes } from "../../hooks/usePlanes";
import { PlanCard } from "./PlanCard";
import { ConfirmarSuscripcionModal } from "./ConfirmarSuscripcionModal";
import type { PlanCreateDto } from "../../services/planApi";

export const PlanesUserList = () => {
  const { planesUser, loading, listAllPlanesUser } = usePlanes();
  const [openModal, setOpenModal] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] =
    useState<PlanCreateDto | null>(null);

  useEffect(() => {
    listAllPlanesUser();
  }, [listAllPlanesUser]);

  const handleSelectPlan = (plan: PlanCreateDto) => {
    setPlanSeleccionado(plan);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPlanSeleccionado(null);
  };

  if (loading) {
    return (
      <Box className="d-flex justify-content-center mt-5">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!planesUser.length) {
    return (
      <Typography className="text-center mt-4" color="text.secondary">
        No hay planes disponibles por el momento
      </Typography>
    );
  }

  return (
    <>
      <div className="container mt-4">
        <div className="row">
          {planesUser.map((plan) => (
            <div key={plan.id} className="col-12 col-sm-6 col-lg-4 mb-4">
              <PlanCard
                nombre={plan.nombre}
                tipo={plan.tipo}
                dias={plan.duracionDias}
                precio={plan.precio}
                onSelect={() => handleSelectPlan(plan)}
              />
            </div>
          ))}
        </div>
      </div>

      {planSeleccionado && (
        <ConfirmarSuscripcionModal
          open={openModal}
          plan={planSeleccionado}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};
