import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Divider,
  Skeleton,
  Stack,
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
import CodigoReferido from "../../../components/User/CodigoReferido";
import { useUsoCodigoReferido } from "../../../hooks/useUsoCodigoReferido";
import { useActualizarJwt } from "../../../hooks/useActualizarJwt";

export default function PreviewPage() {
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt ? jwtDecode<JwtClaims>(dataJwt) : null;

  const { comercio, loading, comercios, getAllComerciosByUser } = useComercio();
  const { contarPorCodigo } = useUsoCodigoReferido();
  const [totalUsoCodigo, setTotalUsoCodigo] = useState<number>(0);
  const [productos, setProductos] = useState<ProductoServicioDto[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [verDetalle, setVerDetalle] = useState(false);
  const [aplicoBeneficio, setAplicoBeneficio] = useState(false);

  const comercioSeleccionadoId = useMemo(() => {
    if (comercios.length > 0) return comercios[0].id;
    return comercio?.id;
  }, [comercios, comercio]);

  const [selectedId, setSelectedId] = useState<number | undefined>(comercioSeleccionadoId);
  const { actualizarJwt } = useActualizarJwt();

  const { data: stats, loading: loadingStats, error: statsError } =
    useComercioVisitasStats(selectedId);

  const listarPorComercio = useCallback(async (idComercio: number) => {
    setLoadingProducts(true);
    try {
      const { data } = await productosServiciosApi.getAllByComercio(idComercio);
      if (data.codigo !== "200") { Swal.fire("Error", data.mensaje, "error"); return; }
      setProductos(data.respuesta ?? []);
    } catch {
      Swal.fire("Error", "Error al cargar los productos", "error");
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => { if (comercio?.id) listarPorComercio(comercio.id); }, [comercio?.id]);
  useEffect(() => {
    if (claims?.codigoReferido) {
      contarPorCodigo(claims.codigoReferido)
        .then(setTotalUsoCodigo)
        .catch(() => setTotalUsoCodigo(0));
    }
  }, [claims?.codigoReferido]);

  useEffect(() => {
    if (claims?.rol === "Comercio" && (claims.planTipo === "PRO" || claims.planTipo === "BUSINESS")) {
      getAllComerciosByUser(0, Number(claims.maxNegocios));
    }
  }, []);

  useEffect(() => {
    if (aplicoBeneficio) {
      actualizarJwt({ email: String(claims?.sub), updateJWT: true });
    }
  }, [aplicoBeneficio]);

  const isProOrBusiness = claims?.planTipo === "PRO" || claims?.planTipo === "BUSINESS";
  const isBasicOrFree = claims?.planTipo === "FREE" || claims?.planTipo === "BASIC";
  const isColaborador = claims?.rol === "Colaborador";

  /* ─── LOADING ─── */
  if (loading) {
    return (
      <Box p={{ xs: 2, sm: 4 }}>
        <Skeleton variant="rounded" height={80} sx={{ borderRadius: 4, mb: 2 }} />
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={260} sx={{ flex: 1, minWidth: 220, borderRadius: 4 }} />
          ))}
        </Stack>
      </Box>
    );
  }

  /* ─── SIN COMERCIO ─── */
  if (comercio.id === 0) {
    return (
      <Box
        sx={{
          p: { xs: 3, sm: 5 },
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1.5,
          mt: 4,
        }}
      >
        <Typography fontSize="3rem">🏪</Typography>
        <Typography fontWeight={800} fontSize="1.3rem" color="text.primary">
          Aún no tienes un comercio
        </Typography>
        <Typography color="text.secondary" fontSize="0.875rem">
          Registra tu primer comercio para comenzar.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: { xs: 0, sm: 0 } }}>

      {/* CÓDIGO REFERIDO */}
      {claims?.codigoReferido && (
        <Box mb={3}>
          <CodigoReferido
            codigoReferido={claims.codigoReferido}
            totalUsoCodigo={totalUsoCodigo}
            setAplicoBeneficio={setAplicoBeneficio}
            usoTotalReferidos={claims?.RedeemRewards ?? ""}
          />
          <Divider sx={{ mt: 3, opacity: 0.5 }} />
        </Box>
      )}

      {/* VISTA PRO / BUSINESS */}
      {isProOrBusiness && !isColaborador && (
        <>
          <SectionHeader emoji="👁️" title="Vista previa de comercios" />

          <Box mb={4}>
            <div className="row g-3">
              {comercios.map((c) => (
                <div key={c.id} className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex">
                  <ComercioCard comercio={c} />
                </div>
              ))}
            </div>
          </Box>

          <Divider sx={{ my: 3, opacity: 0.5 }} />

          {/* ESTADÍSTICAS */}
          <SectionHeader emoji="📊" title="Estadísticas de visitas" />

          <ComercioSelector
            comercios={comercios}
            value={selectedId ?? 0}
            onChange={setSelectedId}
          />

          {loadingStats && (
            <Box mt={4}>
              <Stack spacing={2}>
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
                <Skeleton variant="rounded" height={200} sx={{ borderRadius: 4 }} />
              </Stack>
            </Box>
          )}

          {statsError && (
            <Box
              mt={3}
              sx={{
                p: 2.5,
                borderRadius: 4,
                bgcolor: "rgba(255,59,48,0.06)",
                border: "1px solid rgba(255,59,48,0.15)",
              }}
            >
              <Typography color="error.main" fontSize="0.875rem" fontWeight={600}>
                ⚠️ {statsError}
              </Typography>
            </Box>
          )}

          {stats && (
            <Box mt={3}>
              <ComercioVisitasCharts
                ultimaSemana={stats.ultimaSemana}
                ultimosTresMeses={stats.ultimosTresMeses}
              />
            </Box>
          )}
        </>
      )}

      {/* VISTA FREE / BASIC / COLABORADOR */}
      {(isBasicOrFree || isColaborador) && (
        <>
          {!verDetalle ? (
            <>
              <SectionHeader emoji="👁️" title="Vista previa" />
              <Divider sx={{ mb: 3, opacity: 0.5 }} />

              <Box display="flex" justifyContent="center">
                <Box onClick={() => setVerDetalle(true)} sx={{ cursor: "pointer", width: "100%", maxWidth: 340 }}>
                  <ComercioCardBasico comercio={comercio} />
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Box mb={2}>
                <Button
                  onClick={() => setVerDetalle(false)}
                  startIcon={<span style={{ fontSize: 14 }}>←</span>}
                  sx={{
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "#007AFF",
                    px: 2,
                    py: 0.8,
                    border: "1px solid rgba(0,122,255,0.20)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      bgcolor: "rgba(0,122,255,0.06)",
                      borderColor: "rgba(0,122,255,0.35)",
                      transform: "translateX(-2px)",
                    },
                  }}
                >
                  Volver
                </Button>
              </Box>

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

/* ─── AUXILIAR ─── */
const SectionHeader = ({ emoji, title }: { emoji: string; title: string }) => (
  <Box display="flex" alignItems="center" gap={1} mb={2.5}>
    <Typography fontSize="1.4rem" lineHeight={1}>{emoji}</Typography>
    <Typography
      sx={{
        fontSize: { xs: "1.2rem", sm: "1.4rem" },
        fontWeight: 800,
        color: "#1c1c1e",
        letterSpacing: "-0.3px",
      }}
    >
      {title}
    </Typography>
  </Box>
);