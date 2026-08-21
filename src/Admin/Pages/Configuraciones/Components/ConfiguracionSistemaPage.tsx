import { ClavesConfigForm } from "./ClavesConfigForm";
import { MarketplaceCommissionConfigForm } from "./MarketplaceCommissionConfigForm";
import { StripeConfigForm } from "./StripeConfigForm";

export const ConfiguracionSistemaPage = () => {
  return (
    <div className="row g-3">
      <div className="col-lg-4 col-md-6 col-sm-12">
        <MarketplaceCommissionConfigForm />
      </div>

      <div className="col-lg-4 col-md-6 col-sm-12">
        <StripeConfigForm />
      </div>

      <div className="col-lg-4 col-md-6 col-sm-12">
        <ClavesConfigForm />
      </div>
    </div>
  );
};