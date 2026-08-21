import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

import MaterialSymbol from "../components/UI/MaterialSymbol/MaterialSymbol";

export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/app");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="notFoundPage">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-9 col-lg-7 col-xl-6">
            <div className="notFoundCard" aria-labelledby="not-found-title">
              {/* DECORACIÓN */}

              <div className="notFoundDecoration" aria-hidden="true">
                <div className="notFoundDecorationOne" />
                <div className="notFoundDecorationTwo" />
              </div>

              {/* ICONO */}

              <div className="notFoundIconContainer">
                <MaterialSymbol icon="travel_explore" size="large" />
              </div>

              {/* 404 */}

              <div className="notFoundCode fw-bold" aria-hidden="true">
                404
              </div>

              {/* TEXTO */}

              <h1
                id="not-found-title"
                className="notFoundTitle fz-h1 fw-bold mb-2"
              >
                Página no encontrada
              </h1>

              <p className="notFoundDescription fz-h4 fw-regular mb-0">
                La página que estás buscando no existe, fue movida o ya no se
                encuentra disponible.
              </p>

              {/* AYUDA */}

              <div className="notFoundInfo d-flex align-items-start gap-2">
                <MaterialSymbol
                  icon="info"
                  size="small"
                  className="notFoundInfoIcon flex-shrink-0"
                />

                <p className="notFoundInfoText fz-h5 fw-regular mb-0">
                  Verifica la dirección o regresa al inicio para continuar
                  navegando.
                </p>
              </div>

              {/* ACCIONES */}

              <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 mt-4">
                <Button
                  type="button"
                  variant="outlined"
                  className="btn-adlocal--solid fz-h4 fw-semibold"
                  onClick={handleGoBack}
                  startIcon={<MaterialSymbol icon="arrow_back" size="small" />}
                >
                  Regresar
                </Button>

 
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
