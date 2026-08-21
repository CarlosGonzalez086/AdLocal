import { Skeleton } from "@mui/material";

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
import { ConfirmarSuscripcionModalV3 } from "../../User/Pages/Plan/ConfirmarSuscripcionModalV3";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import { PlanCard } from "./PlanCard";
import type { PlanCreateDto } from "../../services/planPublicApi";
import type { JwtPayload } from "../../User/Auth/PrivateRouteUsuario";

interface Props {
  setIsSubSuccess: Dispatch<SetStateAction<boolean>>;
  user: JwtPayload | null;
}


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
    <div className="plansUserLoading" aria-live="polite" aria-busy="true">
      <div className="row g-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="col-12 col-md-6 col-xl-4">
            <div className="plansUserLoadingItem">
              <Skeleton variant="rounded" className="plansUserCardSkeleton" />

              <Skeleton variant="rounded" className="plansUserActionSkeleton" />
            </div>
          </div>
        ))}
      </div>

      <p className="plansUserLoadingText fz-h4 fw-regular mb-0">
        Consultando los planes disponibles...
      </p>
    </div>
  );
};


const EmptyPlans = () => {
  return (
    <div
      className="plansUserEmptyState"
      aria-labelledby="empty-user-plans-title"
    >
      <div className="plansUserEmptyIcon">
        <MaterialSymbol icon="inventory_2" size="large" />
      </div>

      <h2
        id="empty-user-plans-title"
        className="plansUserEmptyTitle fz-h2 fw-bold mb-2"
      >
        No hay planes disponibles
      </h2>

      <p className="plansUserEmptyDescription fz-h4 fw-regular mb-0">
        Por el momento no existen planes de pago disponibles. Intenta nuevamente
        más tarde.
      </p>
    </div>
  );
};


export const PlanesUserList = ({ setIsSubSuccess, user }: Props) => {
  const { planesUser, loading, listAllPlanesUser } = usePlanes();

  const [openModal, setOpenModal] = useState(false);

  const [planSeleccionado, setPlanSeleccionado] =
    useState<PlanCreateDto | null>(null);



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
      <div
        className="plansUserContainer"
        aria-label="Planes de suscripción disponibles"
      >
        <div className="row g-4">
          {planesDisponibles.map((plan) => (
            <div key={plan.id} className="col-12 col-md-6 col-xl-4">
              <div className="plansUserItem h-100">
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
                  user={user}
                  badgeTexto={plan.badgeTexto || ""}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

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
