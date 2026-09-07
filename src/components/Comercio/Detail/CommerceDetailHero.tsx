import { Avatar, Chip, Rating } from "@mui/material";
import type { FC } from "react";
import MaterialSymbol from "../../UI/MaterialSymbol/MaterialSymbol";

export type BadgeType = "premium" | "recommended" | "essential";

export interface BadgeConfig {
  type: BadgeType;
  label: string;
  icon: string;
}

interface CommerceDetailHeroProps {
  nombre: string;
  descripcion?: string;
  logoBase64?: string;
  badgeConfig: BadgeConfig | null;
  rating: number;
  abiertoAhora: boolean;
  hasHorarios: boolean;
  showLogo: boolean;
  commerceInitial: string;
  onLogoError: () => void;
}

const getBadgeClassName = (badgeType: BadgeType): string => {
  const badgeClasses: Record<BadgeType, string> = {
    premium: "commerceDetailPremiumBadge",
    recommended: "commerceDetailRecommendedBadge",
    essential: "commerceDetailEssentialBadge",
  };
  return badgeClasses[badgeType];
};

export const CommerceDetailHero: FC<CommerceDetailHeroProps> = ({
  nombre,
  descripcion,
  logoBase64,
  badgeConfig,
  rating,
  abiertoAhora,
  hasHorarios,
  showLogo,
  commerceInitial,
  onLogoError,
}) => {
  return (
    <>
      {badgeConfig && (
        <div
          className={`commerceDetailBadge ${getBadgeClassName(
            badgeConfig.type,
          )}`}
        >
          <MaterialSymbol icon={badgeConfig.icon} size="small" filled />
          <span className="fz-h5 fw-semibold">{badgeConfig.label}</span>
        </div>
      )}

      <div className="commerceDetailHero">
        <div className="commerceDetailHeroDecoration" aria-hidden="true">
          <div className="commerceDetailHeroDecorationOne" />
          <div className="commerceDetailHeroDecorationTwo" />
        </div>

        <Avatar
          src={showLogo ? logoBase64 : undefined}
          alt={`Logotipo de ${nombre}`}
          className="commerceDetailLogo"
          slotProps={{
            img: {
              onError: onLogoError,
            },
          }}
        >
          {!showLogo && commerceInitial}
        </Avatar>

        <h1 className="commerceDetailName fz-h1 fw-bold mb-2">
          {nombre}
        </h1>

        <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
          <span className="commerceDetailRatingValue fz-h3 fw-bold">
            {rating.toFixed(1)}
          </span>

          <Rating
            value={rating}
            precision={0.5}
            readOnly
            size="small"
            className="commerceDetailRating"
            getLabelText={(value) => `${value} de 5 estrellas`}
            icon={
              <MaterialSymbol
                icon="star"
                filled
                className="commerceDetailRatingIcon"
              />
            }
            emptyIcon={
              <MaterialSymbol
                icon="star"
                className="commerceDetailEmptyRatingIcon"
              />
            }
          />
        </div>

        {descripcion && (
          <p className="commerceDetailDescription fz-h4 fw-regular mb-3">
            {descripcion}
          </p>
        )}

        {hasHorarios && (
          <Chip
            label={abiertoAhora ? "Abierto ahora" : "Cerrado ahora"}
            className={
              abiertoAhora
                ? "commerceDetailStatusChip commerceDetailOpenStatus"
                : "commerceDetailStatusChip commerceDetailClosedStatus"
            }
            icon={
              <MaterialSymbol
                icon={abiertoAhora ? "schedule" : "schedule_off"}
                size="small"
              />
            }
          />
        )}
      </div>
    </>
  );
};

export default CommerceDetailHero;
