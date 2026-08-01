import { Box, Fade, Skeleton, Typography } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import { usePlanes } from "../../hooks/usePlanes";

import type { JwtClaims } from "../../services/auth.api";
import type { PlanCreateDto } from "../../services/planApi";

import { ConfirmarSuscripcionModalV3 } from "../../pages/User/Plan/ConfirmarSuscripcionModalV3";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import { PlanCard } from "./PlanCard";

import styles from "../../styles/PlanesUserList.module.css";

interface Props {
  setIsSubSuccess: Dispatch<SetStateAction<boolean>>;
}

const decodeClaims = (token: string | null): JwtClaims | null => {
  if (!token) {
    return null;
  }

  try {
    return jwtDecode<JwtClaims>(token);
  } catch (error) {
    console.error("No fue posible decodificar el JWT:", error);

    return null;
  }
};

const normalizePlanType = (type?: string): string => {
  return type?.trim().toUpperCase() || "";
};

const normalizePrice = (price: unknown): number => {
  const parsedPrice = Number(price);

  if (!Number.isFinite(parsedPrice)) {
    return 0;
  }

  return parsedPrice;
};

const PlansSkeleton = () => {
  return (
    <Box
      className={styles.loadingContainer}
      aria-live="polite"
      aria-busy="true"
    >
      <Box className={styles.loadingGrid}>
        {[1, 2, 3].map((item) => (
          <Box key={item} className={styles.loadingItem}>
            <Skeleton variant="rounded" className={styles.cardSkeleton} />

            <Skeleton variant="rounded" className={styles.actionSkeleton} />
          </Box>
        ))}
      </Box>

      <Typography component="p" className={styles.loadingText}>
        Consultando los planes disponibles...
      </Typography>
    </Box>
  );
};

const EmptyPlans = () => {
  return (
    <Box
      component="section"
      className={styles.emptyState}
      aria-labelledby="empty-user-plans-title"
    >
      <Box className={styles.emptyIcon}>
        <MaterialSymbol icon="inventory_2" size="large" />
      </Box>

      <Typography
        id="empty-user-plans-title"
        component="h2"
        className={styles.emptyTitle}
      >
        No hay planes disponibles
      </Typography>

      <Typography component="p" className={styles.emptyDescription}>
        Por el momento no existen planes de pago disponibles. Intenta nuevamente
        más tarde.
      </Typography>
    </Box>
  );
};

export const PlanesUserList = ({ setIsSubSuccess }: Props) => {
  const { planesUser, loading, listAllPlanesUser } = usePlanes();

  const claims = useMemo(() => decodeClaims(localStorage.getItem("token")), []);

  const [openModal, setOpenModal] = useState(false);

  const [planSeleccionado, setPlanSeleccionado] =
    useState<PlanCreateDto | null>(null);

  /*
   * Evita que el efecto inicial se repita si la
   * función del hook cambia de referencia.
   */
  const listPlansRef = useRef(listAllPlanesUser);

  useEffect(() => {
    listPlansRef.current = listAllPlanesUser;
  }, [listAllPlanesUser]);

  useEffect(() => {
    void listPlansRef.current();
  }, []);

  const planesDisponibles = useMemo(() => {
    return [...(planesUser ?? [])]
      .filter((plan) => normalizePlanType(plan.tipo) !== "FREE")
      .sort(
        (firstPlan, secondPlan) =>
          normalizePrice(firstPlan.precio) - normalizePrice(secondPlan.precio),
      );
  }, [planesUser]);

  const handleSelectPlan = useCallback((plan: PlanCreateDto) => {
    setPlanSeleccionado(plan);
    setOpenModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
    setPlanSeleccionado(null);
  }, []);

  if (loading) {
    return <PlansSkeleton />;
  }

  if (planesDisponibles.length === 0) {
    return <EmptyPlans />;
  }

  return (
    <>
      <Fade in timeout={400}>
        <Box
          component="section"
          className={styles.container}
          aria-label="Planes de suscripción disponibles"
        >
          <Box className={styles.plansGrid}>
            {planesDisponibles.map((plan) => (
              <Box key={plan.id} className={styles.planItem}>
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
                  onSelect={() => handleSelectPlan(plan)}
                  claims={claims}
                  badgeTexto={plan.badgeTexto || ""}
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
          setIsSubSuccess={setIsSubSuccess}
        />
      )}
    </>
  );
};
