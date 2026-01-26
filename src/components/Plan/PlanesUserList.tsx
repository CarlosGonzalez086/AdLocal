import { useEffect, useState } from "react";
import { CircularProgress, Typography, Box, Fade } from "@mui/material";
import { usePlanes } from "../../hooks/usePlanes";
import { PlanCard } from "./PlanCard";
import type { PlanCreateDto } from "../../services/planApi";
import { ConfirmarSuscripcionModalV3 } from "../../pages/User/Plan/ConfirmarSuscripcionModalV3";
import { jwtDecode } from "jwt-decode";
import type { JwtClaims } from "../../services/auth.api";

export const PlanesUserList = () => {
  const { planesUser, loading, listAllPlanesUser } = usePlanes();
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;

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
            {planesUser
              .filter((plan) => plan.tipo != "FREE")
              .sort((a, b) => a.precio - b.precio)
              .map((plan) => (
                <Box key={plan.id}>
                  <PlanCard
                    nombre={plan.nombre}
                    tipo={plan.tipo}
                    dias={plan.duracionDias}
                    precio={plan.precio}
                    maxNegocios={plan.maxNegocios}
                    maxProductos={plan.maxProductos}
                    maxFotos={plan.maxFotos}
                    permiteCatalogo={plan.permiteCatalogo}
                    tieneAnalytics={plan.tieneAnalytics}
                    coloresPersonalizados={plan.coloresPersonalizados}
                    soportePrioritario={plan.tieneBadge}
                    onSelect={() => handleSelectPlan(plan)}
                    claims={claims}
                  />
                </Box>
              ))}
          </Box>
        </Box>
      </Fade>

      {planSeleccionado && (
        <ConfirmarSuscripcionModalV3
          open={openModal}
          plan={planSeleccionado}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
};
