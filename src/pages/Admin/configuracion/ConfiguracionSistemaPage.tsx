import { ClavesConfigForm } from "./Claves/ClavesConfigForm";
import { StripeConfigForm } from "./stripe/StripeConfigForm";

export const ConfiguracionSistemaPage = () => {
  return (
    <div className="row">
      <div className="col-lg-4 col-md-6 col-sm-12">
        <StripeConfigForm />
      </div>
      <div className="col-lg-4 col-md-6 col-sm-12">
        <ClavesConfigForm />
      </div>
    </div>
  );
};
