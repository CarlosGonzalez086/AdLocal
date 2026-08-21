import type { CSSProperties } from "react";
import { Button, TextField } from "@mui/material";
import type { SuscripcionDto } from "../../services/suscripcionApi";
import {
  calcularDiasRestantesDesdeHoy,
  utcToLocal,
} from "../../utils/generalsFunctions";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import { GenericModal } from "../GenericModal";

interface Props {
  open: boolean;
  onClose: () => void;
  suscripcion: SuscripcionDto | null;
}

interface PlanVisualConfig {
  gradient: string;
  accent: string;
  soft: string;
  glow: string;
  icon: string;
}

interface Benefit {
  label: string;
  icon: string;
}

interface LimitBoxProps {
  label: string;
  value: number;
  icon: string;
}

type PlanType = "BASIC" | "PRO" | "BUSINESS" | "FREE";

type ModalCssVariables = CSSProperties & {
  "--plan-gradient": string;
  "--plan-accent": string;
  "--plan-soft": string;
  "--plan-glow": string;
};

const PLAN_CONFIG: Record<PlanType, PlanVisualConfig> = {
  BASIC: {
    gradient: "linear-gradient(135deg, #007AFF, #005FCC)",
    accent: "#007AFF",
    soft: "rgba(0, 122, 255, 0.09)",
    glow: "rgba(0, 122, 255, 0.23)",
    icon: "bolt",
  },

  PRO: {
    gradient: "linear-gradient(135deg, #5856D6, #3634A3)",
    accent: "#5856D6",
    soft: "rgba(88, 86, 214, 0.09)",
    glow: "rgba(88, 86, 214, 0.23)",
    icon: "rocket_launch",
  },

  BUSINESS: {
    gradient: "linear-gradient(135deg, #FF9500, #CC7700)",
    accent: "#FF9500",
    soft: "rgba(255, 149, 0, 0.1)",
    glow: "rgba(255, 149, 0, 0.23)",
    icon: "business_center",
  },

  FREE: {
    gradient: "linear-gradient(135deg, #8E8E93, #636366)",
    accent: "#8E8E93",
    soft: "rgba(142, 142, 147, 0.1)",
    glow: "rgba(142, 142, 147, 0.18)",
    icon: "verified",
  },
};

const normalizePlanType = (value?: string): PlanType => {
  const normalizedValue = value?.trim().toUpperCase();

  if (
    normalizedValue === "BASIC" ||
    normalizedValue === "PRO" ||
    normalizedValue === "BUSINESS"
  ) {
    return normalizedValue;
  }

  return "FREE";
};

const normalizeNumber = (value: unknown): number => {
  const parsedValue = Number(value);

  return Number.isFinite(parsedValue) ? parsedValue : 0;
};

const normalizeLimit = (value: unknown): number => {
  return Math.max(Math.floor(normalizeNumber(value)), 0);
};

const formatPrice = (value: unknown): string => {
  return normalizeNumber(value).toLocaleString("es-MX", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

const LimitBox = ({ label, value, icon }: LimitBoxProps) => {
  return (
    <div className="subscriptionDetailLimitBox">
      <div className="subscriptionDetailLimitIcon">
        <MaterialSymbol icon={icon} size="medium" />
      </div>

      <strong className="subscriptionDetailLimitValue fz-h2 fw-bold">
        {normalizeLimit(value)}
      </strong>

      <span className="subscriptionDetailLimitLabel fz-h5 fw-regular">
        {label}
      </span>
    </div>
  );
};

export const SuscripcionDetalleModal = ({
  open,
  onClose,
  suscripcion,
}: Props) => {
  if (!suscripcion) {
    return null;
  }

  const { plan } = suscripcion;

  const planType = normalizePlanType(plan.tipo);

  const planConfig = PLAN_CONFIG[planType];

  const modalVariables: ModalCssVariables = {
    "--plan-gradient": planConfig.gradient,

    "--plan-accent": planConfig.accent,

    "--plan-soft": planConfig.soft,

    "--plan-glow": planConfig.glow,
  };

  const normalizedStatus = (suscripcion.estado ?? "").trim().toLowerCase();

  const isActive = ["active", "activo", "activa"].includes(normalizedStatus);

  const isCanceled = [
    "canceled",
    "cancelled",
    "cancelada",
    "canceling",
  ].includes(normalizedStatus);

  const statusLabel = isActive
    ? "Activo"
    : isCanceled
      ? "Cancelada"
      : "Inactiva";

  const statusIcon = isActive
    ? "check_circle"
    : isCanceled
      ? "cancel"
      : "schedule";

  const remainingDays = Math.max(
    Math.floor(
      normalizeNumber(calcularDiasRestantesDesdeHoy(suscripcion.fechaFin)),
    ),
    0,
  );

  const remainingDaysLabel =
    remainingDays > 40
      ? "De por vida"
      : remainingDays === 1
        ? "1 día restante"
        : remainingDays > 0
          ? `${remainingDays} días restantes`
          : "Periodo finalizado";

  const benefits: Benefit[] = [
    ...(plan.permiteCatalogo
      ? [
          {
            label: "Catálogo público",

            icon: "inventory_2",
          },
        ]
      : []),

    ...(plan.coloresPersonalizados
      ? [
          {
            label: "Colores personalizados",

            icon: "palette",
          },
        ]
      : []),

    ...(plan.tieneAnalytics
      ? [
          {
            label: "Analytics",

            icon: "monitoring",
          },
        ]
      : []),

    ...(plan.tieneBadge
      ? [
          {
            label: plan.badgeTexto?.trim() || "Distintivo especial",

            icon: "workspace_premium",
          },
        ]
      : []),

    ...(plan.isMultiUsuario
      ? [
          {
            label: "Multiusuario",

            icon: "group",
          },
        ]
      : []),
  ];

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={plan.nombre}
      subtitle={`Plan ${planType}`}
      icon={planConfig.icon}
      maxWidth="sm"
      secondaryLabel="Cerrar"
      hideActions
    >
      <div className="subscriptionDetail mt-4" style={modalVariables}>
        <div className="subscriptionDetailStatuses">
          <div
            className={[
              "subscriptionDetailStatusBadge",

              isActive
                ? "subscriptionDetailStatusActive"
                : isCanceled
                  ? "subscriptionDetailStatusCanceled"
                  : "subscriptionDetailStatusInactive",
            ].join(" ")}
          >
            <MaterialSymbol icon={statusIcon} size="small" filled />

            <span className="subscriptionDetailStatusText fz-h5 fw-semibold">
              {statusLabel}
            </span>
          </div>

          <div
            className={[
              "subscriptionDetailStatusBadge",

              suscripcion.autoRenew
                ? "subscriptionDetailStatusAutoRenew"
                : "subscriptionDetailStatusNoRenew",
            ].join(" ")}
          >
            <MaterialSymbol
              icon={suscripcion.autoRenew ? "autorenew" : "event_busy"}
              size="small"
            />

            <span className="subscriptionDetailStatusText fz-h5 fw-semibold">
              {suscripcion.autoRenew ? "Auto-renovación" : "Sin renovación"}
            </span>
          </div>
        </div>

        <div className="subscriptionDetailPriceCard">
          <div className="subscriptionDetailPriceIcon">
            <MaterialSymbol icon="payments" size="medium" />
          </div>

          <div className="subscriptionDetailPriceInformation">
            <div className="d-flex align-items-baseline gap-1">
              <strong className="subscriptionDetailPrice fw-bold">
                {Number(plan.precio) === 0
                  ? "Gratis"
                  : `$${formatPrice(plan.precio)}`}
              </strong>

              {Number(plan.precio) > 0 && (
                <span className="subscriptionDetailCurrency fz-h5 fw-semibold">
                  MXN
                </span>
              )}
            </div>

            <p className="subscriptionDetailRemainingDays fz-h5 fw-regular mb-0">
              {remainingDaysLabel}
            </p>
          </div>
        </div>

        <div
          className="subscriptionDetailSection"
          aria-labelledby="plan-capacities-title"
        >
          <div className="subscriptionDetailSectionHeader">
            <div className="subscriptionDetailSectionIcon">
              <MaterialSymbol icon="tune" size="small" />
            </div>

            <h3
              id="plan-capacities-title"
              className="subscriptionDetailSectionTitle fz-h3 fw-semibold mb-0"
            >
              Capacidades del plan
            </h3>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-4">
              <LimitBox
                label="Negocios"
                value={plan.maxNegocios}
                icon="storefront"
              />
            </div>

            <div className="col-12 col-sm-4">
              <LimitBox
                label="Productos"
                value={plan.maxProductos}
                icon="inventory_2"
              />
            </div>

            <div className="col-12 col-sm-4">
              <LimitBox
                label="Fotos"
                value={plan.maxFotos}
                icon="photo_library"
              />
            </div>
          </div>
        </div>

        {benefits.length > 0 && (
          <div
            className="subscriptionDetailSection"
            aria-labelledby="plan-benefits-title"
          >
            <div className="subscriptionDetailSectionHeader">
              <div className="subscriptionDetailSectionIcon">
                <MaterialSymbol icon="stars" size="small" />
              </div>

              <h3
                id="plan-benefits-title"
                className="subscriptionDetailSectionTitle fz-h3 fw-semibold mb-0"
              >
                Beneficios incluidos
              </h3>
            </div>

            <div className="subscriptionDetailBenefits">
              {benefits.map((benefit) => (
                <div
                  key={`${benefit.icon}-${benefit.label}`}
                  className="subscriptionDetailBenefit"
                >
                  <MaterialSymbol
                    icon={benefit.icon}
                    size="small"
                    className="subscriptionDetailBenefitIcon"
                  />

                  <span className="subscriptionDetailBenefitText fz-h5 fw-medium">
                    {benefit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="subscriptionDetailDivider" />

        <div
          className="subscriptionDetailSection"
          aria-labelledby="subscription-period-title"
        >
          <div className="subscriptionDetailSectionHeader">
            <div className="subscriptionDetailSectionIcon">
              <MaterialSymbol icon="calendar_month" size="small" />
            </div>

            <h3
              id="subscription-period-title"
              className="subscriptionDetailSectionTitle fz-h3 fw-semibold mb-0"
            >
              Periodo de suscripción
            </h3>
          </div>

          <div className="row g-3">
            <div className="col-12 col-sm-6">
              <TextField
                label="Inicio"
                value={utcToLocal(suscripcion.fechaInicio)}
                fullWidth
                disabled
                className="adlocalTextField subscriptionDetailDateField"
                slotProps={{
                  input: {
                    startAdornment: (
                      <MaterialSymbol
                        icon="event_available"
                        size="small"
                        className="subscriptionDetailInputIcon"
                      />
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12 col-sm-6">
              <TextField
                label="Fin"
                value={utcToLocal(suscripcion.fechaFin)}
                fullWidth
                disabled
                className="adlocalTextField subscriptionDetailDateField"
                slotProps={{
                  input: {
                    startAdornment: (
                      <MaterialSymbol
                        icon="event"
                        size="small"
                        className="subscriptionDetailInputIcon"
                      />
                    ),
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end mt-4">
          <Button
            className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold subscriptionDetailCloseButton"
            onClick={onClose}
          >
            <MaterialSymbol icon="check" size="small" />

            <span>Cerrar</span>
          </Button>
        </div>
      </div>
    </GenericModal>
  );
};
