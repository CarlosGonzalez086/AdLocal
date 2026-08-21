import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Button,
  Chip,
  IconButton,
  Rating,
} from "@mui/material";
import { useEffect, useState, type CSSProperties } from "react";
import ProductoCard from "../ProductosServicios/ProductoCard";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import { DIAS_SEMANA_MAP } from "../../utils/constantes";
import { estaAbiertoAhora } from "../../utils/generalsFunctions";
import type { ProductoServicioDto } from "../../types/User/productosServicios";
import type { ComercioDto } from "../../types/User/comercio";

interface Props {
  comercio: ComercioDto;
  productos: ProductoServicioDto[];
  loadingProducts: boolean;
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

const getBadgeClassName = (badgeType: BadgeType): string => {
  const badgeClasses: Record<BadgeType, string> = {
    premium: "commerceDetailPremiumBadge",

    recommended: "commerceDetailRecommendedBadge",

    essential: "commerceDetailEssentialBadge",
  };

  return badgeClasses[badgeType];
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

  const colorPrimario = comercio.colorPrimario || "#6f4e37";

  const colorSecundario = comercio.colorSecundario || "#3e2723";

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
          src={showLogo ? comercio.logoBase64 : undefined}
          alt={`Logotipo de ${comercio.nombre}`}
          className="commerceDetailLogo"
          slotProps={{
            img: {
              onError: () => setLogoError(true),
            },
          }}
        >
          {!showLogo && commerceInitial}
        </Avatar>

        <h1 className="commerceDetailName fz-h1 fw-bold mb-2">
          {comercio.nombre}
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

        {comercio.descripcion && (
          <p className="commerceDetailDescription fz-h4 fw-regular mb-3">
            {comercio.descripcion}
          </p>
        )}

        {horarios.length > 0 && (
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

      <div className="commerceDetailContent">
        <div
          className="commerceDetailInformationCard"
          aria-label="Información del comercio"
        >
          <div className="d-flex flex-column gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="commerceDetailInformationIcon flex-shrink-0">
                <MaterialSymbol icon="location_on" size="medium" />
              </div>

              <p className="commerceDetailInformationText mb-0 fz-h4 fw-regular">
                {address}
              </p>
            </div>

            {comercio.telefono && normalizedPhone && (
              <div className="d-flex align-items-center gap-3">
                <div className="commerceDetailInformationIcon commerceDetailWhatsAppIcon flex-shrink-0">
                  <MaterialSymbol icon="chat" size="medium" filled />
                </div>

                <a
                  href={`https://wa.me/${normalizedPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="commerceDetailInformationLink commerceDetailWhatsAppLink fz-h4 fw-medium"
                >
                  {comercio.telefono}
                </a>
              </div>
            )}

            {comercio.email && (
              <div className="d-flex align-items-center gap-3">
                <div className="commerceDetailInformationIcon flex-shrink-0">
                  <MaterialSymbol icon="mail" size="medium" />
                </div>

                <a
                  href={`mailto:${comercio.email}`}
                  className="commerceDetailInformationLink fz-h4 fw-medium"
                >
                  {comercio.email}
                </a>
              </div>
            )}

            {comercio.tipoComercio && (
              <div className="d-flex align-items-center gap-3">
                <div className="commerceDetailInformationIcon flex-shrink-0">
                  <MaterialSymbol icon="category" size="medium" />
                </div>

                <p className="commerceDetailInformationText mb-0 fz-h4 fw-regular">
                  {comercio.tipoComercio}
                </p>
              </div>
            )}
          </div>
        </div>

        <hr className="commerceDetailDivider" />

        {imagenes.length > 0 && (
          <>
            <div
              className="commerceDetailGallerySection"
              aria-labelledby="commerce-gallery-title"
            >
              <div className="d-flex align-items-start gap-3 mb-4">
                <div className="commerceDetailSectionHeadingIcon flex-shrink-0">
                  <MaterialSymbol icon="photo_library" size="medium" />
                </div>

                <div>
                  <h2
                    id="commerce-gallery-title"
                    className="commerceDetailSectionTitle fz-h2 fw-bold mb-1"
                  >
                    Imágenes del negocio
                  </h2>

                  <p className="commerceDetailSectionSubtitle fz-h4 fw-regular mb-0">
                    Conoce las instalaciones y servicios del comercio.
                  </p>
                </div>
              </div>

              <div className="commerceDetailGallery">
                <div className="commerceDetailGalleryImageContainer">
                  <Avatar
                    src={imagenes[activeImage]}
                    alt={`Imagen ${activeImage + 1} de ${imagenes.length} de ${
                      comercio.nombre
                    }`}
                    variant="square"
                    className="commerceDetailGalleryImage"
                  />

                  <div
                    className="commerceDetailGalleryOverlay"
                    aria-hidden="true"
                  />

                  <div className="commerceDetailGalleryCounter d-flex align-items-center gap-1">
                    <MaterialSymbol icon="image" size="small" />

                    <span className="fz-h5 fw-semibold">
                      {activeImage + 1} / {imagenes.length}
                    </span>
                  </div>

                  {imagenes.length > 1 && (
                    <>
                      <IconButton
                        type="button"
                        className="commerceDetailGalleryButton commerceDetailPreviousButton"
                        onClick={handlePreviousImage}
                        aria-label="Mostrar imagen anterior"
                      >
                        <MaterialSymbol icon="chevron_left" size="large" />
                      </IconButton>

                      <IconButton
                        type="button"
                        className="commerceDetailGalleryButton commerceDetailNextButton"
                        onClick={handleNextImage}
                        aria-label="Mostrar imagen siguiente"
                      >
                        <MaterialSymbol icon="chevron_right" size="large" />
                      </IconButton>
                    </>
                  )}
                </div>

                {imagenes.length > 1 && (
                  <div
                    className="commerceDetailGalleryIndicators d-flex justify-content-center gap-2 mt-3"
                    role="tablist"
                    aria-label="Seleccionar imagen"
                  >
                    {imagenes.map((image, index) => (
                      <button
                        key={`${image}-${index}`}
                        type="button"
                        className={`commerceDetailGalleryIndicator ${
                          activeImage === index
                            ? "commerceDetailGalleryIndicatorActive"
                            : ""
                        }`}
                        onClick={() => setActiveImage(index)}
                        role="tab"
                        aria-selected={activeImage === index}
                        aria-label={`Mostrar imagen ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <hr className="commerceDetailDivider" />
          </>
        )}

        {horarios.length > 0 && (
          <Accordion elevation={0} className="commerceDetailAccordion">
            <AccordionSummary
              className="commerceDetailAccordionSummary"
              expandIcon={<MaterialSymbol icon="expand_more" size="medium" />}
              aria-controls="commerce-schedule-content"
              id="commerce-schedule-div"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="commerceDetailAccordionTitleIcon">
                  <MaterialSymbol icon="schedule" size="medium" />
                </div>

                <div>
                  <h2 className="commerceDetailAccordionTitle fz-h2 fw-bold mb-1">
                    Horarios de atención
                  </h2>

                  <p className="commerceDetailAccordionSubtitle fz-h4 fw-regular mb-0">
                    Consulta los días y horarios disponibles.
                  </p>
                </div>
              </div>
            </AccordionSummary>

            <AccordionDetails
              id="commerce-schedule-content"
              className="commerceDetailAccordionDetails"
            >
              <div className="d-flex flex-column gap-2">
                {horarios.map((schedule) => (
                  <div
                    key={schedule.dia}
                    className={`commerceDetailScheduleRow d-flex align-items-center justify-content-between gap-3 ${
                      schedule.abierto
                        ? "commerceDetailScheduleRowOpen"
                        : "commerceDetailScheduleRowClosed"
                    }`}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <MaterialSymbol
                        icon={
                          schedule.abierto ? "calendar_today" : "event_busy"
                        }
                        size="small"
                      />

                      <span className="commerceDetailScheduleDayText fz-h4 fw-semibold">
                        {DIAS_SEMANA_MAP[schedule.dia]}
                      </span>
                    </div>

                    {schedule.abierto ? (
                      <span className="commerceDetailScheduleTime fz-h4 fw-medium">
                        {schedule.horaAperturaFormateada} –{" "}
                        {schedule.horaCierreFormateada}
                      </span>
                    ) : (
                      <Chip
                        label="Cerrado"
                        size="small"
                        variant="outlined"
                        className="commerceDetailClosedChip"
                      />
                    )}
                  </div>
                ))}
              </div>
            </AccordionDetails>
          </Accordion>
        )}

        <Accordion elevation={0} className="commerceDetailAccordion mt-3">
          <AccordionSummary
            className="commerceDetailAccordionSummary"
            expandIcon={<MaterialSymbol icon="expand_more" size="medium" />}
            aria-controls="commerce-products-content"
            id="commerce-products-div"
          >
            <div className="d-flex align-items-center gap-3">
              <div className="commerceDetailAccordionTitleIcon">
                <MaterialSymbol icon="category" size="medium" />
              </div>

              <div>
                <h2 className="commerceDetailAccordionTitle fz-h2 fw-bold mb-1">
                  Productos y servicios
                </h2>

                <p className="commerceDetailAccordionSubtitle fz-h4 fw-regular mb-0">
                  Revisa lo que este comercio tiene disponible.
                </p>
              </div>
            </div>
          </AccordionSummary>

          <AccordionDetails
            id="commerce-products-content"
            className="commerceDetailAccordionDetails"
          >
            {loadingProducts ? (
              <div
                className="commerceDetailProductsLoading d-flex flex-column align-items-center justify-content-center"
                aria-live="polite"
              >
                <div
                  className="spinner-border"
                  role="status"
                  aria-hidden="true"
                />

                <p className="commerceDetailProductsLoadingText fz-h4 fw-medium mb-0 mt-3">
                  Cargando productos y servicios...
                </p>
              </div>
            ) : productos.length === 0 ? (
              <div className="commerceDetailEmptyProducts">
                <div className="commerceDetailEmptyProductsIcon">
                  <MaterialSymbol icon="inventory_2" size="large" />
                </div>

                <h3 className="commerceDetailEmptyProductsTitle fz-h3 fw-bold mb-2">
                  Sin productos disponibles
                </h3>

                <p className="commerceDetailEmptyProductsDescription fz-h4 fw-regular mb-0">
                  Este comercio todavía no ha publicado productos o servicios.
                </p>
              </div>
            ) : (
              <div className="row g-3">
                {productos.map((producto) => (
                  <div key={producto.id} className="col-12 col-md-6 col-xl-4">
                    <ProductoCard producto={producto} />
                  </div>
                ))}
              </div>
            )}
          </AccordionDetails>
        </Accordion>

        {hasLocation && (
          <div
            className="commerceDetailLocationSection mt-4"
            aria-labelledby="commerce-location-title"
          >
            <div className="d-flex align-items-start gap-3 mb-4">
              <div className="commerceDetailSectionHeadingIcon flex-shrink-0">
                <MaterialSymbol icon="map" size="medium" />
              </div>

              <div>
                <h2
                  id="commerce-location-title"
                  className="commerceDetailSectionTitle fz-h2 fw-bold mb-1"
                >
                  Ubicación
                </h2>

                <p className="commerceDetailSectionSubtitle fz-h4 fw-regular mb-0">
                  Consulta dónde se encuentra el comercio.
                </p>
              </div>
            </div>

            <Button
              component="a"
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              fullWidth
              className="commerceDetailMapButton"
              startIcon={<MaterialSymbol icon="directions" size="small" />}
              endIcon={<MaterialSymbol icon="open_in_new" size="small" />}
            >
              Ver ubicación en Google Maps
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
