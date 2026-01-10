import { useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
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
  const [selected, setSelected] = useState(false);
  const listarPorComercio = useCallback(async (idComercio: number) => {
    setLoadingProducts(true);
    try {
      const { data } = await productosServiciosApi.getAllByComercio(idComercio);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return [];
      }

      setProductos(data.respuesta ?? []);
      return data.respuesta ?? [];
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Ocurrió un error inesperado al cargar los productos y servicios del comercio",
        "error"
      );
      return [];
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (!comercio?.id) return;

    let mounted = true;

    const fetchProductos = async () => {
      const productosCargados = await listarPorComercio(comercio.id);

      if (mounted) {
        console.log("Productos cargados:", productosCargados);
      }
    };

    fetchProductos();

    return () => {
      mounted = false;
    };
  }, [comercio?.id, listarPorComercio]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography>Cargando comercio...</Typography>
      </Box>
    );
  }

  if (!comercio) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          ¡Aún no tienes un comercio registrado!
        </Typography>
        <Typography>
          Por favor, da de alta tu comercio o negocio para poder ver la vista
          previa.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Vista Previa de tu Comercio
      </Typography>

      {!selected ? (
        <Box onClick={() => setSelected(true)}>
          <ComercioCard comercio={comercio} />
        </Box>
      ) : (
        <Box>
          <Box>
            <Button
              variant="text"
              onClick={() => setSelected(false)}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.9rem",
                color: "#007AFF",
                padding: "4px 8px",
                minWidth: "auto",
                "&:hover": {
                  backgroundColor: "rgba(0,122,255,0.1)",
                },
              }}
            >
              ← Atrás
            </Button>
          </Box>

          <ComercioDetalle comercio={comercio} productos={productos} loadingProducts={loadingProducts}/>
        </Box>
      )}
    </Box>
  );
}
