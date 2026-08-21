import { Avatar, Button, Chip } from "@mui/material";

import {
  useEffect,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { DIAS_SEMANA_MAP } from "../../utils/constantes";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";
import type { ComercioDto } from "../../types/User/comercio";
import type { JwtPayload } from "../../User/Auth/PrivateRouteUsuario";

interface Props {
  comercio: ComercioDto;
  user: JwtPayload | null;
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
    primary: "commercePreviewInfoIconPrimary",

    success: "commercePreviewInfoIconSuccess",

    error: "commercePreviewInfoIconError",
  }[tone];

  return (
    <div className="d-flex align-items-center gap-3">
      <div className={`commercePreviewInfoIcon ${toneClass} flex-shrink-0`}>
        <MaterialSymbol icon={icon} size="medium" filled={tone === "success"} />
      </div>

      <p className="commercePreviewInfoText mb-0 fz-h4 fw-regular">{text}</p>
    </div>
  );
};

const SectionCard = ({ children }: SectionCardProps) => {
  return <div className="commercePreviewSectionCard">{children}</div>;
};

const SectionTitle = ({ icon, text, description }: SectionTitleProps) => {
  return (
    <div className="d-flex align-items-start gap-3 mb-4">
      {icon && (
        <div className="commercePreviewSectionIcon flex-shrink-0">
          <MaterialSymbol icon={icon} size="medium" />
        </div>
      )}

      <div className="flex-grow-1">
        <h2 className="commercePreviewSectionTitle fz-h2 fw-bold mb-1">
          {text}
        </h2>

        {description && (
          <p className="commercePreviewSectionDescription fz-h4 fw-regular mb-0">
            {description}
          </p>
        )}
      </div>
    </div>
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
      className="commercePreviewColorChip"
      style={chipVariables}
    />
  );
};

export function ComercioPreviewCard({
  comercio,
  user,
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

  const horariosOrdenados = [...(comercio.horarios ?? [])].sort(
    (firstSchedule, secondSchedule) => firstSchedule.dia - secondSchedule.dia,
  );

  const parsedMaxFotos = Number(user?.maxFotos);

  const maxFotos =
    Number.isFinite(parsedMaxFotos) && parsedMaxFotos > 0
      ? Math.floor(parsedMaxFotos)
      : imagenes.length;

  const imagenesVisibles = imagenes
    .filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    )
    .slice(0, maxFotos);

  const addressParts = [
    comercio.direccion,
    comercio.municipioNombre,
    comercio.estadoNombre,
  ].filter(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0,
  );

  const address = addressParts.join(", ");

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
    <div className="commercePreviewCard" style={commerceVariables}>
      <div className="commercePreviewHero">
        <div className="commercePreviewHeroDecoration" aria-hidden="true">
          <div className="commercePreviewHeroDecorationPrimary" />

          <div className="commercePreviewHeroDecorationSecondary" />
        </div>

        <Avatar
          src={showLogo ? comercio.logoBase64 : undefined}
          alt={`Logotipo de ${comercio.nombre}`}
          variant="rounded"
          className="commercePreviewLogo"
          slotProps={{
            img: {
              onError: () => setLogoError(true),
            },
          }}
        >
          {!showLogo && commerceInitial}
        </Avatar>

        <h1 className="commercePreviewCommerceName fz-h1 fw-bold mb-2">
          {comercio.nombre}
        </h1>

        {comercio.descripcion && (
          <p className="commercePreviewCommerceDescription fz-h4 fw-regular mb-0">
            {comercio.descripcion}
          </p>
        )}
      </div>

      <div className="commercePreviewContent">
        <SectionCard>
          <SectionTitle
            icon="contact_page"
            text="Información del comercio"
            description="Datos principales que podrán consultar los usuarios."
          />

          <div className="d-flex flex-column gap-3">
            {address && (
              <InfoRow icon="location_on" text={address} tone="primary" />
            )}

            {comercio.telefono && (
              <InfoRow icon="call" text={comercio.telefono} tone="success" />
            )}

            {comercio.email && (
              <InfoRow icon="mail" text={comercio.email} tone="error" />
            )}
          </div>
        </SectionCard>

        <hr className="commercePreviewDivider" />

        <SectionCard>
          <SectionTitle
            icon="palette"
            text="Colores de marca"
            description="Paleta utilizada en la presentación pública del negocio."
          />

          <div className="d-flex flex-wrap gap-2">
            <ColorChip label="Primario" color={colorPrimario} />

            <ColorChip label="Secundario" color={colorSecundario} />
          </div>
        </SectionCard>

        {hasGalleryOrSchedules && (
          <>
            <hr className="commercePreviewDivider" />

            <div className="row g-4">
              {/* GALLERY */}

              {imagenesVisibles.length > 0 && (
                <div className="col-12 col-xl-7">
                  <div
                    className="commercePreviewGallerySection"
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

                    <div className="row g-3">
                      {imagenesVisibles.map((image, index) => (
                        <div
                          key={`${image}-${index}`}
                          className="col-12 col-sm-6"
                        >
                          <div className="commercePreviewGalleryItem">
                            <Avatar
                              src={image}
                              alt={`Imagen ${index + 1} de ${comercio.nombre}`}
                              variant="square"
                              className="commercePreviewGalleryImage"
                            />

                            <div
                              className="commercePreviewGalleryImageOverlay"
                              aria-hidden="true"
                            />

                            <div className="commercePreviewGalleryImageNumber fz-h5 fw-semibold">
                              {index + 1}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {horariosOrdenados.length > 0 && (
                <div
                  className={
                    imagenesVisibles.length > 0 ? "col-12 col-xl-5" : "col-12"
                  }
                >
                  <div
                    className="commercePreviewScheduleSection"
                    aria-labelledby="preview-schedules-title"
                  >
                    <SectionTitle
                      icon="schedule"
                      text="Horarios"
                      description="Días y horas configurados para la atención."
                    />

                    <div className="d-flex flex-column gap-2">
                      {horariosOrdenados.map((schedule) => (
                        <div
                          key={schedule.dia}
                          className={`commercePreviewScheduleRow d-flex align-items-center justify-content-between gap-3 ${
                            schedule.abierto
                              ? "commercePreviewScheduleOpen"
                              : "commercePreviewScheduleClosed"
                          }`}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <MaterialSymbol
                              icon={
                                schedule.abierto
                                  ? "calendar_today"
                                  : "event_busy"
                              }
                              size="small"
                            />

                            <span className="commercePreviewScheduleDayText fz-h4 fw-semibold">
                              {DIAS_SEMANA_MAP[schedule.dia]}
                            </span>
                          </div>

                          {schedule.abierto ? (
                            <span className="commercePreviewScheduleTime fz-h4 fw-medium">
                              {schedule.horaApertura} – {schedule.horaCierre}
                            </span>
                          ) : (
                            <Chip
                              label="Cerrado"
                              size="small"
                              className="commercePreviewClosedChip"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {hasLocation && (
          <>
            <hr className="commercePreviewDivider" />

            <div
              className="commercePreviewMapSection"
              aria-labelledby="preview-location-title"
            >
              <SectionTitle
                icon="map"
                text="Ubicación"
                description="Vista previa de la ubicación registrada para el comercio."
              />

              <div className="commercePreviewCoordinates d-flex align-items-center gap-2">
                <MaterialSymbol icon="my_location" size="small" />

                <span className="fz-h4 fw-medium">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </span>
              </div>
            </div>
          </>
        )}

        <hr className="commercePreviewDivider" />

        <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
          <Button
            type="button"
            variant="contained"
            className="btn-adlocal--solid"
            onClick={() => setEditando(true)}
            startIcon={<MaterialSymbol icon="edit" size="small" />}
          >
            Editar comercio
          </Button>

          {user?.rol !== "Colaborador" && (
            <Button
              type="button"
              variant="outlined"
              className="btn-adlocal--ghost"
              onClick={eliminar}
              startIcon={<MaterialSymbol icon="delete" size="small" />}
            >
              Eliminar comercio
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
