import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

import type { JwtClaims } from "../../services/auth.api";
import type { ComercioDto } from "../../services/comercioApi";

import { DIAS_SEMANA_MAP } from "../../utils/constantes";

// import MapaComercio from "./MapaComercio.client";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles/ComercioPreviewCard.module.css";

interface Props {
  comercio: ComercioDto;
  claims: JwtClaims;
  imagenes: string[];
  eliminar: () => void;
  setEditando: Dispatch<SetStateAction<boolean>>;
}

interface InfoRowProps {
  icon: string;
  text: string;
  tone?: "primary" | "success" | "error";
}

interface SectionTitleProps {
  icon?: string;
  text: string;
  description?: string;
}

interface SectionCardProps {
  children: ReactNode;
}

interface ColorChipProps {
  label: string;
  color?: string;
}

type CommerceCssVariables = CSSProperties & {
  "--commerce-primary": string;
  "--commerce-secondary": string;
};

type ColorChipCssVariables = CSSProperties & {
  "--color-chip": string;
};

const DEFAULT_PRIMARY_COLOR = "#007AFF";
const DEFAULT_SECONDARY_COLOR = "#0051FF";

const isPresent = (value: unknown): boolean => {
  return value !== null && value !== undefined && String(value).trim() !== "";
};

const InfoRow = ({ icon, text, tone = "primary" }: InfoRowProps) => {
  const toneClass = {
    primary: styles.infoIconPrimary,
    success: styles.infoIconSuccess,
    error: styles.infoIconError,
  }[tone];

  return (
    <Box className={styles.infoRow}>
      <Box className={[styles.infoIcon, toneClass].join(" ")}>
        <MaterialSymbol icon={icon} size="medium" filled={tone === "success"} />
      </Box>

      <Typography component="p" className={styles.infoText}>
        {text}
      </Typography>
    </Box>
  );
};

const SectionCard = ({ children }: SectionCardProps) => {
  return <Box className={styles.sectionCard}>{children}</Box>;
};

const SectionTitle = ({ icon, text, description }: SectionTitleProps) => {
  return (
    <Box className={styles.sectionHeading}>
      {icon && (
        <Box className={styles.sectionIcon}>
          <MaterialSymbol icon={icon} size="medium" />
        </Box>
      )}

      <Box className={styles.sectionHeadingText}>
        <Typography component="h2" className={styles.sectionTitle}>
          {text}
        </Typography>

        {description && (
          <Typography component="p" className={styles.sectionDescription}>
            {description}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

const ColorChip = ({ label, color }: ColorChipProps) => {
  const chipColor = color?.trim() || DEFAULT_PRIMARY_COLOR;

  const chipVariables: ColorChipCssVariables = {
    "--color-chip": chipColor,
  };

  return (
    <Chip
      label={label}
      size="small"
      className={styles.colorChip}
      style={chipVariables}
    />
  );
};

export function ComercioPreviewCard({
  comercio,
  claims,
  imagenes,
  eliminar,
  setEditando,
}: Props) {
  const [logoError, setLogoError] = useState(false);

  const colorPrimario = comercio.colorPrimario?.trim() || DEFAULT_PRIMARY_COLOR;

  const colorSecundario =
    comercio.colorSecundario?.trim() || DEFAULT_SECONDARY_COLOR;

  const commerceVariables: CommerceCssVariables = {
    "--commerce-primary": colorPrimario,
    "--commerce-secondary": colorSecundario,
  };

  const horariosOrdenados = useMemo(() => {
    return [...(comercio.horarios ?? [])].sort(
      (firstSchedule, secondSchedule) => firstSchedule.dia - secondSchedule.dia,
    );
  }, [comercio.horarios]);

  const maxFotos = useMemo(() => {
    const parsedValue = Number(claims.maxFotos);

    if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
      return imagenes.length;
    }

    return Math.floor(parsedValue);
  }, [claims.maxFotos, imagenes.length]);

  const imagenesVisibles = useMemo(() => {
    return imagenes
      .filter(
        (image): image is string =>
          typeof image === "string" && image.trim().length > 0,
      )
      .slice(0, maxFotos);
  }, [imagenes, maxFotos]);

  const address = useMemo(() => {
    const parts = [
      comercio.direccion,
      comercio.municipioNombre,
      comercio.estadoNombre,
    ].filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    );

    return parts.join(", ");
  }, [comercio.direccion, comercio.municipioNombre, comercio.estadoNombre]);

  const latitude = Number(comercio.lat);
  const longitude = Number(comercio.lng);

  const hasLocation =
    isPresent(comercio.lat) &&
    isPresent(comercio.lng) &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180;

  const showLogo = Boolean(comercio.logoBase64) && !logoError;

  const commerceInitial =
    comercio.nombre?.trim().charAt(0).toUpperCase() || "C";

  const hasGalleryOrSchedules =
    imagenesVisibles.length > 0 || horariosOrdenados.length > 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLogoError(false);
  }, [comercio.id, comercio.logoBase64]);

  return (
    <Card
      component="article"
      elevation={0}
      className={styles.card}
      style={commerceVariables}
    >
      <Box component="header" className={styles.hero}>
        <Box className={styles.heroDecoration} aria-hidden="true">
          <Box className={styles.heroDecorationPrimary} />

          <Box className={styles.heroDecorationSecondary} />
        </Box>

        <Avatar
          src={showLogo ? comercio.logoBase64 : undefined}
          alt={`Logotipo de ${comercio.nombre}`}
          variant="rounded"
          className={styles.logo}
          slotProps={{
            img: {
              onError: () => setLogoError(true),
            },
          }}
        >
          {!showLogo && commerceInitial}
        </Avatar>

        <Typography component="h1" className={styles.commerceName}>
          {comercio.nombre}
        </Typography>

        {comercio.descripcion && (
          <Typography component="p" className={styles.commerceDescription}>
            {comercio.descripcion}
          </Typography>
        )}
      </Box>

      <CardContent className={styles.content}>
        <SectionCard>
          <SectionTitle
            icon="contact_page"
            text="Información del comercio"
            description="Datos principales que podrán consultar los usuarios."
          />

          <Stack className={styles.infoList}>
            {address && (
              <InfoRow icon="location_on" text={address} tone="primary" />
            )}

            {comercio.telefono && (
              <InfoRow icon="call" text={comercio.telefono} tone="success" />
            )}

            {comercio.email && (
              <InfoRow icon="mail" text={comercio.email} tone="error" />
            )}
          </Stack>
        </SectionCard>

        <Divider className={styles.divider} />

        <SectionCard>
          <SectionTitle
            icon="palette"
            text="Colores de marca"
            description="Paleta utilizada en la presentación pública del negocio."
          />

          <Box className={styles.colorList}>
            <ColorChip label="Primario" color={colorPrimario} />

            <ColorChip label="Secundario" color={colorSecundario} />
          </Box>
        </SectionCard>

        {hasGalleryOrSchedules && (
          <>
            <Divider className={styles.divider} />

            <Box className={styles.galleryScheduleGrid}>
              {imagenesVisibles.length > 0 && (
                <Box
                  component="section"
                  className={styles.gallerySection}
                  aria-labelledby="preview-gallery-title"
                >
                  <SectionTitle
                    icon="photo_library"
                    text="Galería"
                    description={`${imagenesVisibles.length} ${
                      imagenesVisibles.length === 1
                        ? "imagen visible"
                        : "imágenes visibles"
                    } en este plan.`}
                  />

                  <Box className={styles.galleryGrid}>
                    {imagenesVisibles.map((image, index) => (
                      <Box
                        key={`${image}-${index}`}
                        className={styles.galleryItem}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`Imagen ${index + 1} de ${comercio.nombre}`}
                          className={styles.galleryImage}
                        />

                        <Box
                          className={styles.galleryImageOverlay}
                          aria-hidden="true"
                        />

                        <Box className={styles.galleryImageNumber}>
                          {index + 1}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}

              {horariosOrdenados.length > 0 && (
                <Box
                  component="section"
                  className={styles.scheduleSection}
                  aria-labelledby="preview-schedules-title"
                >
                  <SectionTitle
                    icon="schedule"
                    text="Horarios"
                    description="Días y horas configurados para la atención."
                  />

                  <Stack className={styles.scheduleList}>
                    {horariosOrdenados.map((schedule) => (
                      <Box
                        key={schedule.dia}
                        className={[
                          styles.scheduleRow,
                          schedule.abierto
                            ? styles.scheduleOpen
                            : styles.scheduleClosed,
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
                            {schedule.horaApertura} – {schedule.horaCierre}
                          </Typography>
                        ) : (
                          <Chip
                            label="Cerrado"
                            size="small"
                            className={styles.closedChip}
                          />
                        )}
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </>
        )}

        {hasLocation && (
          <>
            <Divider className={styles.divider} />

            <Box
              component="section"
              className={styles.mapSection}
              aria-labelledby="preview-location-title"
            >
              <SectionTitle
                icon="map"
                text="Ubicación"
                description="Vista previa de la ubicación registrada para el comercio."
              />

              {/* <Box className={styles.mapContainer}>
                <MapaComercio lat={latitude} lng={longitude} />
              </Box> */}
            </Box>
          </>
        )}

        <Divider className={styles.divider} />

        <Stack className={styles.actions}>
          <Button
            type="button"
            variant="contained"
            className={styles.editButton}
            onClick={() => setEditando(true)}
            startIcon={<MaterialSymbol icon="edit" size="small" />}
          >
            Editar comercio
          </Button>

          {claims.rol !== "Colaborador" && (
            <Button
              type="button"
              variant="outlined"
              className={styles.deleteButton}
              onClick={eliminar}
              startIcon={<MaterialSymbol icon="delete" size="small" />}
            >
              Eliminar comercio
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
