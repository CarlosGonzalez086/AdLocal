import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import type { CSSProperties, ReactElement } from "react";

import type { SuscripcionDto } from "../../services/suscripcionApi";

import {
  calcularDiasRestantesDesdeHoy,
  utcToLocal,
} from "../../utils/generalsFunctions";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles/SuscripcionDetalleModal.module.css";

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
    <Box className={styles.limitBox}>
      <Box className={styles.limitIcon}>
        <MaterialSymbol icon={icon} size="medium" />
      </Box>

      <Typography component="strong" className={styles.limitValue}>
        {normalizeLimit(value)}
      </Typography>

      <Typography component="span" className={styles.limitLabel}>
        {label}
      </Typography>
    </Box>
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
    remainingDays > 0
      ? remainingDays === 1
        ? "1 día restante"
        : `${remainingDays} días restantes`
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="subscription-detail-title"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
          style: modalVariables,
        },

        backdrop: {
          className: styles.dialogBackdrop,
        },
      }}
    >
      <Box component="header" className={styles.header}>
        <Box className={styles.headerDecoration} aria-hidden="true" />

        <Box className={styles.headerContent}>
          <Box className={styles.planHeading}>
            <Box className={styles.planIcon}>
              <MaterialSymbol icon={planConfig.icon} size="large" filled />
            </Box>

            <Box className={styles.planHeadingText}>
              <Typography
                id="subscription-detail-title"
                component="h2"
                className={styles.planName}
              >
                {plan.nombre}
              </Typography>

              <Typography component="p" className={styles.planType}>
                Plan {planType}
              </Typography>

              <Box className={styles.statuses}>
                <Box
                  className={[
                    styles.statusBadge,
                    isActive
                      ? styles.activeStatus
                      : isCanceled
                        ? styles.canceledStatus
                        : styles.inactiveStatus,
                  ].join(" ")}
                >
                  <MaterialSymbol icon={statusIcon} size="small" filled />

                  <Typography component="span" className={styles.statusText}>
                    {statusLabel}
                  </Typography>
                </Box>

                <Box
                  className={[
                    styles.statusBadge,
                    suscripcion.autoRenew
                      ? styles.autoRenewStatus
                      : styles.noRenewStatus,
                  ].join(" ")}
                >
                  <MaterialSymbol
                    icon={suscripcion.autoRenew ? "autorenew" : "event_busy"}
                    size="small"
                  />

                  <Typography component="span" className={styles.statusText}>
                    {suscripcion.autoRenew
                      ? "Auto-renovación"
                      : "Sin renovación"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <IconButton
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Cerrar detalle de suscripción"
          >
            <MaterialSymbol icon="close" size="small" />
          </IconButton>
        </Box>
      </Box>

      <DialogContent className={styles.content}>
        <Box className={styles.priceCard}>
          <Box className={styles.priceIcon}>
            <MaterialSymbol icon="payments" size="medium" />
          </Box>

          <Box className={styles.priceInformation}>
            <Box className={styles.priceRow}>
              <Typography component="strong" className={styles.price}>
                ${formatPrice(plan.precio)}
              </Typography>

              <Typography component="span" className={styles.currency}>
                MXN
              </Typography>
            </Box>

            <Typography component="p" className={styles.remainingDays}>
              {remainingDaysLabel}
            </Typography>
          </Box>
        </Box>

        <Box
          component="section"
          className={styles.section}
          aria-labelledby="plan-capacities-title"
        >
          <Box className={styles.sectionHeader}>
            <Box className={styles.sectionIcon}>
              <MaterialSymbol icon="tune" size="small" />
            </Box>

            <Typography
              id="plan-capacities-title"
              component="h3"
              className={styles.sectionTitle}
            >
              Capacidades del plan
            </Typography>
          </Box>

          <Box className={styles.limitsGrid}>
            <LimitBox
              label="Negocios"
              value={plan.maxNegocios}
              icon="storefront"
            />

            <LimitBox
              label="Productos"
              value={plan.maxProductos}
              icon="inventory_2"
            />

            <LimitBox
              label="Fotos"
              value={plan.maxFotos}
              icon="photo_library"
            />
          </Box>
        </Box>

        {benefits.length > 0 && (
          <Box
            component="section"
            className={styles.section}
            aria-labelledby="plan-benefits-title"
          >
            <Box className={styles.sectionHeader}>
              <Box className={styles.sectionIcon}>
                <MaterialSymbol icon="stars" size="small" />
              </Box>

              <Typography
                id="plan-benefits-title"
                component="h3"
                className={styles.sectionTitle}
              >
                Beneficios incluidos
              </Typography>
            </Box>

            <Box className={styles.benefits}>
              {benefits.map((benefit) => (
                <Chip
                  key={`${benefit.icon}-${benefit.label}`}
                  icon={
                    (
                      <MaterialSymbol icon={benefit.icon} size="small" />
                    ) as ReactElement
                  }
                  label={benefit.label}
                  size="small"
                  className={styles.benefitChip}
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider className={styles.divider} />

        <Box
          component="section"
          className={styles.section}
          aria-labelledby="subscription-period-title"
        >
          <Box className={styles.sectionHeader}>
            <Box className={styles.sectionIcon}>
              <MaterialSymbol icon="calendar_month" size="small" />
            </Box>

            <Typography
              id="subscription-period-title"
              component="h3"
              className={styles.sectionTitle}
            >
              Periodo de suscripción
            </Typography>
          </Box>

          <Box className={styles.datesGrid}>
            <TextField
              label="Inicio"
              value={utcToLocal(suscripcion.fechaInicio)}
              fullWidth
              disabled
              className={styles.dateField}
              slotProps={{
                input: {
                  startAdornment: (
                    <MaterialSymbol
                      icon="event_available"
                      size="small"
                      className={styles.inputIcon}
                    />
                  ),
                },
              }}
            />

            <TextField
              label="Fin"
              value={utcToLocal(suscripcion.fechaFin)}
              fullWidth
              disabled
              className={styles.dateField}
              slotProps={{
                input: {
                  startAdornment: (
                    <MaterialSymbol
                      icon="event"
                      size="small"
                      className={styles.inputIcon}
                    />
                  ),
                },
              }}
            />
          </Box>
        </Box>
      </DialogContent>

      <Box component="footer" className={styles.footer}>
        <Button
          type="button"
          fullWidth
          onClick={onClose}
          className={styles.closeAction}
          startIcon={<MaterialSymbol icon="check" size="small" />}
        >
          Cerrar
        </Button>
      </Box>
    </Dialog>
  );
};
