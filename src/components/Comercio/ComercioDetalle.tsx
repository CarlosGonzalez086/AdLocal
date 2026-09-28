import { useEffect, useState, type CSSProperties } from "react";
import type { ComercioDto } from "../../types/User/comercio";
import type { ProductoServicioDto } from "../../types/User/productosServicios";
import { estaAbiertoAhora } from "../../utils/generalsFunctions";
import { CommerceDetailCatalog } from "./Detail/CommerceDetailCatalog";
import { CommerceDetailGallery } from "./Detail/CommerceDetailGallery";
import {
  CommerceDetailHero,
  type BadgeConfig,
} from "./Detail/CommerceDetailHero";
import { CommerceDetailInfo } from "./Detail/CommerceDetailInfo";
import { CommerceDetailSchedule } from "./Detail/CommerceDetailSchedule";

interface Props {
  comercio: ComercioDto;
  productos: ProductoServicioDto[];
  loadingProducts: boolean;
}

type CommerceCssVariables = CSSProperties & {
  "--commerce-primary": string;
  "--commerce-secondary": string;
};

const DEFAULT_LATITUDE = 19.4326;
const DEFAULT_LONGITUDE = -99.1332;

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

const normalizeRating = (value: unknown): number => {
  const parsedValue = Number(value);
  if (!Number.isFinite(parsedValue)) {
    return 0;
  }
  return Math.min(Math.max(parsedValue, 0), 5);
};

const normalizePhone = (phone?: string): string =>
  phone?.replace(/\D/g, "") ?? "";

const isValidLocation = (lat: number, lng: number): boolean =>
  Number.isFinite(lat) &&
  Number.isFinite(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -180 &&
  lng <= 180;

const isDefaultLocation = (lat: number, lng: number): boolean => {
  const latitudeDifference = Math.abs(lat - DEFAULT_LATITUDE);
  const longitudeDifference = Math.abs(lng - DEFAULT_LONGITUDE);
  return latitudeDifference < 0.000001 && longitudeDifference < 0.000001;
};

export default function ComercioDetalle({
  comercio,
  productos,
  loadingProducts,
}: Props) {
  const [logoError, setLogoError] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const colorPrimario = comercio.colorPrimario || "#008989";
  const colorSecundario = comercio.colorSecundario || "#e7692c";

  const commerceVariables: CommerceCssVariables = {
    "--commerce-primary": colorPrimario,
    "--commerce-secondary": colorSecundario,
  };

  const badgeConfig = getBadgeConfig(comercio.badge);

  const horarios = [...(comercio.horarios ?? [])].sort(
    (firstSchedule, secondSchedule) => firstSchedule.dia - secondSchedule.dia,
  );

  const abiertoAhora = horarios.length > 0 ? estaAbiertoAhora(horarios) : false;

  const imagenes = (comercio.imagenes ?? []).filter(
    (image): image is string =>
      typeof image === "string" && image.trim().length > 0,
  );

  const rating = normalizeRating(comercio.calificacion);

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

  const latitude = Number(comercio.lat);
  const longitude = Number(comercio.lng);

  const hasLocation =
    isValidLocation(latitude, longitude) &&
    !isDefaultLocation(latitude, longitude);

  const normalizedPhone = normalizePhone(comercio.telefono);
  const showLogo = Boolean(comercio.logoBase64) && !logoError;
  const commerceInitial =
    comercio.nombre?.trim().charAt(0).toUpperCase() || "C";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogoError(false);
  }, [comercio.id, comercio.logoBase64]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveImage(0);
  }, [comercio.id]);

  const handlePreviousImage = () => {
    setActiveImage((currentIndex) =>
      currentIndex === 0 ? imagenes.length - 1 : currentIndex - 1,
    );
  };

  const handleNextImage = () => {
    setActiveImage((currentIndex) =>
      currentIndex === imagenes.length - 1 ? 0 : currentIndex + 1,
    );
  };

  return (
    <div className="commerceDetailContainer" style={commerceVariables}>
      <CommerceDetailHero
        nombre={comercio.nombre}
        descripcion={comercio.descripcion}
        logoBase64={comercio.logoBase64}
        badgeConfig={badgeConfig}
        rating={rating}
        abiertoAhora={abiertoAhora}
        hasHorarios={horarios.length > 0}
        showLogo={showLogo}
        commerceInitial={commerceInitial}
        onLogoError={() => setLogoError(true)}
      />

      <div className="commerceDetailContent">
        <CommerceDetailInfo
          address={address}
          telefono={comercio.telefono}
          normalizedPhone={normalizedPhone}
          email={comercio.email}
          tipoComercio={comercio.tipoComercio}
          hasLocation={hasLocation}
          latitude={latitude}
          longitude={longitude}
        />

        <hr className="commerceDetailDivider" />

        <CommerceDetailGallery
          imagenes={imagenes}
          nombre={comercio.nombre}
          activeImage={activeImage}
          onPrevImage={handlePreviousImage}
          onNextImage={handleNextImage}
          onSelectImage={setActiveImage}
        />

        <CommerceDetailSchedule horarios={horarios} />

        <CommerceDetailCatalog
          productos={productos}
          loadingProducts={loadingProducts}
        />
      </div>
    </div>
  );
}
