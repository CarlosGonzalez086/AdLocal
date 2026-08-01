import {
  Alert,
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState, type FC } from "react";
import { jwtDecode } from "jwt-decode";
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

import {
  productosServiciosApi,
  type ProductoServicioDto,
} from "../../../services/productosServiciosApi";

import type { JwtClaims } from "../../../services/auth.api";

import styles from "../../../styles/PreviewPage.module.css";

interface SectionHeaderProps {
  icon: string;
  title: string;
  description?: string;
  iconFilled?: boolean;
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

const SectionHeader: FC<SectionHeaderProps> = ({
  icon,
  title,
  description,
  iconFilled = false,
}) => {
  return (
    <Box className={styles.sectionHeader}>
      <Box className={styles.sectionHeaderIcon}>
        <MaterialSymbol icon={icon} size="medium" filled={iconFilled} />
      </Box>

      <Box className={styles.sectionHeaderContent}>
        <Typography component="h2" className={styles.sectionTitle}>
          {title}
        </Typography>

        {description && (
          <Typography component="p" className={styles.sectionDescription}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default function PreviewPage() {
  const token = localStorage.getItem("token");

  const claims = useMemo(() => decodeClaims(token), [token]);

  const { comercio, loading, comercios, getAllComerciosByUser } = useComercio();

  const { contarPorCodigo } = useUsoCodigoReferido();

  const { actualizarJwt } = useActualizarJwt();

  const [totalUsoCodigo, setTotalUsoCodigo] = useState(0);

  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [verDetalle, setVerDetalle] = useState(false);

  const [aplicoBeneficio, setAplicoBeneficio] = useState(false);

  const isProOrBusiness =
    claims?.planTipo === "PRO" || claims?.planTipo === "BUSINESS";

  const isBasicOrFree =
    claims?.planTipo === "FREE" || claims?.planTipo === "BASIC";

  const isColaborador = claims?.rol === "Colaborador";

  const comercioSeleccionadoId = useMemo(() => {
    if (comercios.length > 0) {
      return comercios[0].id;
    }

    if (comercio?.id) {
      return comercio.id;
    }

    return undefined;
  }, [comercios, comercio?.id]);

  const [selectedId, setSelectedId] = useState<number | undefined>(
    comercioSeleccionadoId,
  );

  const {
    data: stats,
    loading: loadingStats,
    error: statsError,
  } = useComercioVisitasStats(selectedId);

  const listarPorComercio = useCallback(async (idComercio: number) => {
    try {
      setLoadingProducts(true);
      setProductos([]);

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

  /*
   * Actualizar el comercio seleccionado cuando
   * la lista termina de cargarse.
   */
  useEffect(() => {
    if (!comercioSeleccionadoId) {
      setSelectedId(undefined);

      return;
    }

    const selectedCommerceExists = comercios.some(
      (item) => item.id === selectedId,
    );

    if (selectedId === undefined || !selectedCommerceExists) {
      setSelectedId(comercioSeleccionadoId);
    }
  }, [comercioSeleccionadoId, comercios, selectedId]);

  /*
   * Los productos son necesarios en la vista
   * detallada de planes FREE, BASIC y colaboradores.
   */
  useEffect(() => {
    if (!comercio?.id || (!isBasicOrFree && !isColaborador)) {
      return;
    }

    void listarPorComercio(comercio.id);
  }, [comercio?.id, isBasicOrFree, isColaborador, listarPorComercio]);

  /*
   * Consultar usos del código referido.
   */
  useEffect(() => {
    const codigoReferido = claims?.codigoReferido;

    if (!codigoReferido) {
      setTotalUsoCodigo(0);

      return;
    }

    void contarPorCodigo(codigoReferido)
      .then((total) => {
        setTotalUsoCodigo(total);
      })
      .catch((error) => {
        console.error("Error al consultar el código referido:", error);

        setTotalUsoCodigo(0);
      });
  }, [claims?.codigoReferido, contarPorCodigo]);

  /*
   * Los planes PRO y BUSINESS pueden administrar
   * varios comercios.
   */
  useEffect(() => {
    if (claims?.rol !== "Comercio" || !isProOrBusiness) {
      return;
    }

    const maxNegocios = Number(claims.maxNegocios) || 1;

    void getAllComerciosByUser(0, maxNegocios);
  }, [
    claims?.rol,
    claims?.maxNegocios,
    isProOrBusiness,
    getAllComerciosByUser,
  ]);

  /*
   * Renovar el JWT después de aplicar un beneficio.
   */
  useEffect(() => {
    if (!aplicoBeneficio || !claims?.sub) {
      return;
    }

    const refreshToken = async () => {
      try {
        await actualizarJwt({
          email: String(claims.sub),
          updateJWT: true,
        });
      } catch (error) {
        console.error("No fue posible actualizar el JWT:", error);
      } finally {
        setAplicoBeneficio(false);
      }
    };

    void refreshToken();
  }, [aplicoBeneficio, claims?.sub, actualizarJwt]);

  if (loading) {
    return (
      <Box
        className={styles.loadingContainer}
        aria-busy="true"
        aria-live="polite"
      >
        <Skeleton variant="rounded" className={styles.headerSkeleton} />

        <Box className={styles.cardsSkeletonGrid}>
          {[1, 2, 3].map((item) => (
            <Skeleton
              key={item}
              variant="rounded"
              className={styles.cardSkeleton}
            />
          ))}
        </Box>

        <Typography component="p" className={styles.loadingText}>
          Cargando información de tus comercios...
        </Typography>
      </Box>
    );
  }

  if (!comercio || comercio.id === 0) {
    return (
      <Box className={styles.emptyCommerce} aria-live="polite">
        <Box className={styles.emptyCommerceIcon}>
          <MaterialSymbol icon="storefront" size="large" />
        </Box>

        <Typography component="h1" className={styles.emptyCommerceTitle}>
          Aún no tienes un comercio
        </Typography>

        <Typography component="p" className={styles.emptyCommerceDescription}>
          Registra tu primer comercio para comenzar a publicar tus productos,
          servicios y datos de contacto.
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="main" className={styles.page}>
      {claims?.codigoReferido && (
        <Box component="section" className={styles.referralSection}>
          <CodigoReferido
            codigoReferido={claims.codigoReferido}
            totalUsoCodigo={totalUsoCodigo}
            setAplicoBeneficio={setAplicoBeneficio}
            usoTotalReferidos={claims.RedeemRewards ?? ""}
          />

          <Divider className={styles.sectionDivider} />
        </Box>
      )}

      {isProOrBusiness && !isColaborador && (
        <Stack component="section" className={styles.mainSections}>
          <Box component="section" className={styles.previewSection}>
            <SectionHeader
              icon="visibility"
              title="Vista previa de comercios"
              description="Consulta cómo se muestran tus negocios en la plataforma pública."
            />

            {comercios.length === 0 ? (
              <Box className={styles.emptyCommerceList}>
                <MaterialSymbol icon="storefront" size="large" />

                <Typography
                  component="p"
                  className={styles.emptyCommerceListText}
                >
                  No hay comercios disponibles para mostrar.
                </Typography>
              </Box>
            ) : (
              <Box className={styles.commerceGrid}>
                {comercios.map((commerceItem) => (
                  <Box
                    key={commerceItem.id}
                    className={styles.commerceGridItem}
                  >
                    <ComercioCard comercio={commerceItem} />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Divider className={styles.sectionDivider} />

          <Box component="section" className={styles.statsSection}>
            <SectionHeader
              icon="monitoring"
              title="Estadísticas de visitas"
              description="Analiza el alcance y las visitas que reciben tus comercios."
            />

            <Box className={styles.selectorContainer}>
              <ComercioSelector
                comercios={comercios}
                value={selectedId ?? 0}
                onChange={setSelectedId}
              />
            </Box>

            {loadingStats && (
              <Stack className={styles.statsSkeletons}>
                <Skeleton variant="rounded" className={styles.statsSkeleton} />

                <Skeleton variant="rounded" className={styles.statsSkeleton} />
              </Stack>
            )}

            {statsError && (
              <Alert
                severity="error"
                variant="outlined"
                className={styles.statsError}
                icon={<MaterialSymbol icon="warning" size="medium" />}
              >
                {statsError}
              </Alert>
            )}

            {stats && !loadingStats && (
              <Box className={styles.chartsContainer}>
                <ComercioVisitasCharts
                  ultimaSemana={stats.ultimaSemana}
                  ultimosTresMeses={stats.ultimosTresMeses}
                />
              </Box>
            )}
          </Box>
        </Stack>
      )}

      {(isBasicOrFree || isColaborador) && (
        <Box component="section" className={styles.basicSection}>
          {!verDetalle ? (
            <>
              <SectionHeader
                icon="visibility"
                title="Vista previa"
                description="Consulta cómo se muestra tu comercio a los usuarios."
              />

              <Divider className={styles.basicSectionDivider} />

              <Box className={styles.basicCardContainer}>
                <Box
                  component="button"
                  type="button"
                  className={styles.basicPreviewButton}
                  onClick={() => setVerDetalle(true)}
                  aria-label={`Abrir vista detallada de ${comercio.nombre}`}
                >
                  <ComercioCardBasico comercio={comercio} />
                </Box>

                <Typography component="p" className={styles.previewHint}>
                  <MaterialSymbol icon="touch_app" size="small" />

                  <span>
                    Selecciona la tarjeta para ver el detalle completo.
                  </span>
                </Typography>
              </Box>
            </>
          ) : (
            <Box className={styles.detailSection}>
              <Box className={styles.detailActions}>
                <Button
                  type="button"
                  variant="outlined"
                  className={styles.backButton}
                  onClick={() => setVerDetalle(false)}
                  startIcon={<MaterialSymbol icon="arrow_back" size="small" />}
                >
                  Volver
                </Button>
              </Box>

              <Box className={styles.detailContainer}>
                <ComercioDetalle
                  comercio={comercio}
                  productos={productos}
                  loadingProducts={loadingProducts}
                />
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
