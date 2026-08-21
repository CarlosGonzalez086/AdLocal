import { Button, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import type { JwtPayload } from "../../User/Auth/PrivateRouteUsuario";

interface Props {
  claims: JwtPayload | null;
  total: number;
}

export function ComercioActionsHeader({ claims, total }: Props) {
  const parsedMax = Number(claims?.maxNegocios);

  const max =
    Number.isFinite(parsedMax) && parsedMax > 0 ? Math.floor(parsedMax) : 0;

  const totalRegistrados = Math.max(Math.floor(Number(total) || 0), 0);

  const limiteDisponible = max > 0;

  const restantes = limiteDisponible ? Math.max(max - totalRegistrados, 0) : 0;

  const limiteAlcanzado = !limiteDisponible || totalRegistrados >= max;

  const porcentaje = limiteDisponible
    ? Math.min((totalRegistrados / max) * 100, 100)
    : 0;

  const statusMessage = !limiteDisponible
    ? "No fue posible determinar el límite de negocios de tu plan."
    : limiteAlcanzado
      ? "Llegaste al límite de negocios de tu plan actual."
      : `Puedes registrar ${restantes} ${
          restantes === 1 ? "negocio" : "negocios"
        } más.`;

  const counterClass = limiteAlcanzado
    ? "commerceCounterBadge commerceCounterBadgeLimit"
    : "commerceCounterBadge commerceCounterBadgeAvailable";

  const progressClass = limiteAlcanzado
    ? "commerceUsageProgress commerceUsageProgressLimit"
    : "commerceUsageProgress commerceUsageProgressAvailable";

  const statusClass = limiteAlcanzado
    ? "commerceStatusMessage commerceStatusMessageLimit d-flex align-items-center gap-2 mb-0 fz-h4 fw-medium"
    : "commerceStatusMessage d-flex align-items-center gap-2 mb-0 fz-h4 fw-medium";

  return (
    <section
      className="commerceActionsHeader"
      aria-labelledby="commerce-usage-title"
    >
      <div className="row g-4 align-items-center">
        {/* INFORMACIÓN */}
        <div className="col-12 col-lg">
          <div className="commerceActionsInformation">
            {/* HEADER */}
            <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
              <div className="d-flex align-items-center gap-3">
                <div className="commerceActionsTitleIcon flex-shrink-0">
                  <MaterialSymbol icon="storefront" size="medium" filled />
                </div>

                <div>
                  <h2
                    id="commerce-usage-title"
                    className="mb-1 fz-h2 fw-bold commerceActionsTitle"
                  >
                    Negocios registrados
                  </h2>

                  <p className="mb-0 fz-h4 fw-regular commerceActionsSubtitle">
                    Uso disponible en tu plan actual
                  </p>
                </div>
              </div>

              <div className={counterClass}>
                <span className="fz-h3 fw-bold">
                  {totalRegistrados} / {limiteDisponible ? max : "—"}
                </span>
              </div>
            </div>

            {/* PROGRESO */}
            <div className="commerceProgressContainer mt-4">
              <LinearProgress
                variant="determinate"
                value={porcentaje}
                className={progressClass}
                aria-label="Uso del límite de negocios"
                aria-valuetext={
                  limiteDisponible
                    ? `${totalRegistrados} de ${max} negocios utilizados`
                    : "Límite de negocios no disponible"
                }
              />

              <div className="d-flex align-items-center justify-content-between gap-3 mt-2">
                <p className={statusClass}>
                  <MaterialSymbol
                    icon={limiteAlcanzado ? "info" : "check_circle"}
                    size="small"
                    filled={!limiteAlcanzado}
                  />

                  <span>{statusMessage}</span>
                </p>

                {limiteDisponible && (
                  <span className="commerceUsagePercentage fz-h4 fw-semibold flex-shrink-0">
                    {Math.round(porcentaje)}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ACCIÓN */}
        <div className="col-12 col-lg-auto">
          <div className="d-grid d-lg-block">
            {!limiteAlcanzado ? (
              <Button
                component={Link}
                to="nuevo"
                variant="contained"
                className="commerceCreateButton"
                startIcon={<MaterialSymbol icon="add_business" size="small" />}
              >
                Nuevo negocio
              </Button>
            ) : (
              <Button
                type="button"
                variant="outlined"
                disabled
                className="commerceLimitButton"
                startIcon={<MaterialSymbol icon="lock" size="small" filled />}
              >
                Límite alcanzado
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
