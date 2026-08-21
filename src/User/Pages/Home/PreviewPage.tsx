import { Alert, Button, Skeleton } from "@mui/material";

import { useCallback, useEffect, useState, type FC } from "react";

import Swal from "sweetalert2";

import { useActualizarJwt } from "../../../hooks/useActualizarJwt";
import { useComercio } from "../../../hooks/useComercio";
import { useComercioVisitasStats } from "../../../hooks/useComercioVisitasStats";
import { useUsoCodigoReferido } from "../../../hooks/useUsoCodigoReferido";

import CodigoReferido from "../../../components/User/CodigoReferido";
import ComercioCard from "../../../components/Comercio/ComercioCard";
import ComercioCardBasico from "../../../components/Comercio/ComercioCardBasico";
import ComercioDetalle from "../../../components/Comercio/ComercioDetalle";
import ComercioSelector from "../../../components/Comercio/ComercioSelector";
import ComercioVisitasCharts from "../../../components/Comercio/ComercioVisitasCharts";

import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import type { ProductoServicioDto } from "../../../types/User/productosServicios";
import type { JwtPayload } from "../../Auth/PrivateRouteUsuario";

import { productosServiciosApi } from "../../../services/productosServiciosApi";
import { ResumenVentasComercio } from "./Components/ResumenVentasComercio";

/* ============================================
   TYPES
============================================ */

interface SectionHeaderProps {
  icon: string;
  title: string;
  description?: string;
  iconFilled?: boolean;
}

interface PreviewPageProps {
  user: JwtPayload | null;
}

/* ============================================
   SECTION HEADER
============================================ */

const SectionHeader: FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
  iconFilled = false,
}) => {
  return (
    <div className="divHeader d-flex align-items-start gap-3">
      <div className="divHeaderIcon flex-shrink-0">
        <MaterialSymbol icon={icon} size="medium" filled={iconFilled} />
      </div>

      <div className="divHeaderContent flex-grow-1">
        <h2 className="divTitle fz-h2 fw-bold mb-1">{title}</h2>

        {description && (
          <p className="divDescription fz-h4 fw-regular mb-0">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

/* ============================================
   COMPONENT
============================================ */

export default function PreviewPage({ user }: PreviewPageProps) {
  const { comercio, loading, comercios, getAllComerciosByUser } = useComercio();

  const { contarPorCodigo } = useUsoCodigoReferido();

  const { actualizarJwt } = useActualizarJwt();

  /* ============================================
     STATE
  ============================================ */

  const [totalUsoCodigo, setTotalUsoCodigo] = useState(0);

  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [verDetalle, setVerDetalle] = useState(false);

  const [aplicoBeneficio, setAplicoBeneficio] = useState(false);

  /* ============================================
     USER / PLAN
  ============================================ */

  const rol = user?.rol ?? "";

  const planTipo = user?.planTipo?.toUpperCase() ?? "";

  const isColaborador = rol === "Colaborador";

  const isComercio = rol === "Comercio";

  const isProOrBusiness = planTipo === "PRO" || planTipo === "BUSINESS";

  const isBasicOrFree = planTipo === "FREE" || planTipo === "BASIC";

  /* ============================================
     COMERCIO SELECCIONADO
  ============================================ */

  const comercioSeleccionadoId = comercios[0]?.id ?? comercio?.id ?? undefined;

  const [selectedId, setSelectedId] = useState<number | undefined>(
    comercioSeleccionadoId,
  );

  /* ============================================
     STATS
  ============================================ */

  const {
    data: stats,
    loading: loadingStats,
    error: statsError,
  } = useComercioVisitasStats(selectedId);

  /* ============================================
     PRODUCTOS
  ============================================ */

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

          confirmButtonColor: "#007AFF",
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

        confirmButtonColor: "#007AFF",
      });
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  /* ============================================
     COMERCIO SELECCIONADO
  ============================================ */

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

  /* ============================================
     PRODUCTOS BASIC / FREE / COLABORADOR
  ============================================ */

  useEffect(() => {
    const idComercio = comercio?.id;

    if (!idComercio) {
      return;
    }

    if (!isBasicOrFree && !isColaborador) {
      return;
    }

    void listarPorComercio(idComercio);
  }, [comercio?.id, isBasicOrFree, isColaborador, listarPorComercio]);

  /* ============================================
     CÓDIGO REFERIDO
  ============================================ */

  useEffect(() => {
    const codigoReferido = user?.codigoReferido;

    if (!codigoReferido) {
      setTotalUsoCodigo(0);

      return;
    }

    const obtenerTotalReferidos = async () => {
      try {
        const total = await contarPorCodigo(codigoReferido);

        setTotalUsoCodigo(total);
      } catch (error) {
        console.error("Error al consultar el código referido:", error);

        setTotalUsoCodigo(0);
      }
    };

    void obtenerTotalReferidos();
  }, [user?.codigoReferido, contarPorCodigo]);

  /* ============================================
     COMERCIOS PRO / BUSINESS
  ============================================ */

  useEffect(() => {
    if (!isComercio || !isProOrBusiness) {
      return;
    }

    const maxNegocios = Math.max(Number(user?.maxNegocios) || 1, 1);

    void getAllComerciosByUser(0, maxNegocios);
  }, [isComercio, isProOrBusiness, user?.maxNegocios, getAllComerciosByUser]);

  /* ============================================
     ACTUALIZAR JWT
  ============================================ */

  useEffect(() => {
    if (!aplicoBeneficio || !user?.sub) {
      return;
    }

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

  /* ============================================
     LOADING
  ============================================ */

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

  /* ============================================
     SIN COMERCIO
  ============================================ */

  if (!comercio || comercio.id === 0) {
    return (
      <div className="emptyCommerce" aria-live="polite">
        <div className="emptyCommerceIcon">
          <MaterialSymbol icon="storefront" size="large" />
        </div>

        <h1 className="emptyCommerceTitle fz-h1 fw-bold mb-2">
          Aún no tienes un comercio
        </h1>

        <p className="emptyCommerceDescription fz-h4 fw-regular mb-0">
          Registra tu primer comercio para comenzar a publicar tus productos,
          servicios y datos de contacto.
        </p>
      </div>
    );
  }

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div className="commercePage">
      <div className="mb-4">
        <ResumenVentasComercio />
      </div>

      {/* ====================================
          REFERIDOS
      ==================================== */}
{/* 
      {user?.codigoReferido && (
        <div className="referralSection">
          <CodigoReferido
            codigoReferido={user.codigoReferido}
            totalUsoCodigo={totalUsoCodigo}
            setAplicoBeneficio={setAplicoBeneficio}
            usoTotalReferidos={user.RedeemRewards ?? ""}
          />

          <hr className="divDivider" />
        </div>
      )} */}

      {/* ====================================
          PRO / BUSINESS
      ==================================== */}

      {isProOrBusiness && !isColaborador && (
        <div className="mainSections d-flex flex-column gap-4">
          {/* PREVIEW */}

          <div className="previewSection">
            <SectionHeader
              icon="visibility"
              title="Vista previa de comercios"
              description="Consulta cómo se muestran tus negocios en la plataforma pública."
            />

            {comercios.length === 0 ? (
              <div className="emptyCommerceList">
                <MaterialSymbol icon="storefront" size="large" />

                <p className="emptyCommerceListText fz-h4 fw-regular mb-0">
                  No hay comercios disponibles para mostrar.
                </p>
              </div>
            ) : (
              <div className="row g-4 commerceGrid">
                {comercios.map((commerceItem) => (
                  <div
                    key={commerceItem.id}
                    className="col-12 col-md-6 col-xl-4"
                  >
                    <div className="commerceGridItem h-100">
                      <ComercioCard comercio={commerceItem} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="divDivider" />

          {/* STATS */}

          <div className="statsSection">
            <SectionHeader
              icon="monitoring"
              title="Estadísticas de visitas"
              description="Analiza el alcance y las visitas que reciben tus comercios."
            />

            <div className="selectorContainer">
              <ComercioSelector
                comercios={comercios}
                value={selectedId ?? 0}
                onChange={setSelectedId}
              />
            </div>

            {loadingStats && (
              <div className="statsSkeletons d-flex flex-column gap-3">
                <Skeleton variant="rounded" className="statsSkeleton" />

                <Skeleton variant="rounded" className="statsSkeleton" />
              </div>
            )}

            {statsError && (
              <Alert
                severity="error"
                variant="outlined"
                className="statsError fz-h4 fw-medium"
                icon={<MaterialSymbol icon="warning" size="medium" />}
              >
                {statsError}
              </Alert>
            )}

            {stats && !loadingStats && (
              <div className="chartsContainer">
                <ComercioVisitasCharts
                  ultimaSemana={stats.ultimaSemana}
                  ultimosTresMeses={stats.ultimosTresMeses}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================
          BASIC / FREE / COLABORADOR
      ==================================== */}

      {(isBasicOrFree || isColaborador) && (
        <div className="basicSection">
          {!verDetalle ? (
            <>
              <SectionHeader
                icon="visibility"
                title="Vista previa"
                description="Consulta cómo se muestra tu comercio a los usuarios."
              />

              <hr className="basicSectionDivider" />

              <div className="basicCardContainer">
                <Button
                  type="button"
                  className="basicPreviewButton"
                  onClick={() => setVerDetalle(true)}
                  aria-label={`Abrir vista detallada de ${comercio.nombre}`}
                >
                  <ComercioCardBasico comercio={comercio} />
                </Button>

                <p className="previewHint d-flex align-items-center justify-content-center gap-2 fz-h5 fw-medium mb-0">
                  <MaterialSymbol icon="touch_app" size="small" />

                  <span>
                    Selecciona la tarjeta para ver el detalle completo.
                  </span>
                </p>
              </div>
            </>
          ) : (
            <div className="detailSection">
              <div className="detailActions">
                <Button
                  type="button"
                  variant="outlined"
                  className="backButton fz-h4 fw-semibold"
                  onClick={() => setVerDetalle(false)}
                  startIcon={<MaterialSymbol icon="arrow_back" size="small" />}
                >
                  Volver
                </Button>
              </div>

              <div className="detailContainer">
                <ComercioDetalle
                  comercio={comercio}
                  productos={productos}
                  loadingProducts={loadingProducts}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
