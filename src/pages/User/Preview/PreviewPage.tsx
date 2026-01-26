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
import type { JwtClaims } from "../../../services/auth.api";
import { jwtDecode } from "jwt-decode";
import ComercioCardBasico from "../../../components/Comercio/ComercioCardBasico";

export default function PreviewPage() {
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;
  const { comercio, loading, comercios, getAllComerciosByUser } = useComercio();
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
        "error",
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

  const page = 0;
  const rows = Number(claims?.maxNegocios);

  useEffect(() => {
    if (
      claims?.rol == "Comercio" &&
      (claims?.planTipo == "PRO" || claims?.planTipo == "BUSINESS")
    ) {
      getAllComerciosByUser(page, rows);
    }
  }, []);

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
          Cargando comercios...
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
      <>
        {claims?.rol == "Comercio" &&
        (claims?.planTipo == "PRO" || claims?.planTipo == "BUSINESS") ? (
          <>
            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                Todavía no hay comercios por aquí
              </Typography>
              <Typography color="text.secondary">
                Agrega tu primer comercio y descubre cómo se verá en la
                plataforma.
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Typography variant="h5" fontWeight="bold" mb={1}>
                ¡Aún no tienes un comercio registrado!
              </Typography>
              <Typography color="text.secondary">
                Registra tu comercio para poder ver la vista previa.
              </Typography>
            </Box>
          </>
        )}
      </>
    );
  }

  return (
    <Box>
      {claims?.rol == "Comercio" &&
      (claims?.planTipo == "PRO" || claims?.planTipo == "BUSINESS") ? (
        <>
          {" "}
          <div className="container-fluid">
            <div className="row g-4 align-items-stretch">
              {comercios.map((c) => (
                <div
                  key={c.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                >
                  <ComercioCard
                    comercio={c}
                  />
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Vista previa de tu comercio
          </Typography>
          <Divider sx={{ mb: 3 }} />
          {!verDetalle ? (
            <div className="d-flex justify-content-center p-3">
              <Box
                sx={{ cursor: "pointer" }}
                onClick={() => setVerDetalle(true)}
              >
                <ComercioCardBasico comercio={comercio} />
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
        </>
      )}
    </Box>
  );
}
