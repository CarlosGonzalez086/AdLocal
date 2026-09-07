import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import type { FC } from "react";
import MaterialSymbol from "../../UI/MaterialSymbol/MaterialSymbol";
import ProductoCard from "../../ProductosServicios/ProductoCard";
import type { ProductoServicioDto } from "../../../types/User/productosServicios";

interface CommerceDetailCatalogProps {
  productos: ProductoServicioDto[];
  loadingProducts: boolean;
}

export const CommerceDetailCatalog: FC<CommerceDetailCatalogProps> = ({
  productos,
  loadingProducts,
}) => {
  return (
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
  );
};

export default CommerceDetailCatalog;
