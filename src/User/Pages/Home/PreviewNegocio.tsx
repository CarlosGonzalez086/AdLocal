import { Alert, Button, CircularProgress } from "@mui/material";

import { useCallback, useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

import { useComercio } from "../../../hooks/useComercio";

import ComercioDetalle from "../../../components/Comercio/ComercioDetalle";
import ButtonBack from "../../../components/ButtonBack";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import type { ProductoServicioDto } from "../../../types/User/productosServicios";

import { productosServiciosApi } from "../../../services/productosServiciosApi";

export function PreviewNegocio() {
  const { id } = useParams<{
    id: string;
  }>();

  const { comercioPage, cargarPorId, loading } = useComercio();

  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);

  const [loadingProducts, setLoadingProducts] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);

  /* ============================================
     ID COMERCIO
  ============================================ */

  const parsedId = Number(id);

  const comercioId =
    Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

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

          text:
            data.mensaje || "No fue posible cargar los productos y servicios.",

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

  /* ============================================
     CARGAR PREVIEW
  ============================================ */

  const cargarPreview = useCallback(async () => {
    if (!comercioId) {
      setPageError("El identificador del comercio no es válido.");

      setProductos([]);

      return;
    }

    setPageError(null);

    try {
      await Promise.all([
        cargarPorId(comercioId),

        listarPorComercio(comercioId),
      ]);
    } catch (error) {
      console.error("Error al cargar la vista previa:", error);

      setPageError("No fue posible cargar la información del comercio.");
    }
  }, [comercioId, cargarPorId, listarPorComercio]);

  /* ============================================
     LOAD
  ============================================ */

  useEffect(() => {
    void cargarPreview();
  }, [cargarPreview]);

  /* ============================================
     LOADING
  ============================================ */

  if (loading) {
    return (
      <div
        className="commercePreviewLoadingPage"
        aria-busy="true"
        aria-live="polite"
      >
        <section className="commercePreviewLoadingCard">
          <div className="commercePreviewLoadingIconContainer">
            <CircularProgress
              size={48}
              thickness={4.5}
              className="commercePreviewLoadingProgress"
            />
          </div>

          <h1 className="commercePreviewLoadingTitle fz-h1 fw-bold mb-2">
            Cargando comercio
          </h1>

          <p className="commercePreviewLoadingDescription fz-h4 fw-regular mb-0">
            Estamos preparando la vista previa de tu negocio.
          </p>

          <div className="commercePreviewLoadingBar" aria-hidden="true">
            <span />
          </div>
        </section>
      </div>
    );
  }

  /* ============================================
     ERROR
  ============================================ */

  if (pageError) {
    return (
      <div className="commercePreviewPage">
        <div className="commercePreviewBackContainer">
          <ButtonBack route="/usuario/app/inicio" />
        </div>

        <section className="commercePreviewStateCard">
          <div className="commercePreviewStateIcon commercePreviewErrorIcon">
            <MaterialSymbol icon="cloud_off" size="large" />
          </div>

          <h1 className="commercePreviewStateTitle fz-h1 fw-bold mb-3">
            No pudimos cargar el comercio
          </h1>

          <Alert
            severity="error"
            variant="outlined"
            className="commercePreviewErrorAlert fz-h4 fw-medium"
          >
            {pageError}
          </Alert>

          <Button
            type="button"
            variant="contained"
            className="commercePreviewRetryButton fz-h4 fw-semibold"
            onClick={() => void cargarPreview()}
            startIcon={<MaterialSymbol icon="refresh" size="small" />}
          >
            Intentar nuevamente
          </Button>
        </section>
      </div>
    );
  }

  /* ============================================
     NO ENCONTRADO
  ============================================ */

  if (!comercioPage || comercioPage.id === 0) {
    return (
      <div className="commercePreviewPage">
        <div className="commercePreviewBackContainer">
          <ButtonBack route="/usuario/app/inicio" />
        </div>

        <section className="commercePreviewStateCard">
          <div className="commercePreviewStateIcon">
            <MaterialSymbol icon="storefront" size="large" />
          </div>

          <h1 className="commercePreviewStateTitle fz-h1 fw-bold mb-2">
            Comercio no encontrado
          </h1>

          <p className="commercePreviewStateDescription fz-h4 fw-regular mb-0">
            El comercio solicitado no existe, fue eliminado o no se encuentra
            disponible para tu cuenta.
          </p>
        </section>
      </div>
    );
  }

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div className="commercePreviewPage">
      {/* DECORACIÓN */}

      <div className="commercePreviewBackgroundDecoration" aria-hidden="true">
        <div className="commercePreviewDecorationOne" />

        <div className="commercePreviewDecorationTwo" />
      </div>

      {/* CONTENT */}

      <div className="commercePreviewContent">
        {/* BACK */}

        <div className="commercePreviewBackContainer">
          <ButtonBack route="/app" />
        </div>

        {/* HEADER */}

        <div className="commercePreviewHeader d-flex align-items-start gap-3">
          <div className="commercePreviewHeaderIcon flex-shrink-0">
            <MaterialSymbol icon="visibility" size="medium" />
          </div>

          <div className="commercePreviewHeaderContent flex-grow-1">
            <h1 className="commercePreviewTitle fz-h1 fw-bold mb-1">
              Vista previa del comercio
            </h1>

            <p className="commercePreviewDescription fz-h4 fw-regular mb-0">
              Consulta cómo se muestra tu negocio, sus productos, servicios y
              datos de contacto.
            </p>
          </div>
        </div>

        {/* DETAIL */}

        <div className="commercePreviewDetailContainer">
          <ComercioDetalle
            comercio={comercioPage}
            productos={productos}
            loadingProducts={loadingProducts}
          />
        </div>
      </div>
    </div>
  );
}
