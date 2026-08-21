import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

type MetodoPago = "guardada" | "nueva" | "transferencia" | "";

interface Props {
  onSelect: (metodo: MetodoPago) => void;
}

interface PaymentMethodOption {
  label: string;
  description: string;
  value: MetodoPago;
  icon: string;
}

const opciones: PaymentMethodOption[] = [
  {
    label: "Tarjeta guardada",
    description: "Utiliza una tarjeta que ya tienes registrada.",
    value: "guardada",
    icon: "credit_card",
  },
  {
    label: "Nueva tarjeta",
    description: "Agrega una nueva tarjeta para completar el pago.",
    value: "nueva",
    icon: "add_card",
  },

  /*
  {
    label: "Transferencia bancaria",
    description:
      "Realiza el pago mediante una transferencia bancaria.",
    value: "transferencia",
    icon: "account_balance",
  },
  */
];

export const MetodoPagoStep = ({ onSelect }: Props) => {
  return (
    <section
      className="paymentMethodStep"
      aria-labelledby="payment-method-title"
    >
      <div className="mb-4">
        <h3
          id="payment-method-title"
          className="paymentMethodTitle fz-h3 fw-semibold mb-1"
        >
          Método de pago
        </h3>

        <p className="paymentMethodDescription fz-h4 fw-regular mb-0">
          Selecciona cómo deseas pagar tu suscripción.
        </p>
      </div>

      <div className="d-flex flex-column gap-3">
        {opciones.map((opcion) => (
          <button
            key={opcion.value}
            type="button"
            className="paymentMethodOption"
            onClick={() => onSelect(opcion.value)}
          >
            <div className="paymentMethodOptionIcon flex-shrink-0">
              <MaterialSymbol icon={opcion.icon} size="medium" />
            </div>

            <div className="paymentMethodOptionContent">
              <span className="paymentMethodOptionTitle fz-h4 fw-semibold">
                {opcion.label}
              </span>

              <p className="paymentMethodOptionDescription fz-h5 fw-regular mb-0">
                {opcion.description}
              </p>
            </div>

            <MaterialSymbol
              icon="arrow_forward_ios"
              size="small"
              className="paymentMethodOptionArrow flex-shrink-0"
            />
          </button>
        ))}
      </div>
    </section>
  );
};
