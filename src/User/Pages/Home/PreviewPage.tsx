import { Skeleton } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import Swal from "../../../utils/sweetalert";

import { useActualizarJwt } from "../../../hooks/useActualizarJwt";
import { useComercio } from "../../../hooks/useComercio";
import { useComercioVisitasStats } from "../../../hooks/useComercioVisitasStats";
import { productosServiciosApi } from "../../../services/productosServiciosApi";
import type { ProductoServicioDto } from "../../../types/User/productosServicios";
import type { JwtPayload } from "../../Auth/PrivateRouteUsuario";

import { EmptyCommerceState } from "./Components/EmptyCommerceState";
import { PreviewCommerceBasic } from "./Components/PreviewCommerceBasic";
import { PreviewCommercePro } from "./Components/PreviewCommercePro";
import { ResumenVentasComercio } from "./Components/ResumenVentasComercio";

interface PreviewPageProps {
  user: JwtPayload | null;
}

export default function PreviewPage({ user }: PreviewPageProps) {
  const { comercio, loading, comercios, getAllComerciosByUser } = useComercio();
  const { actualizarJwt } = useActualizarJwt();

  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [verDetalle, setVerDetalle] = useState(false);
  const [aplicoBeneficio, setAplicoBeneficio] = useState(false);

  const rol = user?.rol ?? "";
  const planTipo = user?.planTipo?.toUpperCase() ?? "";
  const isColaborador = rol === "Colaborador";
  const isComercio = rol === "Comercio";
  const isProOrBusiness = planTipo === "PRO" || planTipo === "BUSINESS";
  const isBasicOrFree = planTipo === "FREE" || planTipo === "BASIC";

  const comercioSeleccionadoId = comercios[0]?.id ?? comercio?.id ?? undefined;
  const [selectedId, setSelectedId] = useState<number | undefined>(
    comercioSeleccionadoId,
  );

  const {
    data: stats,
    loading: loadingStats,
    error: statsError,
  } = useComercioVisitasStats(selectedId);

  const listarPorComercio = useCallback(async (idComercio: number) => {
    setLoadingProducts(true);
    setProductos([]);

    try {
      const { data } = await productosServiciosApi.getAllByComercio(idComercio);

      if (data.codigo !== "200") {
        await Swal.fire({
          icon: "error",
          title: "No se pudieron cargar los productos",
          text: data.mensaje || "Ocurrió un error al consultar los productos.",
        });
        return;
      }

      setProductos(data.respuesta ?? []);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      setProductos([]);
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "No fue posible cargar los productos del comercio.",
      });
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (!comercioSeleccionadoId) {
      setSelectedId(undefined);
      return;
    }

    const selectedCommerceExists = comercios.some(
      (item) => item.id === selectedId,
    );

    if (!selectedCommerceExists) {
      setSelectedId(comercioSeleccionadoId);
    }
  }, [comercioSeleccionadoId, comercios, selectedId]);

  useEffect(() => {
    const idComercio = comercio?.id;
    if (!idComercio) return;
    if (!isBasicOrFree && !isColaborador) return;

    void listarPorComercio(idComercio);
  }, [comercio?.id, isBasicOrFree, isColaborador, listarPorComercio]);

  useEffect(() => {
    if (!isComercio || !isProOrBusiness) return;
    const maxNegocios = Math.max(Number(user?.maxNegocios) || 1, 1);
    void getAllComerciosByUser(0, maxNegocios);
  }, [isComercio, isProOrBusiness, user?.maxNegocios, getAllComerciosByUser]);

  useEffect(() => {
    if (!aplicoBeneficio || !user?.sub) return;

    const actualizarToken = async () => {
      try {
        await actualizarJwt({
          email: user.sub,
          updateJWT: true,
        });
      } catch (error) {
        console.error("No fue posible actualizar el JWT:", error);
      } finally {
        setAplicoBeneficio(false);
      }
    };

    void actualizarToken();
  }, [aplicoBeneficio, user?.sub, actualizarJwt]);

  if (loading) {
    return (
      <div className="loadingContainer" aria-busy="true" aria-live="polite">
        <Skeleton variant="rounded" className="headerSkeleton" />
        <div className="cardsSkeletonGrid">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} variant="rounded" className="cardSkeleton" />
          ))}
        </div>
        <p className="loadingText fz-h4 fw-medium mb-0">
          Cargando información de tus comercios...
        </p>
      </div>
    );
  }

  if (!comercio || comercio.id === 0) {
    return <EmptyCommerceState />;
  }

  return (
    <div className="commercePage">
      <div className="mb-4">
        <ResumenVentasComercio />
      </div>

      {isProOrBusiness && !isColaborador && (
        <PreviewCommercePro
          comercios={comercios}
          selectedId={selectedId}
          onSelectCommerce={setSelectedId}
          stats={stats}
          loadingStats={loadingStats}
          statsError={statsError}
        />
      )}

      {(isBasicOrFree || isColaborador) && (
        <PreviewCommerceBasic
          comercio={comercio}
          productos={productos}
          loadingProducts={loadingProducts}
          verDetalle={verDetalle}
          onSetVerDetalle={setVerDetalle}
        />
      )}
    </div>
  );
}
