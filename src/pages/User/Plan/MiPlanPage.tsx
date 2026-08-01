import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import { PlanCard } from "../../../components/Plan/PlanCard";
import { PlanesUserList } from "../../../components/Plan/PlanesUserList";
import { SuscripcionDetalleModal } from "../../../components/Suscripcion/SuscripcionDetalleModal";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import { useActualizarJwt } from "../../../hooks/useActualizarJwt";
import { useCheckout } from "../../../hooks/useCheckout";
import { useSuscripciones } from "../../../hooks/useSuscripciones";

import type { JwtClaims } from "../../../services/auth.api";

import { calcularDiasRestantesDesdeHoy } from "../../../utils/generalsFunctions";

import styles from "../../../styles/PlanesPage.module.css";
import { UserContext } from "../../../context/UserContext ";

type ProcessingType = "activation" | "cancellation" | null;

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

const PlanesPageSkeleton = () => {
  return (
    <Box className={styles.loadingPage} aria-busy="true" aria-live="polite">
      <Box className={styles.loadingHeader}>
        <Skeleton variant="rounded" className={styles.titleSkeleton} />

        <Skeleton variant="rounded" className={styles.subtitleSkeleton} />
      </Box>

      <Box className={styles.loadingCardContainer}>
        <Skeleton variant="rounded" className={styles.cardSkeleton} />

        <Skeleton variant="rounded" className={styles.buttonSkeleton} />
      </Box>

      <Typography component="p" className={styles.loadingText}>
        Cargando la información de tu plan...
      </Typography>
    </Box>
  );
};

const PlanesPage = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const user = useContext(UserContext);

  const { suscripcion, obtenerMiSuscripcion, loading } = useSuscripciones();

  const { cancelarPlan, isCancel } = useCheckout();

  const { actualizarJwt } = useActualizarJwt();

  const claims = useMemo(() => decodeClaims(localStorage.getItem("token")), []);

  const [openDetalle, setOpenDetalle] = useState(false);

  const [modoCambio, setModoCambio] = useState(false);

  const [isSubSuccess, setIsSubSuccess] = useState(false);

  const [processingType, setProcessingType] = useState<ProcessingType>(null);

  /*
   * Se mantienen referencias actualizadas para
   * evitar que los efectos se repitan si las
   * funciones de los hooks cambian de identidad.
   */
  const obtenerSuscripcionRef = useRef(obtenerMiSuscripcion);

  const actualizarJwtRef = useRef(actualizarJwt);

  const userEmailRef = useRef(user?.sub ?? claims?.sub ?? "");

  useEffect(() => {
    obtenerSuscripcionRef.current = obtenerMiSuscripcion;
  }, [obtenerMiSuscripcion]);

  useEffect(() => {
    actualizarJwtRef.current = actualizarJwt;
  }, [actualizarJwt]);

  useEffect(() => {
    userEmailRef.current = user?.sub ?? claims?.sub ?? "";
  }, [user?.sub, claims?.sub]);

  /*
   * Consulta inicial de la suscripción.
   */
  useEffect(() => {
    void obtenerSuscripcionRef.current();
  }, []);

  /*
   * Detecta una activación o cancelación
   * completada desde los hooks correspondientes.
   */
  useEffect(() => {
    if (isSubSuccess) {
      setProcessingType("activation");
      return;
    }

    if (isCancel) {
      setProcessingType("cancellation");
    }
  }, [isSubSuccess, isCancel]);

  /*
   * Actualiza la suscripción y el JWT después
   * de una operación exitosa.
   */
  useEffect(() => {
    if (!processingType) {
      return;
    }

    let active = true;

    const timer = window.setTimeout(async () => {
      try {
        await obtenerSuscripcionRef.current();

        const email = userEmailRef.current.trim();

        if (email) {
          await actualizarJwtRef.current({
            email,
            updateJWT: true,
          });
        }

        if (!active) {
          return;
        }

        if (processingType === "cancellation") {
          toast.success(
            "Tu suscripción fue cancelada y seguirá activa hasta el final del periodo.",
          );
        } else {
          toast.success("Tu suscripción ya está activa.");
        }

        setModoCambio(false);
        setOpenDetalle(false);
      } catch (error) {
        console.error("Error al verificar la suscripción:", error);

        if (active) {
          toast.error("No fue posible verificar el estado de la suscripción.");
        }
      } finally {
        if (active) {
          setIsSubSuccess(false);
          setProcessingType(null);
        }
      }
    }, 1000);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [processingType]);

  const handleOpenDetails = useCallback(() => {
    setOpenDetalle(true);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setOpenDetalle(false);
  }, []);

  const handleOpenPlans = useCallback(() => {
    setOpenDetalle(false);
    setModoCambio(true);
  }, []);

  const handleReturnToCurrentPlan = useCallback(() => {
    setModoCambio(false);
  }, []);

  const showingCurrentPlan = Boolean(suscripcion) && !modoCambio;

  const showingAvailablePlans = !suscripcion || modoCambio;

  const processing = processingType !== null;

  /*
   * Durante una actualización posterior al
   * checkout se conserva la página y se muestra
   * el backdrop. El skeleton solo corresponde
   * a la carga inicial.
   */
  if (loading && !processing && !isSubSuccess && !isCancel) {
    return <PlanesPageSkeleton />;
  }

  const pageTitle = showingCurrentPlan ? "Mi plan" : "Planes disponibles";

  const pageDescription = showingCurrentPlan
    ? "Administra tu suscripción actual."
    : "Elige el plan que mejor se adapte a tu negocio.";

  return (
    <Box component="main" className={styles.page}>
      <Backdrop
        open={processing}
        className={styles.processingBackdrop}
        aria-live="assertive"
      >
        <CircularProgress
          size={52}
          thickness={4}
          className={[
            styles.processingProgress,
            processingType === "cancellation"
              ? styles.cancellationProgress
              : styles.activationProgress,
          ].join(" ")}
        />

        <Stack className={styles.processingContent}>
          <Typography component="p" className={styles.processingTitle}>
            {processingType === "cancellation"
              ? "Procesando cancelación"
              : "Activando tu suscripción"}
          </Typography>

          <Typography component="p" className={styles.processingDescription}>
            Estamos actualizando la información de tu cuenta.
          </Typography>
        </Stack>
      </Backdrop>

      <Box component="header" className={styles.hero}>
        <Box className={styles.heroIcon}>
          <MaterialSymbol
            icon={showingCurrentPlan ? "contract" : "rocket_launch"}
            size="large"
            filled={showingCurrentPlan}
          />
        </Box>

        <Typography component="h1" className={styles.title}>
          {pageTitle}
        </Typography>

        <Typography component="p" className={styles.description}>
          {pageDescription}
        </Typography>
      </Box>

      <Box className={styles.content}>
        {suscripcion && !modoCambio && (
          <Box
            component="section"
            className={styles.currentPlanContainer}
            aria-label="Suscripción actual"
          >
            {(!isMobile || !openDetalle) && (
              <>
                <PlanCard
                  nombre={suscripcion.plan.nombre}
                  tipo={suscripcion.plan.tipo}
                  dias={calcularDiasRestantesDesdeHoy(suscripcion.fechaFin)}
                  maxNegocios={suscripcion.plan.maxNegocios}
                  maxProductos={suscripcion.plan.maxProductos}
                  maxFotos={suscripcion.plan.maxFotos}
                  precio={suscripcion.plan.precio}
                  esActivo={suscripcion.activa}
                  isMultiUsuario={suscripcion.plan.isMultiUsuario}
                  onCancelar={cancelarPlan}
                  onVerDetalle={handleOpenDetails}
                  tieneAnalytics={suscripcion.plan.tieneAnalytics}
                  coloresPersonalizados={suscripcion.plan.coloresPersonalizados}
                  soportePrioritario={suscripcion.plan.tieneBadge}
                  permiteCatalogo={suscripcion.plan.permiteCatalogo}
                  claims={claims}
                  badgeTexto={suscripcion.plan.badgeTexto || ""}
                />

                <Button
                  type="button"
                  fullWidth
                  className={styles.changePlanButton}
                  onClick={handleOpenPlans}
                  startIcon={<MaterialSymbol icon="swap_horiz" size="small" />}
                >
                  Cambiar plan
                </Button>
              </>
            )}

            <SuscripcionDetalleModal
              open={openDetalle}
              onClose={handleCloseDetails}
              suscripcion={suscripcion}
            />
          </Box>
        )}

        {showingAvailablePlans && (
          <Box
            component="section"
            className={styles.availablePlansSection}
            aria-label="Planes disponibles"
          >
            {suscripcion && (
              <Box className={styles.returnButtonContainer}>
                <Button
                  type="button"
                  className={styles.returnButton}
                  onClick={handleReturnToCurrentPlan}
                  startIcon={<MaterialSymbol icon="arrow_back" size="small" />}
                >
                  Volver a mi plan
                </Button>
              </Box>
            )}

            <PlanesUserList setIsSubSuccess={setIsSubSuccess} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PlanesPage;
