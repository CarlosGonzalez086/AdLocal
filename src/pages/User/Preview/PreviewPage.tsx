import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useComercio } from "../../../hooks/useComercio";
import ComercioCard from "../../../components/Comercio/ComercioCard";
import ComercioDetalle from "../../../components/Comercio/ComercioDetalle";
import {
  productosServiciosApi,
  type ProductoServicioDto,
} from "../../../services/productosServiciosApi";
import Swal from "sweetalert2";

export default function PreviewPage() {
  const { comercio, loading } = useComercio();
  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [verDetalle, setVerDetalle] = useState(false);

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
        "error"
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (comercio?.id) {
      listarPorComercio(comercio.id);
    }
  }, [comercio?.id, listarPorComercio]);

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

  if (!comercio) {
    return (
      <Box>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          ¡Aún no tienes un comercio registrado!
        </Typography>
        <Typography color="text.secondary">
          Registra tu comercio para poder ver la vista previa.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Vista previa de tu comercio
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {!verDetalle ? (
        <div className="d-flex justify-content-center p-3">
          <Box sx={{ cursor: "pointer" }} onClick={() => setVerDetalle(true)}>
            <ComercioCard comercio={comercio} />
          </Box>
        </div>
      ) : (
        <>
          <Button
            variant="text"
            onClick={() => setVerDetalle(false)}
            sx={{
              textTransform: "none",
              fontSize: "0.85rem",
              mb: 1,
              px: 0,
            }}
          >
            ← Atrás
          </Button>

          <div className="d-flex justify-content-center p-3">
            <ComercioDetalle
              comercio={comercio}
              productos={productos}
              loadingProducts={loadingProducts}
            />
          </div>
        </>
      )}
    </Box>
  );
}
