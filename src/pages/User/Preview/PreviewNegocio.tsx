import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { useComercio } from "../../../hooks/useComercio";

import ComercioDetalle from "../../../components/Comercio/ComercioDetalle";
import ButtonBack from "../../../components/ButtonBack";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import {
  productosServiciosApi,
  type ProductoServicioDto,
} from "../../../services/productosServiciosApi";

import styles from "../../../styles/PreviewNegocio.module.css";

export function PreviewNegocio() {
  const { id } = useParams<{
    id: string;
  }>();

  const { comercioPage, cargarPorId, loading } = useComercio();

  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);

  const comercioId = useMemo(() => {
    if (!id) {
      return null;
    }

    const parsedId = Number(id);

    if (!Number.isInteger(parsedId) || parsedId <= 0) {
      return null;
    }

    return parsedId;
  }, [id]);

  const listarPorComercio = useCallback(async (idComercio: number) => {
    try {
      setLoadingProducts(true);
      setProductos([]);

      const { data } = await productosServiciosApi.getAllByComercio(idComercio);

      if (data.codigo !== "200") {
        const errorMessage =
          data.mensaje || "No fue posible cargar los productos y servicios.";

        setProductos([]);

        await Swal.fire({
          icon: "error",
          title: "No se pudieron cargar los productos",
          text: errorMessage,
          confirmButtonText: "Aceptar",
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
        text: "Ocurrió un error inesperado al cargar los productos y servicios.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#007AFF",
      });
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  const cargarPreview = useCallback(async () => {
    if (!comercioId) {
      setPageError("El identificador del comercio no es válido.");

      setProductos([]);

      return;
    }

    try {
      setPageError(null);

      await Promise.all([
        cargarPorId(comercioId),
        listarPorComercio(comercioId),
      ]);
    } catch (error) {
      console.error("Error al cargar la vista previa:", error);

      setPageError("No fue posible cargar la información del comercio.");
    }
  }, [comercioId, cargarPorId, listarPorComercio]);

  useEffect(() => {
    void cargarPreview();
  }, [cargarPreview]);

  if (loading) {
    return (
      <Box
        component="main"
        className={styles.loadingPage}
        aria-busy="true"
        aria-live="polite"
      >
        <Paper elevation={0} className={styles.loadingCard}>
          <Box className={styles.loadingIconContainer}>
            <CircularProgress
              size={48}
              thickness={4.5}
              className={styles.loadingProgress}
            />
          </Box>

          <Typography component="h1" className={styles.loadingTitle}>
            Cargando comercio
          </Typography>

          <Typography component="p" className={styles.loadingDescription}>
            Estamos preparando la vista previa de tu negocio.
          </Typography>

          <Box className={styles.loadingBar} aria-hidden="true">
            <Box component="span" />
          </Box>
        </Paper>
      </Box>
    );
  }

  if (pageError) {
    return (
      <Box component="main" className={styles.page}>
        <Box className={styles.backContainer}>
          <ButtonBack route="/app" />
        </Box>

        <Paper elevation={0} className={styles.stateCard}>
          <Box className={[styles.stateIcon, styles.errorIcon].join(" ")}>
            <MaterialSymbol icon="cloud_off" size="large" />
          </Box>

          <Typography component="h1" className={styles.stateTitle}>
            No pudimos cargar el comercio
          </Typography>

          <Alert
            severity="error"
            variant="outlined"
            className={styles.errorAlert}
          >
            {pageError}
          </Alert>

          <Button
            type="button"
            variant="contained"
            className={styles.retryButton}
            onClick={() => void cargarPreview()}
            startIcon={<MaterialSymbol icon="refresh" size="small" />}
          >
            Intentar nuevamente
          </Button>
        </Paper>
      </Box>
    );
  }

  if (!comercioPage || comercioPage.id === 0) {
    return (
      <Box component="main" className={styles.page}>
        <Box className={styles.backContainer}>
          <ButtonBack route="/app" />
        </Box>

        <Paper elevation={0} className={styles.stateCard}>
          <Box className={styles.stateIcon}>
            <MaterialSymbol icon="storefront" size="large" />
          </Box>

          <Typography component="h1" className={styles.stateTitle}>
            Comercio no encontrado
          </Typography>

          <Typography component="p" className={styles.stateDescription}>
            El comercio solicitado no existe, fue eliminado o no se encuentra
            disponible para tu cuenta.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box component="main" className={styles.page}>
      <Box className={styles.backgroundDecoration}>
        <Box className={styles.decorationOne} />
        <Box className={styles.decorationTwo} />
      </Box>

      <Box className={styles.content}>
        <Box className={styles.backContainer}>
          <ButtonBack route="/app" />
        </Box>

        <Box component="header" className={styles.header}>
          <Box className={styles.headerIcon}>
            <MaterialSymbol icon="visibility" size="medium" />
          </Box>

          <Box className={styles.headerContent}>
            <Typography component="h1" className={styles.title}>
              Vista previa del comercio
            </Typography>

            <Typography component="p" className={styles.description}>
              Consulta cómo se muestra tu negocio, sus productos, servicios y
              datos de contacto.
            </Typography>
          </Box>
        </Box>

        <Box className={styles.detailContainer}>
          <ComercioDetalle
            comercio={comercioPage}
            productos={productos}
            loadingProducts={loadingProducts}
          />
        </Box>
      </Box>
    </Box>
  );
}
