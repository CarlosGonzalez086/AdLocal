import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useComercio } from "../../../hooks/useComercio";

import { ComercioForm } from "./ComercioForm";
import { ComercioActionsHeader } from "../../../components/Comercio/ComercioActionsHeader";
import { ComercioPlanGate } from "../../../components/Comercio/ComercioPlanGate";
import { ComercioPreviewCard } from "../../../components/Comercio/ComercioPreviewCard";
import { ComerciosTable } from "../../../components/Comercio/ComerciosTable";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import { defaultJwtClaims, type JwtClaims } from "../../../services/auth.api";

import styles from "../../../styles/MiComercioPage.module.css";

interface FormPanelProps {
  icon: string;
  title: string;
  description: string;
  variant: "register" | "edit";
  children: ReactNode;
}

const EMPTY_COMMERCE = {
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
};

const decodeClaims = (token: string | null): JwtClaims => {
  if (!token) {
    return defaultJwtClaims;
  }

  try {
    return jwtDecode<JwtClaims>(token);
  } catch (error) {
    console.error("No fue posible decodificar el JWT:", error);

    return defaultJwtClaims;
  }
};

const getInitialRows = (maxBusinesses: unknown): number => {
  const parsedValue = Number(maxBusinesses);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return 10;
  }

  return Math.max(Math.floor(parsedValue), 1);
};

const FormPanel = ({
  icon,
  title,
  description,
  variant,
  children,
}: FormPanelProps) => {
  return (
    <Card
      component="section"
      elevation={0}
      className={styles.formCard}
      aria-labelledby={`${variant}-commerce-title`}
    >
      <CardContent className={styles.formContent}>
        <Box className={styles.formHeader}>
          <Box
            className={[
              styles.formHeaderIcon,
              variant === "edit"
                ? styles.editHeaderIcon
                : styles.registerHeaderIcon,
            ].join(" ")}
          >
            <MaterialSymbol icon={icon} size="medium" />
          </Box>

          <Box className={styles.formHeaderText}>
            <Typography
              id={`${variant}-commerce-title`}
              component="h1"
              className={styles.formTitle}
            >
              {title}
            </Typography>

            <Typography component="p" className={styles.formDescription}>
              {description}
            </Typography>
          </Box>
        </Box>

        {children}
      </CardContent>
    </Card>
  );
};

const PageSkeleton = () => {
  return (
    <Box
      className={styles.loadingContainer}
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton variant="rounded" className={styles.headerSkeleton} />

      <Stack className={styles.rowsSkeleton}>
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            variant="rounded"
            className={styles.rowSkeleton}
          />
        ))}
      </Stack>

      <Typography component="p" className={styles.loadingText}>
        Cargando información de tus comercios...
      </Typography>
    </Box>
  );
};

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

  const claims = useMemo(() => decodeClaims(localStorage.getItem("token")), []);

  const [editando, setEditando] = useState(false);

  const [page, setPage] = useState(0);

  const [rows, setRows] = useState(() => getInitialRows(claims.maxNegocios));

  const isProOrBusiness =
    claims.planTipo === "PRO" || claims.planTipo === "BUSINESS";

  const isColaborador = claims.rol === "Colaborador";

  const shouldLoadCommerceList = isProOrBusiness && !isColaborador;

  const imagenes = comercio?.imagenes ?? [];

  useEffect(() => {
    if (!shouldLoadCommerceList) {
      return;
    }

    void getAllComerciosByUser(page, rows);
  }, [shouldLoadCommerceList, page, rows, getAllComerciosByUser]);

  const handleRowsPerPageChange = useCallback((value: number) => {
    const parsedValue = Number(value);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return;
    }

    setRows(Math.floor(parsedValue));
    setPage(0);
  }, []);

  const handleUpdateCommerce = useCallback(
    async (data: Parameters<typeof guardar>[0]) => {
      await guardar(data);
      setEditando(false);
    },
    [guardar],
  );

  const handleCancelEdit = useCallback(() => {
    setEditando(false);
  }, []);

  if (loading) {
    return <PageSkeleton />;
  }

  if (!comercio || comercio.id === 0) {
    return (
      <FormPanel
        icon="add_business"
        title="Registrar comercio"
        description="Completa la información necesaria para publicar tu negocio."
        variant="register"
      >
        <ComercioForm
          initialData={EMPTY_COMMERCE}
          loading={loading}
          onSave={guardar}
          claims={claims}
          soloVer
        />
      </FormPanel>
    );
  }

  if (editando) {
    return (
      <FormPanel
        icon="edit_square"
        title="Editar comercio"
        description="Actualiza la información, apariencia y ubicación de tu negocio."
        variant="edit"
      >
        <ComercioForm
          initialData={comercio}
          loading={loading}
          onSave={handleUpdateCommerce}
          setEditando={handleCancelEdit}
          soloVer
          claims={claims}
        />
      </FormPanel>
    );
  }

  return (
    <Box component="main" className={styles.page}>
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

        <Box className={styles.tableContainer}>
          <ComerciosTable
            data={comercios}
            loading={loading}
            page={page}
            rowsPerPage={rows}
            total={total}
            onPageChange={setPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            eliminarFromTable={eliminarFromTable}
            onSaveColaborador={guardarColaborador}
          />
        </Box>
      </ComercioPlanGate>
    </Box>
  );
};
