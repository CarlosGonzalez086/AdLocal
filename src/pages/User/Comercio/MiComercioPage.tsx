import {
  Card,
  CardContent,
  Box,
  Typography,
  Skeleton,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useComercio } from "../../../hooks/useComercio";
import { ComercioForm } from "./ComercioForm";
import { jwtDecode } from "jwt-decode";
import { defaultJwtClaims, type JwtClaims } from "../../../services/auth.api";
import { ComercioPlanGate } from "../../../components/Comercio/ComercioPlanGate";
import { ComercioPreviewCard } from "../../../components/Comercio/ComercioPreviewCard";
import { ComercioActionsHeader } from "../../../components/Comercio/ComercioActionsHeader";
import { ComerciosTable } from "../../../components/Comercio/ComerciosTable";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

const cardSx = {
  borderRadius: 5,
  bgcolor: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
};

const formHeaderSx = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  mb: 3,
  pb: 2.5,
  borderBottom: "1px solid rgba(0,0,0,0.06)",
};

export const MiComercioPage = () => {
  const {
    comercio, loading, guardar, eliminar,
    comercios, total, getAllComerciosByUser,
    eliminarFromTable, guardarColaborador,
  } = useComercio();

  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims = dataJwt ? jwtDecode<JwtClaims>(dataJwt) : defaultJwtClaims;

  const [editando, setEditando] = useState(false);
  const imagenes = comercio?.imagenes ?? [];
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(Number(claims.maxNegocios));

  const isProOrBusiness = claims.planTipo === "PRO" || claims.planTipo === "BUSINESS";
  const isColaborador   = claims.rol === "Colaborador";
  const isComercio      = claims.rol === "Comercio";

  const isPlanValido =
    !isProOrBusiness || isColaborador || isComercio;

  useEffect(() => {
    if (!isColaborador && isProOrBusiness) {
      getAllComerciosByUser(page, rows);
    }
  }, []);

  if (isPlanValido && loading) {
    return (
      <Box>
        <Skeleton variant="rounded" height={88} sx={{ borderRadius: 4, mb: 2.5 }} />
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rounded" height={64} sx={{ borderRadius: 3 }} />
          ))}
        </Stack>
      </Box>
    );
  }

  if (isPlanValido && comercio.id === 0) {
    return (
      <Card elevation={0} sx={cardSx}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={formHeaderSx}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 3,
                background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.20)",
              }}
            >
              <StorefrontRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
            </Box>
            <Box>
              <Typography fontWeight={800} fontSize="1.1rem" letterSpacing="-0.2px">
                Registrar comercio
              </Typography>
              <Typography fontSize="0.72rem" color="text.disabled" mt={0.1}>
                Completa la información de tu negocio
              </Typography>
            </Box>
          </Box>

          <ComercioForm
            initialData={{
              id: 0, nombre: "", direccion: "", telefono: "",
              email: "", descripcion: "", activo: true,
              lat: 0, lng: 0, logoBase64: "", imagenes: [],
              colorPrimario: "#007AFF", colorSecundario: "#FF9500",
              horarios: [], estadoId: 0, municipioId: 0,
              estadoNombre: "", municipioNombre: "",
              promedioCalificacion: 0, tipoComercioId: 0, tipoComercio: "",
            }}
            loading={loading}
            onSave={guardar}
            claims={claims}
            soloVer
          />
        </CardContent>
      </Card>
    );
  }

  if (isPlanValido && editando) {
    return (
      <Card elevation={0} sx={cardSx}>
        <CardContent sx={{ p: { xs: 2.5, sm: 3.5 } }}>
          <Box sx={formHeaderSx}>
            <Box
              sx={{
                width: 40, height: 40, borderRadius: 3,
                background: "linear-gradient(135deg, #007AFF, #005FCC)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,122,255,0.28)",
              }}
            >
              <EditRoundedIcon sx={{ fontSize: 20, color: "#fff" }} />
            </Box>
            <Box>
              <Typography fontWeight={800} fontSize="1.1rem" letterSpacing="-0.2px">
                Editar comercio
              </Typography>
              <Typography fontSize="0.72rem" color="text.disabled" mt={0.1}>
                Actualiza la información de tu negocio
              </Typography>
            </Box>
          </Box>

          <ComercioForm
            initialData={comercio}
            loading={loading}
            onSave={async (data) => {
              await guardar(data);
              setEditando(false);
            }}
            setEditando={() => setEditando(false)}
            soloVer
            claims={claims}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <ComercioPlanGate
      claims={claims}
      fallback={
        <ComercioPreviewCard
          comercio={comercio}
          claims={claims}
          imagenes={imagenes}
          eliminar={eliminar}
          setEditando={setEditando}
        />
      }
    >
      <ComercioActionsHeader claims={claims} total={total} />

      <Box mt={2.5}>
        <ComerciosTable
          data={comercios}
          loading={loading}
          page={page}
          rowsPerPage={rows}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={(r) => { setRows(r); setPage(0); }}
          eliminarFromTable={eliminarFromTable}
          onSaveColaborador={guardarColaborador}
        />
      </Box>
    </ComercioPlanGate>
  );
};