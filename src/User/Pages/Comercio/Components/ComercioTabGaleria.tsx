import { Button } from "@mui/material";
import type { ChangeEvent, FC } from "react";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import { SectionHeader } from "../../Home/Components/SectionHeader";

interface ComercioTabGaleriaProps {
  editable: boolean;
  canUploadImages: boolean;
  galeria: string[] | undefined;
  maxFotos: number;
  handleGaleriaChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleReplaceImage: (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => Promise<void>;
  handleRemoveImage: (index: number) => void;
}

export const ComercioTabGaleria: FC<ComercioTabGaleriaProps> = ({
  editable,
  canUploadImages,
  galeria = [],
  maxFotos,
  handleGaleriaChange,
  handleReplaceImage,
  handleRemoveImage,
}) => {
  const galeriaList = galeria ?? [];

  return (
    <section className="commerceSectionCard">
      <SectionHeader
        icon="photo_library"
        title="Galería del comercio"
        description="Agrega imágenes de las instalaciones, productos o servicios."
      />

      {editable && (
        <Button
          variant="outlined"
          component="label"
          disabled={!canUploadImages}
          fullWidth
          className="commerceUploadGalleryButton fz-h4 fw-semibold"
          startIcon={
            <MaterialSymbol icon="add_photo_alternate" size="small" />
          }
        >
          Subir imágenes ({galeriaList.length}/{maxFotos})
          <input
            hidden
            type="file"
            accept="image/*"
            multiple
            onChange={handleGaleriaChange}
          />
        </Button>
      )}

      {editable && maxFotos <= 0 && (
        <p className="commerceGalleryLimitMessage fz-h4 fw-medium mt-3 mb-0">
          Tu plan no tiene imágenes de galería disponibles.
        </p>
      )}

      {galeriaList.length === 0 ? (
        <div className="commerceEmptyGallery">
          <div className="commerceEmptyGalleryIcon">
            <MaterialSymbol icon="imagesmode" size="large" />
          </div>

          <h3 className="commerceEmptyGalleryTitle fz-h3 fw-semibold">
            Galería vacía
          </h3>

          <p className="commerceEmptyGalleryDescription fz-h4 fw-regular">
            Las imágenes agregadas al comercio aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="row g-3 mt-2">
          {galeriaList.map((image, index) => (
            <div
              key={`${image.slice(0, 30)}-${index}`}
              className="col-12 col-sm-6 col-lg-4"
            >
              <div className="commerceGalleryItem">
                <img
                  src={image}
                  alt={`Imagen ${index + 1} de la galería`}
                  className="commerceGalleryImage"
                />

                {editable && (
                  <div className="d-flex align-items-center gap-2 p-3">
                    <Button
                      component="label"
                      size="small"
                      variant="outlined"
                      className="commerceReplaceButton fz-h5 fw-semibold"
                      startIcon={
                        <MaterialSymbol icon="sync" size="small" />
                      }
                    >
                      Reemplazar
                      <input
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                          void handleReplaceImage(index, event)
                        }
                      />
                    </Button>

                    <Button
                      type="button"
                      size="small"
                      className="commerceRemoveButton"
                      onClick={() => handleRemoveImage(index)}
                      aria-label={`Eliminar imagen ${index + 1}`}
                    >
                      <MaterialSymbol icon="delete" size="small" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default ComercioTabGaleria;
