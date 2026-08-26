import { ClavesConfigForm } from "./ClavesConfigForm";
import { EmailConfigForm } from "./EmailConfigForm";
import { MarketplaceCommissionConfigForm } from "./MarketplaceCommissionConfigForm";
import { StripeConfigForm } from "./StripeConfigForm";

export const ConfiguracionSistemaPage = () => {
  return (
    <div className="row g-3">
      <div className="col-12 col-md-6 col-xl-3">
        <MarketplaceCommissionConfigForm />
      </div>

      <div className="col-12 col-md-6 col-xl-3">
        <StripeConfigForm />
      </div>

      <div className="col-12 col-md-6 col-xl-3">
        <ClavesConfigForm />
      </div>

      <div className="col-12 col-md-6 col-xl-3">
        <EmailConfigForm />
      </div>
    </div>
  );
};
