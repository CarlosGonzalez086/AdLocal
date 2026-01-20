import { useEffect, useState } from "react";
import { CircularProgress, Typography, Box, Fade } from "@mui/material";
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
      <Box
        minHeight={260}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Cargando planes disponibles…
        </Typography>
      </Box>
    );
  }

  if (!planesUser.length) {
    return (
      <Box textAlign="center" py={6}>
        <Typography variant="h6" fontWeight={700} mb={1}>
          No hay planes disponibles
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Intenta nuevamente más tarde
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Fade in timeout={400}>
        <Box maxWidth={1200} mx="auto" px={{ xs: 2, md: 3 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {planesUser.map((plan) => (
              <Box key={plan.id}>
                <PlanCard
                  nombre={plan.nombre}
                  tipo={plan.tipo}
                  dias={plan.duracionDias}
                  precio={plan.precio}
                  onSelect={() => handleSelectPlan(plan)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      </Fade>

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
