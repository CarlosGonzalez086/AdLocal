import { Avatar, IconButton } from "@mui/material";
import type { FC } from "react";
import MaterialSymbol from "../../UI/MaterialSymbol/MaterialSymbol";

interface CommerceDetailGalleryProps {
  imagenes: string[];
  nombre: string;
  activeImage: number;
  onPrevImage: () => void;
  onNextImage: () => void;
  onSelectImage: (index: number) => void;
}

export const CommerceDetailGallery: FC<CommerceDetailGalleryProps> = ({
  imagenes,
  nombre,
  activeImage,
  onPrevImage,
  onNextImage,
  onSelectImage,
}) => {
  if (imagenes.length === 0) return null;

  return (
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
              alt={`Imagen ${activeImage + 1} de ${imagenes.length} de ${nombre}`}
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
                  onClick={onPrevImage}
                  aria-label="Mostrar imagen anterior"
                >
                  <MaterialSymbol icon="chevron_left" size="large" />
                </IconButton>

                <IconButton
                  type="button"
                  className="commerceDetailGalleryButton commerceDetailNextButton"
                  onClick={onNextImage}
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
                  key={`${image.slice(0, 30)}-${index}`}
                  type="button"
                  className={`commerceDetailGalleryIndicator ${
                    activeImage === index
                      ? "commerceDetailGalleryIndicatorActive"
                      : ""
                  }`}
                  onClick={() => onSelectImage(index)}
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
  );
};

export default CommerceDetailGallery;
