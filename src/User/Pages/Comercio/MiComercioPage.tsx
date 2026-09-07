import { Skeleton } from "@mui/material";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useComercio } from "../../../hooks/useComercio";
import { ComercioForm } from "./ComercioForm";
import { ComercioPlanGate } from "../../../components/Comercio/ComercioPlanGate";
import { ComercioPreviewCard } from "../../../components/Comercio/ComercioPreviewCard";
import { ComercioActionsHeader } from "../../../components/Comercio/ComercioActionsHeader";
import { ComerciosTable } from "../../../components/Comercio/ComerciosTable";
import type { JwtPayload } from "../../Auth/PrivateRouteUsuario";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

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
  colorPrimario: "#008989",
  colorSecundario: "#E7692C",
  horarios: [],
  estadoId: 0,
  municipioId: 0,
  estadoNombre: "",
  municipioNombre: "",
  promedioCalificacion: 0,
  tipoComercioId: 0,
  tipoComercio: "",
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
  const iconClass =
    variant === "edit"
      ? "commerceFormHeaderIcon commerceFormHeaderIconEdit"
      : "commerceFormHeaderIcon commerceFormHeaderIconRegister";

  return (
    <section
      className="card-adlocal commerceFormCard"
      aria-labelledby={`${variant}-commerce-title`}
    >
      <div className="card-adlocal-body commerceFormContent">
        <div className="commerceFormHeader">
          <div className={iconClass}>
            <MaterialSymbol icon={icon} size="medium" />
          </div>

          <div className="commerceFormHeaderText">
            <h1
              id={`${variant}-commerce-title`}
              className="commerceFormTitle fz-h4 fw-bold"
            >
              {title}
            </h1>

            <p className="commerceFormDescription fz-body-sm text-muted">
              {description}
            </p>
          </div>
        </div>

        {children}
      </div>
    </section>
  );
};

const PageSkeleton = () => {
  return (
    <div
      className="commerceLoadingContainer"
      aria-busy="true"
      aria-live="polite"
    >
      <Skeleton variant="rounded" className="commerceHeaderSkeleton" />

      <div className="commerceRowsSkeleton d-flex flex-column gap-2">
        {[1, 2, 3].map((item) => (
          <Skeleton
            key={item}
            variant="rounded"
            className="commerceRowSkeleton"
          />
        ))}
      </div>

      <p className="commerceLoadingText fz-body-sm text-muted">
        Cargando información de tus comercios...
      </p>
    </div>
  );
};

interface MiComercioPageProps {
  user: JwtPayload | null;
}

export const MiComercioPage = ({ user }: MiComercioPageProps) => {
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

  const [editando, setEditando] = useState(false);
  const [page, setPage] = useState(0);
  const rol = user?.rol ?? "";
  const planTipo = user?.planTipo?.toUpperCase() ?? "";
  const isColaborador = rol === "Colaborador";
  const isProOrBusiness = planTipo === "PRO" || planTipo === "BUSINESS";
  const shouldLoadCommerceList = isProOrBusiness && !isColaborador;
  const maxNegocios = Math.max(Number(user?.maxNegocios) || 1, 1);
  const [rows, setRows] = useState(() => getInitialRows(user?.maxNegocios));
  const imagenes = comercio?.imagenes ?? [];

  useEffect(() => {
    if (!shouldLoadCommerceList) {
      return;
    }

    void getAllComerciosByUser(page, rows);
  }, [shouldLoadCommerceList, page, rows, getAllComerciosByUser]);

  const handleRowsPerPageChange = useCallback(
    (value: number) => {
      if (!Number.isFinite(value) || value <= 0) {
        return;
      }

      const newRows = Math.min(Math.floor(value), maxNegocios);

      setRows(newRows);
      setPage(0);
    },
    [maxNegocios],
  );

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
          user={user}
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
          user={user}
        />
      </FormPanel>
    );
  }

  return (
    <main className="commerceManagementPage">
      <ComercioPlanGate
        user={user}
        fallback={
          <ComercioPreviewCard
            comercio={comercio}
            user={user}
            imagenes={imagenes}
            eliminar={eliminar}
            setEditando={setEditando}
          />
        }
      >
        <ComercioActionsHeader claims={user} total={total} />

        <div className="commerceTableContainer">
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
        </div>
      </ComercioPlanGate>
    </main>
  );
};
