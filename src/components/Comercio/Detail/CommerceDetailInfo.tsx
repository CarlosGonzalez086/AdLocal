import { Button } from "@mui/material";
import type { FC } from "react";
import MaterialSymbol from "../../UI/MaterialSymbol/MaterialSymbol";

interface CommerceDetailInfoProps {
  address: string;
  telefono?: string;
  normalizedPhone: string;
  email?: string;
  tipoComercio?: string;
  hasLocation: boolean;
  latitude: number;
  longitude: number;
}

export const CommerceDetailInfo: FC<CommerceDetailInfoProps> = ({
  address,
  telefono,
  normalizedPhone,
  email,
  tipoComercio,
  hasLocation,
  latitude,
  longitude,
}) => {
  return (
    <>
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

          {telefono && normalizedPhone && (
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
                {telefono}
              </a>
            </div>
          )}

          {email && (
            <div className="d-flex align-items-center gap-3">
              <div className="commerceDetailInformationIcon flex-shrink-0">
                <MaterialSymbol icon="mail" size="medium" />
              </div>

              <a
                href={`mailto:${email}`}
                className="commerceDetailInformationLink fz-h4 fw-medium"
              >
                {email}
              </a>
            </div>
          )}

          {tipoComercio && (
            <div className="d-flex align-items-center gap-3">
              <div className="commerceDetailInformationIcon flex-shrink-0">
                <MaterialSymbol icon="category" size="medium" />
              </div>

              <p className="commerceDetailInformationText mb-0 fz-h4 fw-regular">
                {tipoComercio}
              </p>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
};

export default CommerceDetailInfo;
