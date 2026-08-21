import {
  Backdrop,
  Button,
  CircularProgress,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import toast from "react-hot-toast";
import { PlanCard } from "../../../components/Plan/PlanCard";
import { PlanesUserList } from "../../../components/Plan/PlanesUserList";
import { SuscripcionDetalleModal } from "../../../components/Suscripcion/SuscripcionDetalleModal";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import { useActualizarJwt } from "../../../hooks/useActualizarJwt";
import { useCheckout } from "../../../hooks/useCheckout";
import { useSuscripciones } from "../../../hooks/useSuscripciones";
import { calcularDiasRestantesDesdeHoy } from "../../../utils/generalsFunctions";
import type { JwtPayload } from "../../Auth/PrivateRouteUsuario";
import { useCallback, useEffect, useRef, useState } from "react";

type ProcessingType = "activation" | "cancellation" | null;

const PlanesPageSkeleton = () => {
  return (
    <div className="planesPage planesLoadingPage" aria-live="polite">
      <div className="container-fluid">
        <div className="planesLoadingHeader">
          <Skeleton variant="rounded" className="planesTitleSkeleton" />

          <Skeleton variant="rounded" className="planesSubtitleSkeleton" />
        </div>

        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="planesLoadingCardContainer">
              <Skeleton variant="rounded" className="planesCardSkeleton" />

              <Skeleton variant="rounded" className="planesButtonSkeleton" />
            </div>
          </div>
        </div>

        <p className="planesLoadingText fz-h4 fw-regular mb-0">
          Cargando la información de tu plan...
        </p>
      </div>
    </div>
  );
};

interface PlanesPageProps {
  user: JwtPayload | null;
}
const PlanesPage = ({ user }: PlanesPageProps) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { suscripcion, obtenerMiSuscripcion, loading } = useSuscripciones();

  const { cancelarPlan, isCancel } = useCheckout();

  const { actualizarJwt } = useActualizarJwt();

  const [openDetalle, setOpenDetalle] = useState(false);

  const [modoCambio, setModoCambio] = useState(false);

  const [isSubSuccess, setIsSubSuccess] = useState(false);

  const [processingType, setProcessingType] = useState<ProcessingType>(null);

  const obtenerSuscripcionRef = useRef(obtenerMiSuscripcion);

  const actualizarJwtRef = useRef(actualizarJwt);

  const userEmailRef = useRef(user?.sub ?? user?.sub ?? "");

  useEffect(() => {
    obtenerSuscripcionRef.current = obtenerMiSuscripcion;
  }, [obtenerMiSuscripcion]);

  useEffect(() => {
    actualizarJwtRef.current = actualizarJwt;
  }, [actualizarJwt]);

  useEffect(() => {
    userEmailRef.current = user?.sub ?? user?.sub ?? "";
  }, [user?.sub, user?.sub]);

  useEffect(() => {
    void obtenerSuscripcionRef.current();
  }, []);

  useEffect(() => {
    if (isSubSuccess) {
      setProcessingType("activation");

      return;
    }

    if (isCancel) {
      setProcessingType("cancellation");
    }
  }, [isSubSuccess, isCancel]);

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

  if (loading && !processing && !isSubSuccess && !isCancel) {
    return <PlanesPageSkeleton />;
  }

  const pageTitle = showingCurrentPlan ? "Mi plan" : "Planes disponibles";

  const pageDescription = showingCurrentPlan
    ? "Administra tu suscripción actual."
    : "Elige el plan que mejor se adapte a tu negocio.";

  return (
    <div className="planesPage">
      <Backdrop
        open={processing}
        className="planesProcessingBackdrop"
        aria-live="assertive"
      >
        <div
          className="planesProcessingContainer"
          role="status"
          aria-busy="true"
        >
          <div className="planesProcessingIconContainer">
            <CircularProgress
              size={52}
              thickness={4}
              className={[
                "planesProcessingProgress",
                processingType === "cancellation"
                  ? "planesCancellationProgress"
                  : "planesActivationProgress",
              ].join(" ")}
            />
          </div>

          <div className="planesProcessingContent">
            <p className="planesProcessingTitle fz-h3 fw-semibold mb-1">
              {processingType === "cancellation"
                ? "Procesando cancelación"
                : "Activando tu suscripción"}
            </p>

            <p className="planesProcessingDescription fz-h5 fw-regular mb-0">
              Estamos actualizando la información de tu cuenta.
            </p>
          </div>
        </div>
      </Backdrop>

      <div className="container-fluid">
        <div className="planesHero">
          <div className="planesHeroIcon flex-shrink-0">
            <MaterialSymbol
              icon={showingCurrentPlan ? "contract" : "rocket_launch"}
              size="large"
              filled={showingCurrentPlan}
            />
          </div>

          <div className="planesHeroContent">
            <h1 className="planesTitle fz-h1 fw-bold mb-1">{pageTitle}</h1>

            <p className="planesDescription fz-h4 fw-regular mb-0">
              {pageDescription}
            </p>
          </div>
        </div>

        <div className="d-flex justify-content-center align-items-center">
          {suscripcion && !modoCambio && (
            <div className="w-100" aria-label="Suscripción actual">
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
                    coloresPersonalizados={
                      suscripcion.plan.coloresPersonalizados
                    }
                    soportePrioritario={suscripcion.plan.tieneBadge}
                    permiteCatalogo={suscripcion.plan.permiteCatalogo}
                    user={user}
                    badgeTexto={suscripcion.plan.badgeTexto || ""}
                  />

                  <div className="planesChangePlanButtonContainer">
                    <Button
                      type="button"
                      fullWidth
                      variant="outlined"
                      className="btn-adlocal fz-h4 fw-semibold"
                      onClick={handleOpenPlans}
                      startIcon={
                        <MaterialSymbol icon="swap_horiz" size="small" />
                      }
                    >
                      Cambiar plan
                    </Button>
                  </div>
                </>
              )}

              <SuscripcionDetalleModal
                open={openDetalle}
                onClose={handleCloseDetails}
                suscripcion={suscripcion}
              />
            </div>
          )}

          {showingAvailablePlans && (
            <div
              className="planesAvailablePlansSection"
              aria-label="Planes disponibles"
            >
              {suscripcion && (
                <div className="planesReturnButtonContainer">
                  <Button
                    type="button"
                    variant="outlined"
                    className="btn-adlocal btn-adlocal--ghost fz-h4 fw-semibold"
                    onClick={handleReturnToCurrentPlan}
                    startIcon={
                      <MaterialSymbol icon="arrow_back" size="small" />
                    }
                  >
                    Volver a mi plan
                  </Button>
                </div>
              )}

              <PlanesUserList setIsSubSuccess={setIsSubSuccess} user={user} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlanesPage;
