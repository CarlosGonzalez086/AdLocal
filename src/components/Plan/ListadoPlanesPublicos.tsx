import { useEffect } from "react";
import { CircularProgress, Typography, Box, Fade } from "@mui/material";

import { PlanCard } from "./PlanCard";
import { usePlanesPublicos } from "../../hooks/usePlanesPublicos";

export const ListadoPlanesPublicos = () => {
  const { planes, loading, listAllPlanesUser } = usePlanesPublicos();

  useEffect(() => {
    listAllPlanesUser();
  }, [listAllPlanesUser]);

  if (loading) {
    return (
      <Box
        minHeight={300}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <CircularProgress />
        <Typography fontSize={13} color="text.secondary">
          Cargando planes disponibles…
        </Typography>
      </Box>
    );
  }

  if (!planes.length) {
    return (
      <Box textAlign="center" py={6}>
        <Typography fontSize={18} fontWeight={700} mb={1}>
          No hay planes disponibles
        </Typography>
        <Typography fontSize={14} color="text.secondary">
          Intenta nuevamente más tarde
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box maxWidth={1200} mx="auto" mb={5}>
        <Box textAlign="center" mb={3}>
          <Typography fontSize={24} fontWeight={800} mb={1}>
            Elige el plan ideal para ti
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Planes flexibles, sin contratos forzosos
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            justifyContent: "center",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 360px)",
              xl: "repeat(4, 380px)",
            },
            gap: {
              xs: 2.5,
              sm: 3,
              md: 3.5,
            },
          }}
        >
          {planes
            .sort((a, b) => a.precio - b.precio)
            .map((plan) => (
              <Box
                key={plan.id}
                sx={{
                  width: {
                    xs: "100%",
                    sm: "100%",
                    md: "100%",
                    lg: 360,
                    xl: 360,
                  },
                  transition: "all .25s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                  },
                }}
              >
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
                  isMultiUsuario={plan.isMultiUsuario}
                  coloresPersonalizados={plan.coloresPersonalizados}
                  soportePrioritario={plan.tieneBadge}
                  isPublic
                />
              </Box>
            ))}
        </Box>
      </Box>
    </Fade>
  );
};
