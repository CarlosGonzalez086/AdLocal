import { Avatar, Rating } from "@mui/material";
import { useEffect, useState, type CSSProperties } from "react";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import type { ComercioDto } from "../../types/User/comercio";

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
    premium: "commerceBasicPremiumBadge",

    recommended: "commerceBasicRecommendedBadge",

    essential: "commerceBasicEssentialBadge",
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

  const badgeConfig = getBadgeConfig(comercio.badge);

  const addressParts = [
    comercio.direccion,
    comercio.municipioNombre,
    comercio.estadoNombre,
  ].filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

  const address =
    addressParts.length > 0
      ? `${addressParts.join(", ")}.`
      : "Dirección no disponible.";

  const parsedRating = Number(comercio.promedioCalificacion);

  const rating = Number.isFinite(parsedRating)
    ? Math.min(Math.max(parsedRating, 0), 5)
    : 0;

  const commerceInitial =
    comercio.nombre?.trim().charAt(0).toUpperCase() || "C";

  const commerceVariables: CommerceCssVariables = {
    "--commerce-primary": comercio.colorPrimario || "#007AFF",

    "--commerce-secondary": comercio.colorSecundario || "#5AC8FA",
  };

  return (
    <div className="commerceBasicCard" style={commerceVariables}>
      {badgeConfig && (
        <div
          className={`commerceBasicBadge ${getBadgeClassName(
            badgeConfig.type,
          )}`}
        >
          <MaterialSymbol icon={badgeConfig.icon} size="small" filled />

          <span className="commerceBasicBadgeText fz-h5 fw-semibold">
            {badgeConfig.label}
          </span>
        </div>
      )}

      <div className="commerceBasicMedia">
        {showImage ? (
          <Avatar
            src={comercio.logoBase64}
            alt={`Imagen de ${comercio.nombre}`}
            variant="square"
            className="commerceBasicCoverImage"
            slotProps={{
              img: {
                onError: () => setImageError(true),
              },
            }}
          />
        ) : (
          <div className="commerceBasicFallbackImage" aria-hidden="true">
            <MaterialSymbol icon="storefront" size="large" />
          </div>
        )}

        <div className="commerceBasicMediaOverlay" aria-hidden="true" />

        <Avatar
          src={showImage ? comercio.logoBase64 : undefined}
          alt={`Logotipo de ${comercio.nombre}`}
          className="commerceBasicAvatar"
          slotProps={{
            img: {
              onError: () => setImageError(true),
            },
          }}
        >
          {!showImage && commerceInitial}
        </Avatar>

        <h3
          className="commerceBasicName fz-h2 fw-bold mb-0"
          title={comercio.nombre}
        >
          {comercio.nombre}
        </h3>
      </div>

      <div className="commerceBasicContent">
        <div className="commerceBasicInformation">
          <div className="d-flex align-items-start gap-2 mb-3">
            <MaterialSymbol
              icon="location_on"
              size="small"
              className="commerceBasicAddressIcon flex-shrink-0"
            />

            <p className="commerceBasicAddress mb-0 fz-h4 fw-regular">
              {address}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2 flex-wrap">
            <span className="commerceBasicRatingValue fz-h3 fw-bold">
              {rating.toFixed(1)}
            </span>

            <Rating
              value={rating}
              precision={0.5}
              readOnly
              size="small"
              className="commerceBasicRating"
              getLabelText={(value) => `${value} de 5 estrellas`}
              icon={
                <MaterialSymbol
                  icon="star"
                  filled
                  className="commerceBasicRatingIcon"
                />
              }
              emptyIcon={
                <MaterialSymbol
                  icon="star"
                  className="commerceBasicEmptyRatingIcon"
                />
              }
            />

            <span className="commerceBasicRatingLabel fz-h5 fw-regular">
              Calificación
            </span>
          </div>
        </div>

        <div className="commerceBasicActionContainer">
          <div
            className="commerceBasicAction d-flex align-items-center justify-content-between gap-2"
            aria-hidden="true"
          >
            <span className="commerceBasicActionText fz-h4 fw-semibold">
              Ver más detalles
            </span>

            <MaterialSymbol
              icon="arrow_forward_ios"
              size="small"
              className="commerceBasicActionIcon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
