import { Button } from "@mui/material";

import { useNavigate } from "react-router-dom";

import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

export const UserProfileSecurity = () => {
  const navigate = useNavigate();

  return (
    <div className="profileSecurity">
      <div className="row g-3 align-items-center">
        <div className="col-12 col-sm">
          <div className="d-flex align-items-center gap-3">
            <div className="profileSecurityIcon flex-shrink-0">
              <MaterialSymbol icon="shield" size="small" filled />
            </div>

            <div>
              <h2 className="profileSecurityTitle fz-h4 fw-bold mb-1">
                Seguridad de la cuenta
              </h2>

              <p className="profileSecurityDescription fz-h5 fw-regular mb-0">
                Actualiza tu contraseña regularmente
              </p>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-auto">
          <div className="d-grid d-sm-block">
            <Button
              type="button"
              variant="outlined"
              className="btn-adlocal fz-h4 fw-semibold"
              onClick={() => navigate("/usuario/app/perfil/cambiar-password")}
              startIcon={<MaterialSymbol icon="lock" size="small" />}
            >
              Cambiar contraseña
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
