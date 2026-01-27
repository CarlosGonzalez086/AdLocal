import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

import { useComercio } from "../../../hooks/useComercio";
import { useComercioVisitasStats } from "../../../hooks/useComercioVisitasStats";

import ComercioCard from "../../../components/Comercio/ComercioCard";
import ComercioDetalle from "../../../components/Comercio/ComercioDetalle";
import ComercioCardBasico from "../../../components/Comercio/ComercioCardBasico";
import ComercioSelector from "../../../components/Comercio/ComercioSelector";
import ComercioVisitasCharts from "../../../components/Comercio/ComercioVisitasCharts";

import {
  productosServiciosApi,
  type ProductoServicioDto,
} from "../../../services/productosServiciosApi";
import type { JwtClaims } from "../../../services/auth.api";

export default function PreviewPage() {
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;

  const { comercio, loading, comercios, getAllComerciosByUser } = useComercio();

  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [verDetalle, setVerDetalle] = useState(false);

  const comercioSeleccionadoId = useMemo(() => {
    if (comercios.length > 0) return comercios[0].id;
    return comercio?.id;
  }, [comercios, comercio]);

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
    try {
      const { data } = await productosServiciosApi.getAllByComercio(idComercio);
      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return;
      }
      setProductos(data.respuesta ?? []);
    } catch {
      Swal.fire("Error", "Error al cargar los productos", "error");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    if (comercio?.id) listarPorComercio(comercio.id);
  }, [comercio?.id, listarPorComercio]);

  useEffect(() => {
    if (
      claims?.rol === "Comercio" &&
      (claims.planTipo === "PRO" || claims.planTipo === "BUSINESS")
    ) {
      getAllComerciosByUser(0, Number(claims.maxNegocios));
    }
  }, []);

  if (loading) {
    return (
      <Box
        minHeight="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={2}
      >
        <CircularProgress size={56} />
        <Typography fontWeight={600} color="text.secondary">
          Cargando comercios…
        </Typography>
      </Box>
    );
  }

  if (!comercio) {
    return (
      <Box p={{ xs: 2, sm: 4 }}>
        <Typography variant="h5" fontWeight={700}>
          ¡Aún no tienes un comercio!
        </Typography>
        <Typography color="text.secondary">
          Registra tu comercio para continuar.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {claims?.rol === "Comercio" &&
        (claims.planTipo === "PRO" || claims.planTipo === "BUSINESS") && (
          <Box mb={6}>
            <div className="row g-3 d-flex justify-content-center">
              {comercios.map((c) => (
                <div
                  key={c.id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex"
                >
                  <ComercioCard comercio={c} />
                </div>
              ))}
            </div>
          </Box>
        )}

      {(claims?.planTipo === "PRO" || claims?.planTipo === "BUSINESS") && (
        <>
          <Divider />
          <Box mt={6}>
            <Typography fontSize={{ xs: 22, sm: 26 }} fontWeight={800} mb={2}>
              Estadísticas de visitas
            </Typography>

            <ComercioSelector
              comercios={comercios}
              value={selectedId ?? 0}
              onChange={setSelectedId}
            />

            {loadingStats && (
              <Box textAlign="center" mt={4}>
                <CircularProgress />
              </Box>
            )}

            {statsError && (
              <Typography color="error" mt={2}>
                {statsError}
              </Typography>
            )}

            {stats && (
              <Box mt={4}>
                <ComercioVisitasCharts
                  ultimaSemana={stats.ultimaSemana}
                  ultimosTresMeses={stats.ultimosTresMeses}
                />
              </Box>
            )}
          </Box>
        </>
      )}

      {(claims?.planTipo === "FREE" || claims?.planTipo === "BASIC") && (
        <>
          <Typography fontSize={{ xs: 22, sm: 26 }} fontWeight={800} mb={1}>
            Vista previa
          </Typography>

          <Divider sx={{ mb: 3 }} />

          {!verDetalle ? (
            <Box display="flex" justifyContent="center">
              <Box
                onClick={() => setVerDetalle(true)}
                sx={{ cursor: "pointer" }}
              >
                <ComercioCardBasico comercio={comercio} />
              </Box>
            </Box>
          ) : (
            <>
              <Button
                onClick={() => setVerDetalle(false)}
                sx={{ textTransform: "none", mb: 2 }}
              >
                ← Volver
              </Button>

              <Box display="flex" justifyContent="center">
                <ComercioDetalle
                  comercio={comercio}
                  productos={productos}
                  loadingProducts={loadingProducts}
                />
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}
