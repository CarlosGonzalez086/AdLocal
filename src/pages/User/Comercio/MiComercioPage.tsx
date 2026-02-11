import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
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

export const MiComercioPage = () => {
  const {
    comercio,
    loading,
    guardar,
    eliminar,
    comercios,
    total,
    getAllComerciosByUser,
    eliminarFromTable,
    guardarColaborador,
  } = useComercio();

  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : defaultJwtClaims;
  const [editando, setEditando] = useState(false);
  const imagenes = comercio?.imagenes ?? [];
  const [page, setPage] = useState<number>(0);
  const [rows, setRows] = useState<number>(Number(claims.maxNegocios));

  useEffect(() => {
    if (
      claims.rol != "Colaborador" &&
      (claims.planTipo == "PRO" || claims.planTipo == "BUSINESS")
    ) {
      getAllComerciosByUser(page, rows);
    }
  }, []);

  const isPlanValido =
    (claims.planTipo != "PRO" && claims.planTipo != "BUSINESS") ||
    claims.rol == "Colaborador" ||
    claims.rol == "Comercio";

  if (isPlanValido && loading) {
    return (
      <Box
        sx={{
          minHeight: "70vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography color="text.secondary" fontWeight={500}>
          Cargando comercio…
        </Typography>
      </Box>
    );
  }

  if (isPlanValido && comercio.id == 0) {
    return (
      <Card sx={cardStyle}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Registrar comercio
          </Typography>
          <ComercioForm
            initialData={{
              id: 0,
              nombre: "",
              direccion: "",
              telefono: "",
              email: "",
              descripcion: "",
              activo: true,
              lat: 0,
              lng: 0,
              logoBase64: "",
              imagenes: [],
              colorPrimario: "#007AFF",
              colorSecundario: "#FF9500",
              horarios: [],
              estadoId: 0,
              municipioId: 0,
              estadoNombre: "",
              municipioNombre: "",
              promedioCalificacion: 0,
              tipoComercioId: 0,
              tipoComercio: "",
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
      <Card sx={cardStyle}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} mb={3}>
            Editar comercio
          </Typography>
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

      <ComerciosTable
        data={comercios}
        loading={loading}
        page={page}
        rowsPerPage={rows}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={(r) => {
          setRows(r);
          setPage(0);
        }}
        eliminarFromTable={eliminarFromTable}
        onSaveColaborador={guardarColaborador}
      />
    </ComercioPlanGate>
  );
};
const cardStyle = {
  borderRadius: 4,
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  backgroundColor: "#fff",
};
