import { Button } from "@mui/material";
import type { FC } from "react";
import ComercioCardBasico from "../../../../components/Comercio/ComercioCardBasico";
import ComercioDetalle from "../../../../components/Comercio/ComercioDetalle";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import type { ComercioDto } from "../../../../types/User/comercio";
import type { ProductoServicioDto } from "../../../../types/User/productosServicios";
import SectionHeader from "./SectionHeader";

interface PreviewCommerceBasicProps {
  comercio: ComercioDto;
  productos: ProductoServicioDto[];
  loadingProducts: boolean;
  verDetalle: boolean;
  onSetVerDetalle: (ver: boolean) => void;
}

export const PreviewCommerceBasic: FC<PreviewCommerceBasicProps> = ({
  comercio,
  productos,
  loadingProducts,
  verDetalle,
  onSetVerDetalle,
}) => {
  return (
    <div className="basicSection">
      {!verDetalle ? (
        <>
          <SectionHeader
            icon="visibility"
            title="Vista previa"
            description="Consulta cómo se muestra tu comercio a los usuarios."
          />

          <hr className="basicSectionDivider" />

          <div className="basicCardContainer">
            <Button
              type="button"
              className="basicPreviewButton"
              onClick={() => onSetVerDetalle(true)}
              aria-label={`Abrir vista detallada de ${comercio.nombre}`}
            >
              <ComercioCardBasico comercio={comercio} />
            </Button>

            <p className="previewHint d-flex align-items-center justify-content-center gap-2 fz-h5 fw-medium mb-0">
              <MaterialSymbol icon="touch_app" size="small" />
              <span>
                Selecciona la tarjeta para ver el detalle completo.
              </span>
            </p>
          </div>
        </>
      ) : (
        <div className="detailSection">
          <div className="detailActions">
            <Button
              type="button"
              variant="outlined"
              className="backButton fz-h4 fw-semibold"
              onClick={() => onSetVerDetalle(false)}
              startIcon={<MaterialSymbol icon="arrow_back" size="small" />}
            >
              Volver
            </Button>
          </div>

          <div className="detailContainer">
            <ComercioDetalle
              comercio={comercio}
              productos={productos}
              loadingProducts={loadingProducts}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PreviewCommerceBasic;
