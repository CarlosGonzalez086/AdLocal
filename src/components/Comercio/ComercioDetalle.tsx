import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState, type CSSProperties } from "react";

import type { ComercioDto } from "../../services/comercioApi";
import type { ProductoServicioDto } from "../../services/productosServiciosApi";

import ProductoCard from "../ProductosServicios/ProductoCard";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";


import { DIAS_SEMANA_MAP } from "../../utils/constantes";
import { estaAbiertoAhora } from "../../utils/generalsFunctions";

import styles from "../../styles/ComercioDetalle.module.css";

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
    premium: styles.premiumBadge,
    recommended: styles.recommendedBadge,
    essential: styles.essentialBadge,
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

const normalizePhone = (phone?: string): string => {
  return phone?.replace(/\D/g, "") ?? "";
};

const isValidLocation = (lat: number, lng: number): boolean => {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

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

  const badgeConfig = useMemo(
    () => getBadgeConfig(comercio.badge),
    [comercio.badge],
  );

  const horarios = useMemo(() => {
    return [...(comercio.horarios ?? [])].sort(
      (firstSchedule, secondSchedule) => firstSchedule.dia - secondSchedule.dia,
    );
  }, [comercio.horarios]);

  const abiertoAhora = useMemo(() => {
    if (horarios.length === 0) {
      return false;
    }

    return estaAbiertoAhora(horarios);
  }, [horarios]);

  const imagenes = useMemo(() => {
    return (comercio.imagenes ?? []).filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    );
  }, [comercio.imagenes]);

  const rating = useMemo(
    () => normalizeRating(comercio.calificacion),
    [comercio.calificacion],
  );

  const address = useMemo(() => {
    const addressParts = [
      comercio.direccion,
      comercio.municipioNombre,
      comercio.estadoNombre,
    ].filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    );

    return addressParts.length > 0
      ? `${addressParts.join(", ")}.`
      : "Dirección no disponible.";
  }, [comercio.direccion, comercio.municipioNombre, comercio.estadoNombre]);

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
    setActiveImage((currentIndex) => {
      if (currentIndex === 0) {
        return imagenes.length - 1;
      }

      return currentIndex - 1;
    });
  };

  const handleNextImage = () => {
    setActiveImage((currentIndex) => {
      if (currentIndex === imagenes.length - 1) {
        return 0;
      }

      return currentIndex + 1;
    });
  };

  return (
    <Box
      component="article"
      className={styles.container}
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

      <Box component="header" className={styles.hero}>
        <Box className={styles.heroDecoration} aria-hidden="true">
          <Box className={styles.heroDecorationOne} />

          <Box className={styles.heroDecorationTwo} />
        </Box>

        <Avatar
          src={showLogo ? comercio.logoBase64 : undefined}
          alt={`Logotipo de ${comercio.nombre}`}
          className={styles.logo}
          slotProps={{
            img: {
              onError: () => setLogoError(true),
            },
          }}
        >
          {!showLogo && commerceInitial}
        </Avatar>

        <Typography component="h1" className={styles.name}>
          {comercio.nombre}
        </Typography>

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
              <MaterialSymbol icon="star" className={styles.emptyRatingIcon} />
            }
          />
        </Stack>

        {comercio.descripcion && (
          <Typography component="p" className={styles.description}>
            {comercio.descripcion}
          </Typography>
        )}

        {horarios.length > 0 && (
          <Chip
            label={abiertoAhora ? "Abierto ahora" : "Cerrado ahora"}
            className={[
              styles.statusChip,
              abiertoAhora ? styles.openStatus : styles.closedStatus,
            ].join(" ")}
            icon={
              <MaterialSymbol
                icon={abiertoAhora ? "schedule" : "schedule_off"}
                size="small"
              />
            }
          />
        )}
      </Box>

      <Stack className={styles.content}>
        <Box
          component="section"
          className={styles.informationCard}
          aria-label="Información del comercio"
        >
          <Stack className={styles.informationList}>
            <Box className={styles.informationRow}>
              <Box className={styles.informationIcon}>
                <MaterialSymbol icon="location_on" size="medium" />
              </Box>

              <Typography component="p" className={styles.informationText}>
                {address}
              </Typography>
            </Box>

            {comercio.telefono && normalizedPhone && (
              <Box className={styles.informationRow}>
                <Box
                  className={[styles.informationIcon, styles.whatsAppIcon].join(
                    " ",
                  )}
                >
                  <MaterialSymbol icon="chat" size="medium" filled />
                </Box>

                <Link
                  href={`https://wa.me/${normalizedPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="none"
                  className={[styles.informationLink, styles.whatsAppLink].join(
                    " ",
                  )}
                >
                  {comercio.telefono}
                </Link>
              </Box>
            )}

            {comercio.email && (
              <Box className={styles.informationRow}>
                <Box className={styles.informationIcon}>
                  <MaterialSymbol icon="mail" size="medium" />
                </Box>

                <Link
                  href={`mailto:${comercio.email}`}
                  underline="none"
                  className={styles.informationLink}
                >
                  {comercio.email}
                </Link>
              </Box>
            )}

            {comercio.tipoComercio && (
              <Box className={styles.informationRow}>
                <Box className={styles.informationIcon}>
                  <MaterialSymbol icon="category" size="medium" />
                </Box>

                <Typography component="p" className={styles.informationText}>
                  {comercio.tipoComercio}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>

        <Divider className={styles.divider} />

        {imagenes.length > 0 && (
          <>
            <Box
              component="section"
              className={styles.gallerySection}
              aria-labelledby="commerce-gallery-title"
            >
              <Box className={styles.sectionHeading}>
                <Box className={styles.sectionHeadingIcon}>
                  <MaterialSymbol icon="photo_library" size="medium" />
                </Box>

                <Box>
                  <Typography
                    id="commerce-gallery-title"
                    component="h2"
                    className={styles.sectionTitle}
                  >
                    Imágenes del negocio
                  </Typography>

                  <Typography component="p" className={styles.sectionSubtitle}>
                    Conoce las instalaciones y servicios del comercio.
                  </Typography>
                </Box>
              </Box>

              <Box className={styles.gallery}>
                <Box className={styles.galleryImageContainer}>
                  <Box
                    component="img"
                    src={imagenes[activeImage]}
                    alt={`Imagen ${activeImage + 1} de ${imagenes.length} de ${
                      comercio.nombre
                    }`}
                    className={styles.galleryImage}
                  />

                  <Box className={styles.galleryOverlay} aria-hidden="true" />

                  <Box className={styles.galleryCounter}>
                    <MaterialSymbol icon="image" size="small" />

                    <span>
                      {activeImage + 1} / {imagenes.length}
                    </span>
                  </Box>

                  {imagenes.length > 1 && (
                    <>
                      <IconButton
                        type="button"
                        className={[
                          styles.galleryButton,
                          styles.previousButton,
                        ].join(" ")}
                        onClick={handlePreviousImage}
                        aria-label="Mostrar imagen anterior"
                      >
                        <MaterialSymbol icon="chevron_left" size="large" />
                      </IconButton>

                      <IconButton
                        type="button"
                        className={[
                          styles.galleryButton,
                          styles.nextButton,
                        ].join(" ")}
                        onClick={handleNextImage}
                        aria-label="Mostrar imagen siguiente"
                      >
                        <MaterialSymbol icon="chevron_right" size="large" />
                      </IconButton>
                    </>
                  )}
                </Box>

                {imagenes.length > 1 && (
                  <Box
                    className={styles.galleryIndicators}
                    role="tablist"
                    aria-label="Seleccionar imagen"
                  >
                    {imagenes.map((image, index) => (
                      <ButtonBase
                        key={`${image}-${index}`}
                        type="button"
                        className={[
                          styles.galleryIndicator,
                          activeImage === index
                            ? styles.galleryIndicatorActive
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        onClick={() => setActiveImage(index)}
                        role="tab"
                        aria-selected={activeImage === index}
                        aria-label={`Mostrar imagen ${index + 1}`}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </Box>

            <Divider className={styles.divider} />
          </>
        )}

        {horarios.length > 0 && (
          <Accordion elevation={0} className={styles.accordion}>
            <AccordionSummary
              className={styles.accordionSummary}
              expandIcon={<MaterialSymbol icon="expand_more" size="medium" />}
              aria-controls="commerce-schedule-content"
              id="commerce-schedule-header"
            >
              <Box className={styles.accordionTitleIcon}>
                <MaterialSymbol icon="schedule" size="medium" />
              </Box>

              <Box>
                <Typography component="h2" className={styles.accordionTitle}>
                  Horarios de atención
                </Typography>

                <Typography component="p" className={styles.accordionSubtitle}>
                  Consulta los días y horarios disponibles.
                </Typography>
              </Box>
            </AccordionSummary>

            <AccordionDetails
              id="commerce-schedule-content"
              className={styles.accordionDetails}
            >
              <Stack className={styles.scheduleList}>
                {horarios.map((schedule) => (
                  <Box
                    key={schedule.dia}
                    className={[
                      styles.scheduleRow,
                      schedule.abierto
                        ? styles.scheduleRowOpen
                        : styles.scheduleRowClosed,
                    ].join(" ")}
                  >
                    <Box className={styles.scheduleDay}>
                      <MaterialSymbol
                        icon={
                          schedule.abierto ? "calendar_today" : "event_busy"
                        }
                        size="small"
                      />

                      <Typography
                        component="span"
                        className={styles.scheduleDayText}
                      >
                        {DIAS_SEMANA_MAP[schedule.dia]}
                      </Typography>
                    </Box>

                    {schedule.abierto ? (
                      <Typography
                        component="span"
                        className={styles.scheduleTime}
                      >
                        {schedule.horaAperturaFormateada} –{" "}
                        {schedule.horaCierreFormateada}
                      </Typography>
                    ) : (
                      <Chip
                        label="Cerrado"
                        size="small"
                        variant="outlined"
                        className={styles.closedChip}
                      />
                    )}
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        )}

        <Accordion elevation={0} className={styles.accordion}>
          <AccordionSummary
            className={styles.accordionSummary}
            expandIcon={<MaterialSymbol icon="expand_more" size="medium" />}
            aria-controls="commerce-products-content"
            id="commerce-products-header"
          >
            <Box className={styles.accordionTitleIcon}>
              <MaterialSymbol icon="category" size="medium" />
            </Box>

            <Box>
              <Typography component="h2" className={styles.accordionTitle}>
                Productos y servicios
              </Typography>

              <Typography component="p" className={styles.accordionSubtitle}>
                Revisa lo que este comercio tiene disponible.
              </Typography>
            </Box>
          </AccordionSummary>

          <AccordionDetails
            id="commerce-products-content"
            className={[styles.accordionDetails, styles.productsDetails].join(
              " ",
            )}
          >
            {loadingProducts ? (
              <Box className={styles.productsLoading} aria-live="polite">
                <CircularProgress
                  size={32}
                  thickness={4.5}
                  className={styles.productsProgress}
                />

                <Typography
                  component="p"
                  className={styles.productsLoadingText}
                >
                  Cargando productos y servicios...
                </Typography>
              </Box>
            ) : productos.length === 0 ? (
              <Box className={styles.emptyProducts}>
                <Box className={styles.emptyProductsIcon}>
                  <MaterialSymbol icon="inventory_2" size="large" />
                </Box>

                <Typography
                  component="h3"
                  className={styles.emptyProductsTitle}
                >
                  Sin productos disponibles
                </Typography>

                <Typography
                  component="p"
                  className={styles.emptyProductsDescription}
                >
                  Este comercio todavía no ha publicado productos o servicios.
                </Typography>
              </Box>
            ) : (
              <Stack className={styles.productsList}>
                {productos.map((producto) => (
                  <Box key={producto.id} className={styles.productItem}>
                    <ProductoCard producto={producto} />
                  </Box>
                ))}
              </Stack>
            )}
          </AccordionDetails>
        </Accordion>

        {hasLocation && (
          <Box
            component="section"
            className={styles.locationSection}
            aria-labelledby="commerce-location-title"
          >
            <Box className={styles.sectionHeading}>
              <Box className={styles.sectionHeadingIcon}>
                <MaterialSymbol icon="map" size="medium" />
              </Box>

              <Box>
                <Typography
                  id="commerce-location-title"
                  component="h2"
                  className={styles.sectionTitle}
                >
                  Ubicación
                </Typography>

                <Typography component="p" className={styles.sectionSubtitle}>
                  Consulta dónde se encuentra el comercio.
                </Typography>
              </Box>
            </Box>

            {/* <Box className={styles.mapContainer}>
              <MapaComercio lat={latitude} lng={longitude} />
            </Box> */}

            <Button
              component="a"
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              fullWidth
              className={styles.mapButton}
              startIcon={<MaterialSymbol icon="directions" size="small" />}
              endIcon={<MaterialSymbol icon="open_in_new" size="small" />}
            >
              Ver ubicación en Google Maps
            </Button>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
