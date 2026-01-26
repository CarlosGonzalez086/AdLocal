import { useParams } from "react-router-dom";
import { useComercio } from "../../../hooks/useComercio";
import { useCallback, useEffect, useState } from "react";
import {
  productosServiciosApi,
  type ProductoServicioDto,
} from "../../../services/productosServiciosApi";
import Swal from "sweetalert2";
import ComercioDetalle from "../../../components/Comercio/ComercioDetalle";
import { Box, CircularProgress, Typography } from "@mui/material";
import ButtonBack from "../../../components/ButtonBack";

export function PreviewNegocio() {
  const { id } = useParams();
  const { comercioPage, cargarPorId, loading } = useComercio();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);

  const listarPorComercio = useCallback(async (idComercio: number) => {
    setLoadingProducts(true);
    try {
      const { data } = await productosServiciosApi.getAllByComercio(idComercio);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }

      setProductos(data.respuesta ?? []);
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al cargar los productos y servicios",
        "error",
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      listarPorComercio(Number(id));
    }
  }, [id, listarPorComercio]);

  useEffect(() => {
    if (id) {
      cargarPorId(Number(id));
      return;
    }
  }, [id]);

  console.log(comercioPage);
  

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          background: "linear-gradient(135deg, #f9fafb, #eef2f7)",
        }}
      >
        <CircularProgress
          size={60}
          thickness={4.5}
          sx={{
            color: "#6F4E37",
          }}
        />

        <Typography
          sx={{
            fontWeight: 600,
            fontSize: "1.1rem",
            color: "text.secondary",
            letterSpacing: "0.3px",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          Cargando comercio...
        </Typography>

        <style>
          {`
          @keyframes pulse {
            0% { opacity: 0.4; }
            50% { opacity: 1; }
            100% { opacity: 0.4; }
          }
        `}
        </style>
      </Box>
    );
  }

  return (
    <>
      <ButtonBack route="/app" />
      <div className="d-flex justify-content-center p-3">
        <ComercioDetalle
          comercio={comercioPage}
          productos={productos}
          loadingProducts={loadingProducts}
        />
      </div>
    </>
  );
}
