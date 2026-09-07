import { jwtDecode } from "jwt-decode";
import { useComercio } from "../../../hooks/useComercio";
import { useEffect, useMemo } from "react";
import Swal from "../../../utils/sweetalert";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@mui/material";
import ComercioCard from "../../../components/Comercio/ComercioCard";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import StorefrontRoundedIcon from "@mui/icons-material/StorefrontRounded";
import type { JwtClaims } from "../../../types/claims";

export default function ProductosServicioComercios() {
  const { loading, comercios, getAllComerciosByUser } = useComercio();
  const navigate = useNavigate();

  const { isAllowed, maxNegocios } = useMemo(() => {
    const dataJwt = localStorage.getItem("token");
    const claims: JwtClaims | null = dataJwt ? jwtDecode<JwtClaims>(dataJwt) : null;
    const allowed =
      claims?.rol === "Comercio" &&
      (claims?.planTipo === "PRO" || claims?.planTipo === "BUSINESS");
    return {
      isAllowed: allowed,
      maxNegocios: Number(claims?.maxNegocios ?? 0),
    };
  }, []);

  useEffect(() => {
    if (isAllowed) {
      getAllComerciosByUser(0, maxNegocios);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Acceso restringido",
        text: "Tu plan actual no incluye acceso a esta sección. Actualiza tu plan para desbloquear esta funcionalidad.",
        confirmButtonText: "Entendido",
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => navigate("/app/productos-servicios"));
    }
  }, [isAllowed, maxNegocios, getAllComerciosByUser, navigate]);

  if (loading) {
    return (
      <div className="row g-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Skeleton
              variant="rounded"
              height={260}
              className="w-100"
              style={{ borderRadius: "var(--radius-lg)" }}
            />
          </div>
        ))}
      </div>
    );
  }

  if (comercios.length === 0) {
    return (
      <div className="empty-state-adlocal py-5">
        <div className="empty-state-adlocal-icon">
          <StorefrontRoundedIcon style={{ fontSize: 40 }} />
        </div>

        <h2 className="empty-state-adlocal-title fz-h4 fw-bold">
          Aún no tienes un comercio registrado
        </h2>
        <p className="empty-state-adlocal-desc fz-body-sm text-muted">
          Para registrar productos o servicios, primero da de alta tu negocio.
        </p>

        <button
          type="button"
          className="btn-adlocal btn-adlocal-primary d-inline-flex align-items-center gap-1 mt-3"
          onClick={() => navigate("/app/comercio")}
        >
          <AddRoundedIcon style={{ fontSize: 18 }} />
          <span>Registrar comercio</span>
        </button>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {comercios.map((c) => (
        <div key={c.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
          <ComercioCard comercio={c} isProductOrServiceCreation />
        </div>
      ))}
    </div>
  );
}
