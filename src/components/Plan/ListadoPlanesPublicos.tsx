import { Box, CircularProgress, Fade, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";

import { usePlanesPublicos } from "../../hooks/usePlanesPublicos";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import { PlanCard } from "./PlanCard";

import styles from "../../styles/ListadoPlanesPublicos.module.css";

export const ListadoPlanesPublicos = () => {
  const { planes, loading, listAllPlanesUser } = usePlanesPublicos();

  const planesOrdenados = useMemo(() => {
    return [...(planes ?? [])].sort(
      (firstPlan, secondPlan) =>
        Number(firstPlan.precio) - Number(secondPlan.precio),
    );
  }, [planes]);

  useEffect(() => {
    void listAllPlanesUser();
  }, [listAllPlanesUser]);

  if (loading) {
    return (
      <Box className={styles.loadingState} aria-live="polite" aria-busy="true">
        <Box className={styles.loadingIcon}>
          <CircularProgress
            size={42}
            thickness={4}
            className={styles.loadingProgress}
          />
        </Box>

        <Typography component="h2" className={styles.loadingTitle}>
          Cargando planes
        </Typography>

        <Typography component="p" className={styles.loadingDescription}>
          Estamos consultando los planes disponibles.
        </Typography>
      </Box>
    );
  }

  if (planesOrdenados.length === 0) {
    return (
      <Box
        component="section"
        className={styles.emptyState}
        aria-labelledby="empty-plans-title"
      >
        <Box className={styles.emptyIcon}>
          <MaterialSymbol icon="event_busy" size="large" />
        </Box>

        <Typography
          id="empty-plans-title"
          component="h2"
          className={styles.emptyTitle}
        >
          No hay planes disponibles
        </Typography>

        <Typography component="p" className={styles.emptyDescription}>
          Por el momento no existen planes publicados. Intenta nuevamente más
          tarde.
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={500}>
      <Box
        component="section"
        className={styles.container}
        aria-labelledby="public-plans-title"
      >
        <Box className={styles.header}>
          <Box className={styles.headerIcon}>
            <MaterialSymbol icon="workspace_premium" size="large" filled />
          </Box>

          <Typography
            id="public-plans-title"
            component="h1"
            className={styles.title}
          >
            Elige el plan ideal para ti
          </Typography>

          <Typography component="p" className={styles.description}>
            Planes flexibles para impulsar tu negocio, sin contratos forzosos.
          </Typography>
        </Box>

        <Box className={styles.plansGrid}>
          {planesOrdenados.map((plan) => (
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
                isPublic
                badgeTexto={plan.badgeTexto || ""}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Fade>
  );
};
