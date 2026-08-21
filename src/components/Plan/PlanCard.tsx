import { Button } from "@mui/material";
import type { CSSProperties } from "react";

import { Feature } from "../Feature";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import type { JwtPayload } from "../../User/Auth/PrivateRouteUsuario";

export interface PlanCardProps {
  nombre: string;

  tipo: string;

  dias: number;

  precio: number;

  maxNegocios: number;

  maxProductos: number;

  maxFotos: number;

  permiteCatalogo: boolean;

  tieneAnalytics: boolean;

  isMultiUsuario: boolean;

  coloresPersonalizados: boolean;

  soportePrioritario: boolean;

  onSelect?: () => void;

  esActivo?: boolean;

  onCancelar?: () => void;

  onVerDetalle?: () => void;

  user?: JwtPayload | null;

  isPublic?: boolean;

  badgeTexto: string;
}

interface PlanVisualConfig {
  gradient: string;

  badgeGradient: string;

  glow: string;

  accent: string;

  icon: string;
}

type PlanCssVariables = CSSProperties & {
  "--plan-gradient": string;

  "--plan-badge-gradient": string;

  "--plan-glow": string;

  "--plan-accent": string;
};

const PLAN_CONFIG: Record<string, PlanVisualConfig> = {
  BASIC: {
    gradient: "linear-gradient(135deg, #007AFF, #005FCC)",

    badgeGradient: "linear-gradient(135deg, #007AFF, #00D2FF)",

    glow: "rgba(0, 122, 255, 0.28)",

    accent: "#007AFF",

    icon: "bolt",
  },

  PRO: {
    gradient: "linear-gradient(135deg, #5856D6, #3634A3)",

    badgeGradient: "linear-gradient(135deg, #5856D6, #BF5AF2)",

    glow: "rgba(88, 86, 214, 0.28)",

    accent: "#5856D6",

    icon: "rocket_launch",
  },

  BUSINESS: {
    gradient: "linear-gradient(135deg, #FF9500, #CC7700)",

    badgeGradient: "linear-gradient(135deg, #FF9500, #FF6B00)",

    glow: "rgba(255, 149, 0, 0.28)",

    accent: "#FF9500",

    icon: "business_center",
  },

  FREE: {
    gradient: "linear-gradient(135deg, #8E8E93, #636366)",

    badgeGradient: "linear-gradient(135deg, #8E8E93, #AEAEB2)",

    glow: "rgba(142, 142, 147, 0.2)",

    accent: "#8E8E93",

    icon: "verified",
  },
};

const normalizePlanType = (type?: string): string => {
  return type?.trim().toUpperCase() || "FREE";
};

const normalizeLimit = (value: unknown): number => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return Math.floor(parsedValue);
};

const normalizeDays = (value: unknown): number => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return Math.floor(parsedValue);
};

const formatPrice = (value: unknown): string => {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return "0";
  }

  return parsedValue.toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const PlanCard = ({
  nombre,
  tipo,
  dias,
  precio,
  maxNegocios,
  maxProductos,
  maxFotos,
  permiteCatalogo,
  tieneAnalytics,
  isMultiUsuario,
  coloresPersonalizados,
  soportePrioritario,
  onSelect,
  esActivo = false,
  onCancelar,
  onVerDetalle,
  user,
  isPublic = false,
  badgeTexto,
}: PlanCardProps) => {
  const planType = normalizePlanType(tipo);

  const planConfig = PLAN_CONFIG[planType] ?? PLAN_CONFIG.FREE;

  const planVariables: PlanCssVariables = {
    "--plan-gradient": planConfig.gradient,

    "--plan-badge-gradient": planConfig.badgeGradient,

    "--plan-glow": planConfig.glow,

    "--plan-accent": planConfig.accent,
  };

  const claimsWithStatus = user as
    | (JwtPayload & {
        estado?: string;

        esatdo?: string;
      })
    | null
    | undefined;

  const subscriptionStatus = (
    claimsWithStatus?.estado ??
    claimsWithStatus?.esatdo ??
    ""
  )
    .trim()
    .toLowerCase();

  const isCanceled =
    subscriptionStatus === "cancelada" || subscriptionStatus === "canceling";

  const currentPlanType = normalizePlanType(user?.planTipo);

  const isSamePlan = currentPlanType === planType;

  const normalizedBadge = badgeTexto?.trim() ?? "";

  const showBadge = normalizedBadge.length > 0;

  const normalizedDays = normalizeDays(dias);

  const durationLabel =
    normalizedDays > 60
      ? "Sin vencimiento"
      : normalizedDays === 1
        ? "1 día de duración"
        : `${normalizedDays} días de duración`;

  const features = [
    {
      label: `Hasta ${normalizeLimit(maxNegocios)} negocios`,

      active: true,
    },

    {
      label: `Hasta ${normalizeLimit(maxProductos)} productos por negocio`,

      active: true,
    },

    {
      label: `Hasta ${normalizeLimit(maxFotos)} fotos por negocio`,

      active: true,
    },

    {
      label: "Catálogo público",

      active: permiteCatalogo,
    },

    {
      label: "Analytics",

      active: tieneAnalytics,
    },

    {
      label: "Multiusuario",

      active: isMultiUsuario,
    },

    {
      label: "Colores personalizados",

      active: coloresPersonalizados,
    },

    {
      label: "Soporte prioritario",

      active: soportePrioritario,
    },
  ];

  const canCancel =
    Boolean(onCancelar) && currentPlanType !== "FREE" && !isCanceled;

  const canSelect = Boolean(onSelect) && !esActivo && !isSamePlan;

  const showActiveActions =
    esActivo && (Boolean(onVerDetalle) || isCanceled || canCancel);

  const showActions = !isPublic && (showActiveActions || canSelect);

  return (
    <div className="planCardWrapper" style={planVariables}>
      {showBadge && (
        <div className="planCardBadgeContainer">
          <div className="planCardBadge">
            <span className="planCardBadgePulse" aria-hidden="true" />

            <span className="planCardBadgeText fz-h5 fw-semibold">
              {normalizedBadge}
            </span>
          </div>
        </div>
      )}

      <div
        className={[
          "planCard",

          esActivo ? "planCardActive" : "",

          showBadge ? "planCardWithBadge" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div
          className={[
            "planCardHeader",

            showBadge ? "planCardHeaderWithBadge" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="planCardHeaderDecoration" aria-hidden="true" />

          <div className="d-flex align-items-center justify-content-between gap-3 position-relative">
            <div className="planCardIcon">
              <MaterialSymbol icon={planConfig.icon} size="large" filled />
            </div>

            {esActivo && (
              <div className="planCardActiveBadge">
                <MaterialSymbol icon="check_circle" size="small" filled />

                <span className="planCardActiveBadgeText fz-h5 fw-semibold">
                  Activo
                </span>
              </div>
            )}
          </div>

          <h2 className="planCardName fz-h1 fw-bold mb-1">{nombre}</h2>

          <p className="planCardDuration fz-h5 fw-regular mb-0">
            {durationLabel}
          </p>

          <div className="planCardPriceContainer">
            <div className="d-flex align-items-baseline gap-1">
              <span className="planCardPrice fw-bold">
                ${formatPrice(precio)}
              </span>

              <span className="planCardCurrency fz-h5 fw-semibold">MXN</span>
            </div>

            <p className="planCardTaxLabel fz-h6 fw-regular mb-0">
              IVA incluido
            </p>
          </div>
        </div>

        <div className="planCardContent">
          <div className="d-flex flex-column gap-2 planCardFeatures">
            {features.map((feature) => (
              <Feature
                key={feature.label}
                label={feature.label}
                active={feature.active}
              />
            ))}
          </div>
        </div>

        {showActions && (
          <div className="planCardActions">
            {esActivo ? (
              <div className="d-flex flex-column gap-2">
                {onVerDetalle && (
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    className="btn-adlocal fz-h4 fw-semibold"
                    onClick={onVerDetalle}
                    startIcon={
                      <MaterialSymbol icon="receipt_long" size="small" />
                    }
                  >
                    Ver detalles
                  </Button>
                )}

                {isCanceled ? (
                  <div className="planCardCanceledNotice">
                    <div className="planCardCanceledIcon flex-shrink-0">
                      <MaterialSymbol icon="event_busy" size="medium" />
                    </div>

                    <div>
                      <p className="planCardCanceledTitle fz-h4 fw-semibold mb-1">
                        Suscripción cancelada
                      </p>

                      <p className="planCardCanceledDescription fz-h5 fw-regular mb-0">
                        Tu plan seguirá activo hasta el final del periodo.
                      </p>
                    </div>
                  </div>
                ) : (
                  canCancel && (
                    <Button
                      type="button"
                      variant="outlined"
                      fullWidth
                      className="btn-adlocal btn-adlocal--danger fz-h4 fw-semibold"
                      onClick={onCancelar}
                      startIcon={<MaterialSymbol icon="cancel" size="small" />}
                    >
                      Cancelar plan
                    </Button>
                  )
                )}
              </div>
            ) : (
              canSelect && (
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  fullWidth
                  className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
                  onClick={onSelect}
                  startIcon={
                    <MaterialSymbol
                      icon={isCanceled ? "restart_alt" : "arrow_forward"}
                      size="small"
                    />
                  }
                >
                  {isCanceled ? "Reactivar suscripción" : "Seleccionar plan"}
                </Button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
