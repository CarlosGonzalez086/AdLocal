import type { FC } from "react";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

export const EmptyCommerceState: FC = () => {
  return (
    <div className="emptyCommerce" aria-live="polite">
      <div className="emptyCommerceIcon">
        <MaterialSymbol icon="storefront" size="large" />
      </div>

      <h1 className="emptyCommerceTitle fz-h1 fw-bold mb-2">
        Aún no tienes un comercio
      </h1>

      <p className="emptyCommerceDescription fz-h4 fw-regular mb-0">
        Registra tu primer comercio para comenzar a publicar tus productos,
        servicios y datos de contacto.
      </p>
    </div>
  );
};

export default EmptyCommerceState;
