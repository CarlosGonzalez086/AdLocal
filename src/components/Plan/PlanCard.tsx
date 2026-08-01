import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import type { CSSProperties } from "react";

import type { JwtClaims } from "../../services/auth.api";

import { Feature } from "../Feature";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles/PlanCard.module.css";

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
  claims?: JwtClaims | null;
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
  claims,
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

  const claimsWithStatus = claims as
    | (JwtClaims & {
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

  const currentPlanType = normalizePlanType(claims?.planTipo);

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
    <Box className={styles.wrapper} style={planVariables}>
      {showBadge && (
        <Box className={styles.badgeContainer}>
          <Box className={styles.badge}>
            <Box className={styles.badgePulse} aria-hidden="true" />

            <Typography component="span" className={styles.badgeText}>
              {normalizedBadge}
            </Typography>
          </Box>
        </Box>
      )}

      <Card
        component="article"
        elevation={0}
        className={[
          styles.card,
          esActivo ? styles.activeCard : "",
          showBadge ? styles.cardWithBadge : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Box
          component="header"
          className={[styles.header, showBadge ? styles.headerWithBadge : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <Box className={styles.headerDecoration} aria-hidden="true" />

          <Box className={styles.statusRow}>
            <Box className={styles.planIcon}>
              <MaterialSymbol icon={planConfig.icon} size="large" filled />
            </Box>

            {esActivo && (
              <Box className={styles.activeBadge}>
                <MaterialSymbol icon="check_circle" size="small" filled />

                <Typography component="span" className={styles.activeBadgeText}>
                  Activo
                </Typography>
              </Box>
            )}
          </Box>

          <Typography component="h2" className={styles.planName}>
            {nombre}
          </Typography>

          <Typography component="p" className={styles.duration}>
            {durationLabel}
          </Typography>

          <Box className={styles.priceContainer}>
            <Box className={styles.priceRow}>
              <Typography component="span" className={styles.price}>
                ${formatPrice(precio)}
              </Typography>

              <Typography component="span" className={styles.currency}>
                MXN
              </Typography>
            </Box>

            <Typography component="p" className={styles.taxLabel}>
              IVA incluido
            </Typography>
          </Box>
        </Box>

        <CardContent className={styles.content}>
          <Stack className={styles.features}>
            {features.map((feature) => (
              <Feature
                key={feature.label}
                label={feature.label}
                active={feature.active}
              />
            ))}
          </Stack>
        </CardContent>

        {showActions && (
          <CardActions className={styles.actions}>
            {esActivo ? (
              <Stack className={styles.activeActions}>
                {onVerDetalle && (
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    className={styles.detailsButton}
                    onClick={onVerDetalle}
                    startIcon={
                      <MaterialSymbol icon="receipt_long" size="small" />
                    }
                  >
                    Ver detalles
                  </Button>
                )}

                {isCanceled ? (
                  <Box className={styles.canceledNotice}>
                    <Box className={styles.canceledIcon}>
                      <MaterialSymbol icon="event_busy" size="medium" />
                    </Box>

                    <Box>
                      <Typography
                        component="p"
                        className={styles.canceledTitle}
                      >
                        Suscripción cancelada
                      </Typography>

                      <Typography
                        component="p"
                        className={styles.canceledDescription}
                      >
                        Tu plan seguirá activo hasta el final del periodo.
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  canCancel && (
                    <Button
                      type="button"
                      variant="contained"
                      fullWidth
                      className={styles.cancelButton}
                      onClick={onCancelar}
                      startIcon={<MaterialSymbol icon="cancel" size="small" />}
                    >
                      Cancelar plan
                    </Button>
                  )
                )}
              </Stack>
            ) : (
              canSelect && (
                <Button
                  type="button"
                  variant="contained"
                  size="large"
                  fullWidth
                  className={styles.selectButton}
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
          </CardActions>
        )}
      </Card>
    </Box>
  );
};
