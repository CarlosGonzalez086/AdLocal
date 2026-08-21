import {
  Button,
  Checkbox,
  CircularProgress,
  MenuItem,
  Radio,
  TextField,
} from "@mui/material";

import {
  useCallback,
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import Swal from "sweetalert2";

import { GenericModal } from "../../../components/GenericModal";
import { MetodoPagoStep } from "./MetodoPagoStep";

import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import { useCheckout } from "../../../hooks/useCheckout";
import { useTarjetas } from "../../../hooks/useTarjetas";

import type { PlanCreateDto } from "../../../services/planPublicApi";

type MetodoPago = "guardada" | "nueva" | "transferencia" | "";

interface Props {
  open: boolean;
  onClose: () => void;
  plan: PlanCreateDto;
  setIsSubSuccess: Dispatch<SetStateAction<boolean>>;
}

const BANKS = [
  "BBVA",
  "Citibanamex",
  "Santander",
  "Banorte",
  "HSBC",
  "Banco Azteca",
  "OXXO",
] as const;

const normalizePlanType = (planType?: string): string => {
  return planType?.trim().toUpperCase() || "FREE";
};

const formatCurrency = (amount: number): string => {
  const normalizedAmount = Number(amount);

  return Number.isFinite(normalizedAmount)
    ? normalizedAmount.toLocaleString("es-MX", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : "0.00";
};

const getMethodLabel = (method: MetodoPago): string => {
  switch (method) {
    case "guardada":
      return "Tarjeta guardada";

    case "nueva":
      return "Nueva tarjeta";

    case "transferencia":
      return "Transferencia";

    default:
      return "";
  }
};

export const ConfirmarSuscripcionModalV3 = ({
  open,
  onClose,
  plan,
  setIsSubSuccess,
}: Props) => {
  const [metodo, setMetodo] = useState<MetodoPago>("");

  const [autoRenew, setAutoRenew] = useState(false);

  const [banco, setBanco] = useState("");

  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<string | null>(
    null,
  );

  const [tarjetaPreSeleccionada, setTarjetaPreSeleccionada] = useState<
    number | null
  >(null);

  const { tarjetas, listar, loading: loadingTarjetas } = useTarjetas();

  const {
    loading: loadingCheckout,

    pagarConTarjetaGuardada,
    pagarConNuevaTarjeta,
  } = useCheckout();

  const planType = normalizePlanType(plan.tipo);

  const isLoading = loadingTarjetas || loadingCheckout;

  const selectedCard =
    tarjetas.find(
      (card) => card.stripePaymentMethodId === tarjetaSeleccionada,
    ) ?? null;

  const canConfirm =
    !isLoading &&
    (metodo === "nueva" ||
      (metodo === "guardada" && Boolean(tarjetaSeleccionada)));

  const resetModal = useCallback(() => {
    setMetodo("");
    setAutoRenew(false);
    setBanco("");
    setTarjetaSeleccionada(null);
    setTarjetaPreSeleccionada(null);
  }, []);

  const cerrar = useCallback(() => {
    if (isLoading) {
      return;
    }

    resetModal();
    onClose();
  }, [isLoading, resetModal, onClose]);

  const handleSelectMethod = (selectedMethod: MetodoPago) => {
    setMetodo(selectedMethod);

    if (selectedMethod !== "guardada") {
      setTarjetaSeleccionada(null);

      setTarjetaPreSeleccionada(null);

      setAutoRenew(false);
    }

    if (selectedMethod !== "transferencia") {
      setBanco("");
    }
  };

  const handleReturnToMethods = () => {
    if (isLoading) {
      return;
    }

    setMetodo("");
    setTarjetaSeleccionada(null);
    setTarjetaPreSeleccionada(null);
    setBanco("");
    setAutoRenew(false);
  };

  useEffect(() => {
    if (!open || metodo !== "guardada") {
      return;
    }

    void listar();
  }, [open, metodo, listar]);

  useEffect(() => {
    if (metodo !== "guardada" || tarjetas.length === 0 || tarjetaSeleccionada) {
      return;
    }

    const defaultCard = tarjetas.find((card) => card.isDefault) ?? tarjetas[0];

    setTarjetaPreSeleccionada(defaultCard.id);

    setTarjetaSeleccionada(defaultCard.stripePaymentMethodId);
  }, [metodo, tarjetas, tarjetaSeleccionada]);

  useEffect(() => {
    if (open) {
      return;
    }

    resetModal();
  }, [open, resetModal]);

  const confirmarPago = async () => {
    if (!canConfirm || isLoading) {
      return;
    }

    try {
      if (metodo === "guardada") {
        if (!tarjetaSeleccionada) {
          await Swal.fire({
            icon: "warning",

            title: "Selecciona una tarjeta",

            text: "Debes seleccionar una tarjeta antes de confirmar el pago.",

            confirmButtonText: "Entendido",

            confirmButtonColor: "#007AFF",
          });

          return;
        }

        const result = await pagarConTarjetaGuardada(
          Number(plan.id),

          tarjetaSeleccionada,

          autoRenew,
        );

        if (!result) {
          throw new Error("El pago no devolvió una respuesta válida.");
        }

        await Swal.fire({
          icon: "success",

          title: "Pago realizado",

          text: "Tu suscripción se está activando.",

          showConfirmButton: false,

          timer: 1800,

          timerProgressBar: true,
        });

        setIsSubSuccess(true);

        resetModal();
        onClose();

        return;
      }

      if (metodo === "nueva") {
        const checkoutWindow = window.open("", "_blank", "noopener,noreferrer");

        try {
          const checkoutUrl = (await pagarConNuevaTarjeta(Number(plan.id))) as
            | string
            | undefined;

          if (typeof checkoutUrl !== "string" || !checkoutUrl.trim()) {
            checkoutWindow?.close();

            throw new Error("No se recibió una URL válida de checkout.");
          }

          if (checkoutWindow) {
            checkoutWindow.location.href = checkoutUrl;
          } else {
            window.location.assign(checkoutUrl);
          }

          resetModal();
          onClose();
        } catch (error) {
          checkoutWindow?.close();

          throw error;
        }
      }
    } catch (error) {
      console.error("Error al procesar el pago:", error);

      await Swal.fire({
        icon: "error",

        title: "No se pudo procesar el pago",

        text: "Revisa la información e inténtalo nuevamente.",

        confirmButtonText: "Entendido",

        confirmButtonColor: "#FF3B30",
      });
    }
  };

  return (
    <GenericModal
      open={open}
      onClose={cerrar}
      maxWidth="sm"
      title="Confirmar suscripción"
      subtitle={`${plan.nombre} · ${planType}`}
      icon="workspace_premium"
      loading={isLoading}
      secondaryLabel="Cancelar"
      primaryAction={
        canConfirm
          ? {
              label:
                metodo === "nueva" ? "Continuar al pago" : "Confirmar pago",

              loadingLabel: "Procesando...",

              icon: metodo === "nueva" ? "open_in_new" : "lock",

              type: "button",

              onClick: confirmarPago,
            }
          : undefined
      }
    >
      {/* ====================================
          PLAN SUMMARY
      ==================================== */}

      <div className="subscriptionPlanSummary mt-4">
        <div>
          <h3 className="subscriptionPlanName fz-h3 fw-bold mb-1">
            {plan.nombre}
          </h3>

          <p className="subscriptionPlanType fz-h5 fw-regular mb-0">
            Plan {planType}
          </p>
        </div>

        <div className="subscriptionPriceContainer">
          <span
            className={`subscriptionPrice subscriptionPrice${planType} fz-h1 fw-bold`}
          >
            ${formatCurrency(plan.precio)}
          </span>

          <span className="subscriptionCurrency fz-h5 fw-medium">MXN</span>
        </div>
      </div>

      <hr className="subscriptionDivider" />

      {/* ====================================
          MÉTODO
      ==================================== */}

      {metodo === "" && <MetodoPagoStep onSelect={handleSelectMethod} />}

      {metodo !== "" && (
        <div className="subscriptionMethodHeader">
          <Button
            type="button"
            className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm fz-h5 fw-semibold"
            disabled={isLoading}
            onClick={handleReturnToMethods}
            startIcon={<MaterialSymbol icon="arrow_back" size="small" />}
          >
            Cambiar método
          </Button>

          <span className="subscriptionSelectedMethodLabel fz-h5 fw-semibold">
            {getMethodLabel(metodo)}
          </span>
        </div>
      )}

      {/* ====================================
          TARJETA GUARDADA
      ==================================== */}

      {metodo === "guardada" && (
        <div className="subscriptionSavedCardsSection">
          {loadingTarjetas ? (
            <div className="subscriptionCardsLoading" aria-live="polite">
              <CircularProgress
                size={30}
                thickness={4}
                className="subscriptionLoadingProgress"
              />

              <p className="subscriptionLoadingMessage fz-h4 fw-medium mb-0">
                Consultando tus tarjetas...
              </p>
            </div>
          ) : tarjetas.length === 0 ? (
            <div className="subscriptionEmptyCards">
              <div className="subscriptionEmptyCardsIcon">
                <MaterialSymbol icon="credit_card_off" size="large" />
              </div>

              <h3 className="subscriptionEmptyCardsTitle fz-h3 fw-semibold mb-1">
                No tienes tarjetas registradas
              </h3>

              <p className="subscriptionEmptyCardsDescription fz-h4 fw-regular mb-0">
                Registra una nueva tarjeta para completar la suscripción.
              </p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-2">
              {tarjetas.map((card) => {
                const selected =
                  tarjetaSeleccionada === card.stripePaymentMethodId;

                const isDefault = tarjetaPreSeleccionada === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    className={`subscriptionCardOption ${
                      selected ? "subscriptionCardOptionSelected" : ""
                    }`}
                    disabled={isLoading}
                    onClick={() => {
                      setTarjetaSeleccionada(card.stripePaymentMethodId);

                      setTarjetaPreSeleccionada(card.id);
                    }}
                    role="radio"
                    aria-checked={selected}
                  >
                    <div className="d-flex align-items-center gap-3 flex-grow-1">
                      <div className="subscriptionCardBrandIcon flex-shrink-0">
                        <MaterialSymbol icon="credit_card" size="medium" />
                      </div>

                      <div className="subscriptionCardText">
                        <p className="subscriptionCardNumber fz-h4 fw-semibold mb-1">
                          •••• •••• •••• {card.last4}
                        </p>

                        <div className="d-flex align-items-center flex-wrap gap-2">
                          <span className="subscriptionCardDescription fz-h5 fw-regular">
                            {card.brand} · Exp. {card.expMonth}/{card.expYear}
                          </span>

                          {isDefault && (
                            <span className="subscriptionDefaultBadge fz-h6 fw-semibold">
                              <MaterialSymbol
                                icon="verified"
                                size="small"
                                filled
                              />
                              Principal
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Radio
                      checked={selected}
                      className="subscriptionCardRadio"
                      tabIndex={-1}
                      disableRipple
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* ====================================
              AUTO RENEW
          ==================================== */}

          {tarjetas.length > 0 && (
            <div className="subscriptionAutoRenewContainer">
              <label className="subscriptionAutoRenewControl">
                <Checkbox
                  checked={autoRenew}
                  disabled={isLoading}
                  className="subscriptionAutoRenewCheckbox"
                  onChange={(event) => setAutoRenew(event.target.checked)}
                />

                <div className="d-flex align-items-center gap-3">
                  <div
                    className={`subscriptionAutoRenewIcon ${
                      autoRenew ? "subscriptionAutoRenewIconActive" : ""
                    }`}
                  >
                    <MaterialSymbol icon="autorenew" size="small" />
                  </div>

                  <div>
                    <span className="subscriptionAutoRenewTitle fz-h4 fw-semibold d-block">
                      Renovación automática
                    </span>

                    <p className="subscriptionAutoRenewDescription fz-h5 fw-regular mb-0">
                      Cobraremos el siguiente periodo automáticamente.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          )}

          {selectedCard && (
            <p className="subscriptionSelectedCardMessage fz-h5 fw-medium mb-0">
              Se utilizará la tarjeta terminación {selectedCard.last4}.
            </p>
          )}
        </div>
      )}

      {/* ====================================
          NUEVA TARJETA
      ==================================== */}

      {metodo === "nueva" && (
        <div className="subscriptionInformationCard">
          <div className="subscriptionInformationIcon flex-shrink-0">
            <MaterialSymbol icon="add_card" size="medium" />
          </div>

          <div>
            <h3 className="subscriptionInformationTitle fz-h3 fw-semibold mb-1">
              Pago seguro con tarjeta
            </h3>

            <p className="subscriptionInformationDescription fz-h4 fw-regular mb-0">
              Serás redirigido a la pasarela de pago segura para registrar tu
              tarjeta y completar la suscripción.
            </p>
          </div>
        </div>
      )}

      {/* ====================================
          TRANSFERENCIA
      ==================================== */}

      {metodo === "transferencia" && (
        <div className="subscriptionTransferSection">
          <div className="d-flex align-items-start gap-3 mb-3">
            <div className="subscriptionTransferIcon flex-shrink-0">
              <MaterialSymbol icon="account_balance" size="medium" />
            </div>

            <div>
              <h3 className="subscriptionTransferTitle fz-h3 fw-semibold mb-1">
                Banco para transferencia
              </h3>

              <p className="subscriptionTransferDescription fz-h4 fw-regular mb-0">
                Selecciona la institución desde la que realizarás el pago.
              </p>
            </div>
          </div>

          <TextField
            select
            fullWidth
            size="small"
            label="Banco"
            value={banco}
            className="adlocalTextField"
            onChange={(event) => setBanco(event.target.value)}
          >
            {BANKS.map((bank) => (
              <MenuItem
                key={bank}
                value={bank.toLowerCase()}
                className="fz-h4 fw-regular"
              >
                {bank}
              </MenuItem>
            ))}
          </TextField>

          <div className="subscriptionTransferNotice">
            <MaterialSymbol icon="info" size="small" />

            <p className="subscriptionTransferNoticeText fz-h5 fw-regular mb-0">
              La confirmación automática por transferencia todavía requiere el
              servicio correspondiente en `useCheckout`.
            </p>
          </div>
        </div>
      )}
    </GenericModal>
  );
};
