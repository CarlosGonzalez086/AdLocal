// hooks/useCheckout.ts
import { useState, useCallback, useContext } from "react";
import Swal from "../utils/sweetalert";
import { showConfirmDialog } from "../utils/sweetalert";
import { checkoutApi, type CheckoutResponseDto } from "../services/checkoutApi";
import { UserContext } from "../context/UserContext ";
import { useActualizarJwt } from "./useActualizarJwt";
import { extraerMensajeError } from "../utils/errorHandler";

export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CheckoutResponseDto | null>(null);
  const [isCancel, setIsCancel] = useState<boolean>(false);

  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();

  /**
   * Pagar con tarjeta guardada
   */
  const pagarConTarjetaGuardada = useCallback(
    async (
      planId: number,
      stripePaymentMethodId: string,
      autoRenew: boolean,
    ) => {
      setLoading(true);
      setResponse(null);

      try {
        const { data } = await checkoutApi.suscribirseConTarjetaGuardada(
          planId,
          stripePaymentMethodId,
          autoRenew,
        );

        if (data.codigo !== "200") {
          Swal.fire("Error", data.mensaje, "error");
          return false;
        }

        await actualizarJwt({
          email: user.sub,
          updateJWT: true,
        });

        Swal.fire("Listo", data.mensaje, "success");
        return true;
      } catch (error: unknown) {
        Swal.fire(
          "Error",
          extraerMensajeError(error, "No se pudo completar el pago"),
          "error",
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [actualizarJwt, user.sub],
  );

  /**
   * Pagar con tarjeta nueva (Stripe Checkout)
   */
  const pagarConNuevaTarjeta = useCallback(async (planId: number) => {
    setLoading(true);
    setResponse(null);

    try {
      const { data } = await checkoutApi.crearCheckoutStripe(planId);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return null;
      }

      if (data.respuesta?.url) {
        window.location.href = data.respuesta.url;
      }

      setResponse(data.respuesta ?? null);
      return data.respuesta;
    } catch (error: unknown) {
      Swal.fire(
        "Error",
        extraerMensajeError(error, "No se pudo iniciar el checkout"),
        "error",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cancelar suscripción
   */
  const cancelarPlan = useCallback(async () => {
    const r = await showConfirmDialog({
      icon: "warning",
      title: "¿Cancelar tu plan?",
      text: "Seguirás teniendo acceso hasta que termine tu periodo actual",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
      isDestructive: true,
    });

    if (!r.isConfirmed) return false;

    setLoading(true);

    try {
      const { data } = await checkoutApi.cancelarPlan();

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return false;
      }

      Swal.fire({
        icon: "success",
        title: "Listo",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        confirmButtonText: "",
      });
      setIsCancel(true);
      return true;
    } catch (error: unknown) {
      Swal.fire(
        "Error",
        extraerMensajeError(error, "No se pudo cancelar el plan"),
        "error",
      );
      setIsCancel(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    response,
    isCancel,
    pagarConTarjetaGuardada,
    pagarConNuevaTarjeta,
    cancelarPlan,
  };
};
