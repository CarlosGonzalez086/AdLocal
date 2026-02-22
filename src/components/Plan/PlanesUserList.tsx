import { useEffect, useState } from "react";
import { Typography, Box, Fade, Skeleton } from "@mui/material";
import { usePlanes } from "../../hooks/usePlanes";
import { PlanCard } from "./PlanCard";
import type { PlanCreateDto } from "../../services/planApi";
import { ConfirmarSuscripcionModalV3 } from "../../pages/User/Plan/ConfirmarSuscripcionModalV3";
import { jwtDecode } from "jwt-decode";
import type { JwtClaims } from "../../services/auth.api";

interface Props {
  setIsSubSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PlanesUserList = ({ setIsSubSuccess }: Props) => {
  const { planesUser, loading, listAllPlanesUser } = usePlanes();
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt ? jwtDecode<JwtClaims>(dataJwt) : null;

  const [openModal, setOpenModal] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanCreateDto | null>(null);

  useEffect(() => { listAllPlanesUser(); }, [listAllPlanesUser]);

  const handleSelectPlan = (plan: PlanCreateDto) => {
    setPlanSeleccionado(plan);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPlanSeleccionado(null);
  };

  /* ─── LOADING ─── */
  if (loading) {
    return (
      <Box maxWidth={1200} mx="auto" px={{ xs: 2, md: 3 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", lg: "repeat(3,1fr)" },
            gap: 3,
          }}
        >
          {[1, 2, 3].map((i) => (
            <Box key={i}>
              <Skeleton
                variant="rounded"
                height={420}
                sx={{
                  borderRadius: 5,
                  bgcolor: "rgba(0,0,0,0.06)",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  /* ─── EMPTY ─── */
  if (!planesUser.length) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography fontSize="2.5rem" lineHeight={1}>📭</Typography>
        <Typography fontWeight={800} fontSize="1rem" color="text.primary">
          No hay planes disponibles
        </Typography>
        <Typography fontSize="0.82rem" color="text.disabled">
          Intenta nuevamente más tarde
        </Typography>
      </Box>
    );
  }

  /* ─── LISTA ─── */
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
              .filter((plan) => plan.tipo !== "FREE")
              .sort((a, b) => a.precio - b.precio)
              .map((plan) => (
                <PlanCard
                  key={plan.id}
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
                  onSelect={() => handleSelectPlan(plan)}
                  claims={claims}
                  badgeTexto={plan.badgeTexto || ""}
                />
              ))}
          </Box>
        </Box>
      </Fade>

      {planSeleccionado && (
        <ConfirmarSuscripcionModalV3
          open={openModal}
          plan={planSeleccionado}
          onClose={handleCloseModal}
          setIsSubSuccess={setIsSubSuccess}
        />
      )}
    </>
  );
};