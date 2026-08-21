import { Avatar, Button, Rating } from "@mui/material";
import { useEffect, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import type { ComercioDtoListItem } from "../../types/User/comercio";

interface Props {
  comercio: ComercioDtoListItem;
  isProductOrServiceCreation?: boolean;
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

const getBadgeClassName = (type: BadgeType): string => {
  const badgeClasses: Record<BadgeType, string> = {
    premium: "commerceCardPremiumBadge",

    recommended: "commerceCardRecommendedBadge",

    essential: "commerceCardEssentialBadge",
  };

  return badgeClasses[type];
};

export default function ComercioCard({
  comercio,
  isProductOrServiceCreation = false,
}: Props) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageError(false);
  }, [comercio.logoUrl]);

  const showImage = Boolean(comercio.logoUrl) && !imageError;

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

  const linkTo = isProductOrServiceCreation
    ? `comercio/${comercio.id}`
    : `vistaprevia/${comercio.id}`;

  const buttonLabel = isProductOrServiceCreation
    ? "Añadir productos o servicios"
    : "Explorar comercio";

  const commerceVariables: CommerceCssVariables = {
    "--commerce-primary": comercio.colorPrimario || "#007AFF",

    "--commerce-secondary": comercio.colorSecundario || "#5AC8FA",
  };

  return (
    <div className="commerceCard" style={commerceVariables}>
      {!isProductOrServiceCreation && badgeConfig && (
        <div
          className={`commerceCardBadge ${getBadgeClassName(badgeConfig.type)}`}
        >
          <MaterialSymbol icon={badgeConfig.icon} size="small" filled />

          <span className="fz-h5 fw-semibold commerceCardBadgeText">
            {badgeConfig.label}
          </span>
        </div>
      )}

      <div className="commerceCardMedia">
        {showImage ? (
          <Avatar
            src={comercio.logoUrl}
            alt={`Imagen de ${comercio.nombre}`}
            variant="square"
            className="commerceCardCoverImage"
            slotProps={{
              img: {
                onError: () => setImageError(true),
              },
            }}
          />
        ) : (
          <div className="commerceCardFallbackImage" aria-hidden="true">
            <MaterialSymbol icon="storefront" size="large" />
          </div>
        )}

        <div className="commerceCardMediaOverlay" aria-hidden="true" />

        <Avatar
          src={showImage ? comercio.logoUrl : undefined}
          alt={`Logotipo de ${comercio.nombre}`}
          className="commerceCardAvatar"
          slotProps={{
            img: {
              onError: () => setImageError(true),
            },
          }}
        >
          {!showImage && commerceInitial}
        </Avatar>

        <h3
          className="commerceCardName fz-h2 fw-bold mb-0"
          title={comercio.nombre}
        >
          {comercio.nombre}
        </h3>
      </div>

      <div className="commerceCardContent">
        <div className="commerceCardInformation">
          {!isProductOrServiceCreation && (
            <>
              <p className="commerceCardAddress d-flex align-items-start gap-2 mb-3 fz-h4 fw-regular">
                <MaterialSymbol
                  icon="location_on"
                  size="small"
                  className="commerceCardAddressIcon flex-shrink-0"
                />

                <span>{address}</span>
              </p>

              <div className="d-flex align-items-center gap-2 flex-wrap">
                <span className="commerceCardRatingValue fz-h3 fw-bold">
                  {rating.toFixed(1)}
                </span>

                <Rating
                  value={rating}
                  precision={0.5}
                  readOnly
                  size="small"
                  className="commerceCardRating"
                  getLabelText={(value) => `${value} de 5 estrellas`}
                  icon={
                    <MaterialSymbol
                      icon="star"
                      filled
                      className="commerceCardRatingIcon"
                    />
                  }
                  emptyIcon={
                    <MaterialSymbol
                      icon="star"
                      className="commerceCardEmptyRatingIcon"
                    />
                  }
                />

                <span className="commerceCardRatingLabel fz-h5 fw-regular">
                  Calificación
                </span>
              </div>
            </>
          )}
        </div>

        <div className="commerceCardActionContainer">
          <Button
            component={Link}
            to={linkTo}
            variant="outlined"
            fullWidth
            className="commerceCardActionButton"
            endIcon={<MaterialSymbol icon="arrow_forward_ios" size="small" />}
            aria-label={`${buttonLabel}: ${comercio.nombre}`}
          >
            {buttonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
