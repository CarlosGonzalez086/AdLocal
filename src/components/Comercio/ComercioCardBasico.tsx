import {
  Avatar,
  Box,
  Card,
  CardContent,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import type { ComercioDto } from "../../services/comercioApi";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles/ComercioCardBasico.module.css";

interface Props {
  comercio: ComercioDto;
}

type BadgeType = "premium" | "recommended" | "essential";

interface BadgeConfig {
  type: BadgeType;
  label: string;
  icon: string;
}

type CommerceCssVariables = CSSProperties & {
  "--commerce-primary": string;
  "--commerce-secondary": string;
};

const getBadgeConfig = (badge?: string): BadgeConfig | null => {
  if (!badge?.trim()) {
    return null;
  }

  const normalizedBadge = badge.trim().toLowerCase();

  if (normalizedBadge.includes("premium")) {
    return {
      type: "premium",
      label: "Premium",
      icon: "crown",
    };
  }

  if (normalizedBadge.includes("recomendado")) {
    return {
      type: "recommended",
      label: "Recomendado",
      icon: "recommend",
    };
  }

  return {
    type: "essential",
    label: "Esencial",
    icon: "verified",
  };
};

const getBadgeClassName = (badgeType: BadgeType): string => {
  const classes: Record<BadgeType, string> = {
    premium: styles.premiumBadge,
    recommended: styles.recommendedBadge,
    essential: styles.essentialBadge,
  };

  return classes[badgeType];
};

export default function ComercioCardBasico({ comercio }: Props) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageError(false);
  }, [comercio.logoBase64]);

  const showImage = Boolean(comercio.logoBase64) && !imageError;

  const badgeConfig = useMemo(
    () => getBadgeConfig(comercio.badge),
    [comercio.badge],
  );

  const address = useMemo(() => {
    const parts = [
      comercio.direccion,
      comercio.municipioNombre,
      comercio.estadoNombre,
    ].filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    );

    return parts.length > 0
      ? `${parts.join(", ")}.`
      : "Dirección no disponible.";
  }, [comercio.direccion, comercio.municipioNombre, comercio.estadoNombre]);

  const rating = useMemo(() => {
    const parsedRating = Number(comercio.promedioCalificacion);

    if (!Number.isFinite(parsedRating)) {
      return 0;
    }

    return Math.min(Math.max(parsedRating, 0), 5);
  }, [comercio.promedioCalificacion]);

  const commerceInitial =
    comercio.nombre?.trim().charAt(0).toUpperCase() || "C";

  const commerceVariables: CommerceCssVariables = {
    "--commerce-primary": comercio.colorPrimario || "#007AFF",

    "--commerce-secondary": comercio.colorSecundario || "#5AC8FA",
  };

  return (
    <Card
      component="article"
      elevation={0}
      className={styles.card}
      style={commerceVariables}
    >
      {badgeConfig && (
        <Box
          className={[styles.badge, getBadgeClassName(badgeConfig.type)].join(
            " ",
          )}
        >
          <MaterialSymbol icon={badgeConfig.icon} size="small" filled />

          <Typography component="span" className={styles.badgeText}>
            {badgeConfig.label}
          </Typography>
        </Box>
      )}

      <Box className={styles.media}>
        {showImage ? (
          <Box
            component="img"
            src={comercio.logoBase64}
            alt=""
            className={styles.coverImage}
            onError={() => setImageError(true)}
          />
        ) : (
          <Box className={styles.fallbackImage} aria-hidden="true">
            <MaterialSymbol icon="storefront" size="large" />
          </Box>
        )}

        <Box className={styles.mediaOverlay} aria-hidden="true" />

        <Avatar
          src={showImage ? comercio.logoBase64 : undefined}
          alt={`Logotipo de ${comercio.nombre}`}
          className={styles.avatar}
          slotProps={{
            img: {
              onError: () => setImageError(true),
            },
          }}
        >
          {!showImage && commerceInitial}
        </Avatar>

        <Typography
          component="h3"
          className={styles.commerceName}
          title={comercio.nombre}
        >
          {comercio.nombre}
        </Typography>
      </Box>

      <CardContent className={styles.content}>
        <Stack className={styles.information}>
          <Box className={styles.addressRow}>
            <MaterialSymbol
              icon="location_on"
              size="small"
              className={styles.addressIcon}
            />

            <Typography component="p" className={styles.address}>
              {address}
            </Typography>
          </Box>

          <Stack direction="row" className={styles.ratingRow}>
            <Typography component="span" className={styles.ratingValue}>
              {rating.toFixed(1)}
            </Typography>

            <Rating
              value={rating}
              precision={0.5}
              readOnly
              size="small"
              className={styles.rating}
              getLabelText={(value) => `${value} de 5 estrellas`}
              icon={
                <MaterialSymbol
                  icon="star"
                  filled
                  className={styles.ratingIcon}
                />
              }
              emptyIcon={
                <MaterialSymbol
                  icon="star"
                  className={styles.emptyRatingIcon}
                />
              }
            />

            <Typography component="span" className={styles.ratingLabel}>
              Calificación
            </Typography>
          </Stack>
        </Stack>

        <Box className={styles.actionContainer}>
          <Box className={styles.action} aria-hidden="true">
            <Typography component="span" className={styles.actionText}>
              Ver más detalles
            </Typography>

            <MaterialSymbol
              icon="arrow_forward_ios"
              size="small"
              className={styles.actionIcon}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
