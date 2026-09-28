import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "../../../utils/sweetalert";
import ButtonBack from "../../../components/ButtonBack";
import { useComercio } from "../../../hooks/useComercio";
import type { ComercioDto } from "../../../types/User/comercio";
import type { JwtPayload } from "../../Auth/PrivateRouteUsuario";
import { ComercioForm } from "./ComercioForm";

interface ComercioPageFormProps {
  user: JwtPayload | null;
}

const getPositiveInteger = (value: unknown, fallback = 0): number => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return fallback;
  }
  return Math.floor(parsedValue);
};

export function ComercioPageForm({ user }: ComercioPageFormProps) {
  const COMMERCE_ROUTE = "/usuario/app/comercio";
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { comercioPage, guardarPage, cargarPorId, loading, totalByUser } =
    useComercio();

  const parsedId = Number(id);
  const comercioId = !id
    ? 0
    : Number.isInteger(parsedId) && parsedId > 0
      ? parsedId
      : null;

  const isEditMode = comercioId !== null && comercioId > 0;
  const maxNegocios = getPositiveInteger(user?.maxNegocios, 0);
  const limitAlertShownRef = useRef(false);

  useEffect(() => {
    if (comercioId === null) {
      void Swal.fire({
        icon: "error",
        title: "Identificador no válido",
        text: "El comercio solicitado no es válido.",
        confirmButtonText: "Regresar",
      }).then(() => {
        navigate(COMMERCE_ROUTE, { replace: true });
      });
      return;
    }

    if (isEditMode) {
      void cargarPorId(comercioId);
    }
  }, [comercioId, isEditMode, cargarPorId, navigate]);

  useEffect(() => {
    if (isEditMode || limitAlertShownRef.current) {
      return;
    }

    if (maxNegocios > 0 && totalByUser >= maxNegocios) {
      limitAlertShownRef.current = true;
      void Swal.fire({
        icon: "warning",
        title: "Límite alcanzado",
        text: `Tu plan permite registrar un máximo de ${maxNegocios} comercio(s).`,
        confirmButtonText: "Entendido",
      }).then(() => {
        navigate(COMMERCE_ROUTE, { replace: true });
      });
    }
  }, [isEditMode, maxNegocios, totalByUser, navigate]);

  const handleSave = async (data: ComercioDto) => {
    await guardarPage(data);
    navigate(COMMERCE_ROUTE);
  };

  return (
    <div className="commercePageFormContainer pb-4">
      <div className="d-flex align-items-center gap-3 mb-4">
        <ButtonBack route={COMMERCE_ROUTE} />
        <h1 className="fz-h2 fw-bold mb-0">
          {isEditMode ? "Editar comercio" : "Nuevo comercio"}
        </h1>
      </div>

      <ComercioForm
        initialData={isEditMode ? comercioPage : null}
        loading={loading}
        onSave={handleSave}
        soloVer={true}
        user={user}
      />
    </div>
  );
}

export default ComercioPageForm;
