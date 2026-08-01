import {
  Box,
  Button,
  ButtonBase,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Swal from "sweetalert2";

import { MetodoPagoStep } from "./MetodoPagoStep";

import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

import { useCheckout } from "../../../hooks/useCheckout";
import { useTarjetas } from "../../../hooks/useTarjetas";

import type { PlanCreateDto } from "../../../services/planApi";

import styles from "../../../styles/ConfirmarSuscripcionModalV3.module.css";

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

  const planType = useMemo(() => normalizePlanType(plan.tipo), [plan.tipo]);

  const isLoading = loadingTarjetas || loadingCheckout;

  const selectedCard = useMemo(
    () =>
      tarjetas.find(
        (card) => card.stripePaymentMethodId === tarjetaSeleccionada,
      ) ?? null,
    [tarjetas, tarjetaSeleccionada],
  );

  const canConfirm = useMemo(() => {
    if (isLoading) {
      return false;
    }

    if (metodo === "guardada") {
      return Boolean(tarjetaSeleccionada);
    }

    if (metodo === "nueva") {
      return true;
    }

    /*
     * El hook actual no expone un método para
     * procesar transferencias.
     */
    return false;
  }, [isLoading, metodo, tarjetaSeleccionada]);

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
  }, [isLoading, onClose, resetModal]);

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
        /*
         * Se abre primero una ventana vacía para
         * evitar que el navegador bloquee el
         * checkout después del await.
         */
        const checkoutWindow = window.open("", "_blank", "noopener,noreferrer");

        try {
          const checkoutUrl = (await pagarConNuevaTarjeta(Number(plan.id))) as string | undefined;

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
    <Dialog
      open={open}
      onClose={cerrar}
      fullWidth
      maxWidth="sm"
      aria-labelledby="subscription-confirmation-title"
      slotProps={{
        paper: {
          className: styles.dialogPaper,
        },
        backdrop: {
          className: styles.dialogBackdrop,
        },
      }}
    >
      <Box
        component="header"
        className={[
          styles.header,
          styles[`header${planType}`] ?? styles.headerFREE,
        ].join(" ")}
      >
        <Box className={styles.headerDecoration} aria-hidden="true" />

        <Box className={styles.headerContent}>
          <Box className={styles.headerTitleRow}>
            <Box className={styles.headerIcon}>
              <MaterialSymbol icon="workspace_premium" size="medium" filled />
            </Box>

            <Stack className={styles.headerText}>
              <Typography
                id="subscription-confirmation-title"
                component="h2"
                className={styles.headerTitle}
              >
                Confirmar suscripción
              </Typography>

              <Typography component="p" className={styles.headerSubtitle}>
                {plan.nombre} · {planType}
              </Typography>
            </Stack>
          </Box>

          <IconButton
            type="button"
            onClick={cerrar}
            disabled={isLoading}
            className={styles.closeButton}
            aria-label="Cerrar confirmación de suscripción"
          >
            <MaterialSymbol icon="close" size="small" />
          </IconButton>
        </Box>
      </Box>

      <DialogContent className={styles.content}>
        <Box className={styles.planSummary}>
          <Box className={styles.planInformation}>
            <Typography component="h3" className={styles.planName}>
              {plan.nombre}
            </Typography>

            <Typography component="p" className={styles.planType}>
              Plan {planType}
            </Typography>
          </Box>

          <Box className={styles.priceContainer}>
            <Typography
              component="span"
              className={[
                styles.price,
                styles[`price${planType}`] ?? styles.priceFREE,
              ].join(" ")}
            >
              ${formatCurrency(plan.precio)}
            </Typography>

            <Typography component="span" className={styles.currency}>
              MXN
            </Typography>
          </Box>
        </Box>

        <Divider className={styles.divider} />

        {metodo === "" && <MetodoPagoStep onSelect={handleSelectMethod} />}

        {metodo !== "" && (
          <Box className={styles.methodHeader}>
            <Button
              type="button"
              className={styles.changeMethodButton}
              onClick={handleReturnToMethods}
              disabled={isLoading}
              startIcon={<MaterialSymbol icon="arrow_back" size="small" />}
            >
              Cambiar método
            </Button>

            <Typography component="span" className={styles.selectedMethodLabel}>
              {metodo === "guardada"
                ? "Tarjeta guardada"
                : metodo === "nueva"
                  ? "Nueva tarjeta"
                  : "Transferencia"}
            </Typography>
          </Box>
        )}

        {metodo === "guardada" && (
          <Stack className={styles.savedCardsSection}>
            {loadingTarjetas ? (
              <Box className={styles.cardsLoading} aria-live="polite">
                <CircularProgress
                  size={30}
                  thickness={4}
                  className={styles.loadingProgress}
                />

                <Typography component="p" className={styles.loadingMessage}>
                  Consultando tus tarjetas...
                </Typography>
              </Box>
            ) : tarjetas.length === 0 ? (
              <Box className={styles.emptyCards}>
                <Box className={styles.emptyCardsIcon}>
                  <MaterialSymbol icon="credit_card_off" size="large" />
                </Box>

                <Typography component="h3" className={styles.emptyCardsTitle}>
                  No tienes tarjetas registradas
                </Typography>

                <Typography
                  component="p"
                  className={styles.emptyCardsDescription}
                >
                  Registra una nueva tarjeta para completar la suscripción.
                </Typography>
              </Box>
            ) : (
              <Stack className={styles.cardsList}>
                {tarjetas.map((card) => {
                  const selected =
                    tarjetaSeleccionada === card.stripePaymentMethodId;

                  const isDefault = tarjetaPreSeleccionada === card.id;

                  return (
                    <ButtonBase
                      key={card.id}
                      type="button"
                      className={[
                        styles.cardOption,
                        selected ? styles.cardOptionSelected : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => {
                        setTarjetaSeleccionada(card.stripePaymentMethodId);

                        setTarjetaPreSeleccionada(card.id);
                      }}
                      disabled={isLoading}
                      role="radio"
                      aria-checked={selected}
                      aria-label={`Tarjeta ${card.brand} terminación ${card.last4}`}
                    >
                      <Box className={styles.cardDetails}>
                        <Box className={styles.cardBrandIcon}>
                          <MaterialSymbol icon="credit_card" size="medium" />
                        </Box>

                        <Box className={styles.cardText}>
                          <Typography
                            component="p"
                            className={styles.cardNumber}
                          >
                            •••• •••• •••• {card.last4}
                          </Typography>

                          <Box className={styles.cardMetadata}>
                            <Typography
                              component="span"
                              className={styles.cardDescription}
                            >
                              {card.brand} · Exp. {card.expMonth}/{card.expYear}
                            </Typography>

                            {isDefault && (
                              <Box className={styles.defaultBadge}>
                                <MaterialSymbol
                                  icon="verified"
                                  size="small"
                                  filled
                                />

                                <span>Principal</span>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Radio
                        checked={selected}
                        className={styles.cardRadio}
                        tabIndex={-1}
                        disableRipple
                      />
                    </ButtonBase>
                  );
                })}
              </Stack>
            )}

            {tarjetas.length > 0 && (
              <Box className={styles.autoRenewContainer}>
                <FormControlLabel
                  className={styles.autoRenewControl}
                  control={
                    <Checkbox
                      checked={autoRenew}
                      disabled={isLoading}
                      className={styles.autoRenewCheckbox}
                      onChange={(event) => setAutoRenew(event.target.checked)}
                    />
                  }
                  label={
                    <Box className={styles.autoRenewLabel}>
                      <Box
                        className={[
                          styles.autoRenewIcon,
                          autoRenew ? styles.autoRenewIconActive : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <MaterialSymbol icon="autorenew" size="small" />
                      </Box>

                      <Box>
                        <Typography
                          component="span"
                          className={styles.autoRenewTitle}
                        >
                          Renovación automática
                        </Typography>

                        <Typography
                          component="p"
                          className={styles.autoRenewDescription}
                        >
                          Cobraremos el siguiente periodo automáticamente.
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </Box>
            )}

            {selectedCard && (
              <Typography component="p" className={styles.selectedCardMessage}>
                Se utilizará la tarjeta terminación {selectedCard.last4}.
              </Typography>
            )}
          </Stack>
        )}

        {metodo === "nueva" && (
          <Box className={styles.newCardInformation}>
            <Box className={styles.informationIcon}>
              <MaterialSymbol icon="add_card" size="medium" />
            </Box>

            <Box>
              <Typography component="h3" className={styles.informationTitle}>
                Pago seguro con tarjeta
              </Typography>

              <Typography
                component="p"
                className={styles.informationDescription}
              >
                Serás redirigido a la pasarela de pago segura para registrar tu
                tarjeta y completar la suscripción.
              </Typography>
            </Box>
          </Box>
        )}

        {metodo === "transferencia" && (
          <Box className={styles.transferSection}>
            <Box className={styles.transferHeader}>
              <Box className={styles.transferIcon}>
                <MaterialSymbol icon="account_balance" size="medium" />
              </Box>

              <Box>
                <Typography component="h3" className={styles.transferTitle}>
                  Banco para transferencia
                </Typography>

                <Typography
                  component="p"
                  className={styles.transferDescription}
                >
                  Selecciona la institución desde la que realizarás el pago.
                </Typography>
              </Box>
            </Box>

            <TextField
              select
              fullWidth
              size="small"
              label="Banco"
              value={banco}
              className={styles.bankField}
              onChange={(event) => setBanco(event.target.value)}
            >
              {BANKS.map((bank) => (
                <MenuItem key={bank} value={bank.toLowerCase()}>
                  {bank}
                </MenuItem>
              ))}
            </TextField>

            <Box className={styles.transferNotice}>
              <MaterialSymbol icon="info" size="small" />

              <Typography component="p" className={styles.transferNoticeText}>
                La confirmación automática por transferencia todavía requiere el
                servicio correspondiente en `useCheckout`.
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <Box component="footer" className={styles.footer}>
        <Button
          type="button"
          onClick={cerrar}
          disabled={isLoading}
          className={styles.cancelButton}
        >
          Cancelar
        </Button>

        {canConfirm && (
          <Button
            type="button"
            variant="contained"
            onClick={confirmarPago}
            disabled={isLoading}
            className={[
              styles.confirmButton,
              styles[`confirmButton${planType}`] ?? styles.confirmButtonFREE,
            ].join(" ")}
            startIcon={
              isLoading ? undefined : (
                <MaterialSymbol
                  icon={metodo === "nueva" ? "open_in_new" : "lock"}
                  size="small"
                />
              )
            }
          >
            {isLoading ? (
              <>
                <CircularProgress
                  size={18}
                  thickness={4}
                  className={styles.confirmProgress}
                />

                <span>Procesando...</span>
              </>
            ) : metodo === "nueva" ? (
              "Continuar al pago"
            ) : (
              "Confirmar pago"
            )}
          </Button>
        )}
      </Box>
    </Dialog>
  );
};
