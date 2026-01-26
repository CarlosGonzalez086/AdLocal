// hooks/useCheckout.ts
import { useState, useCallback, useContext } from "react";
import Swal from "sweetalert2";
import {
  checkoutApi,
  type CheckoutRequestDto,
  type CheckoutResponseDto,
  type CambiarPlanDto,
} from "../services/checkoutApi";
import { UserContext } from "../context/UserContext ";
import { useActualizarJwt } from "./useActualizarJwt";


export const useCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CheckoutResponseDto | null>(null);
  const user = useContext(UserContext);
  const { actualizarJwt } = useActualizarJwt();


  const crearSesion = useCallback(async (dto: CheckoutRequestDto) => {
    setLoading(true);
    setResponse(null);

    try {
      const { data } = await checkoutApi.crearSesion(dto);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return null;
      }

      setResponse(data.respuesta);
      return data.respuesta;
    } catch (error: any) {
      console.error(error);
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje ||
          error?.message ||
          "Ocurrió un error inesperado",
        "error",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const pagarConTarjetaGuardada = useCallback(
    async (planId: number, stripePaymentMethodId: string,autoRenew:boolean) => {

      return crearSesion({
        planId,
        metodo: "guardada",
        stripePaymentMethodId,
        autoRenew,
      });
    },
    [crearSesion],
  );

  const pagarConNuevaTarjeta = useCallback(
    async (planId: number) => {

      return crearSesion({
        planId,
        metodo: "nueva",
      });
    },
    [crearSesion],
  );

  const pagarPorTransferencia = useCallback(async (planId: number,banco:string) => {
    setLoading(true);
    try {
      banco = banco != "oxxo" ? "spei" : "oxxo";
      const { data } = await checkoutApi.generarReferenciaTransferencia(planId,banco);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return null;
      }
      return data.mensaje;
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje || "Error al generar referencia",
        "error",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelarPlan = useCallback(async () => {
    const r = await Swal.fire({
      icon: "warning",
      title: "¿Cancelar tu plan?",
      text: "Seguirás teniendo acceso hasta que termine tu periodo actual",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No",
    });

    if (!r.isConfirmed) return false;

    setLoading(true);
    try {
      const { data } = await checkoutApi.cancelarPlan();

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
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje || "No se pudo cancelar el plan",
        "error",
      );
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const cambiarPlan = useCallback(async (dto: CambiarPlanDto) => {
    setLoading(true);
    setResponse(null);

    try {
      const { data } = await checkoutApi.cambiarPlan(dto);

      if (data.codigo !== "200") {
        Swal.fire("Error", data.mensaje, "error");
        return null;
      }

      if (data.respuesta?.url) {
        window.open(data.respuesta.url, "_blank");
      } else {
        Swal.fire(
          "Plan cambiado",
          "Tu plan fue actualizado correctamente",
          "success",
        );
      }
      setResponse(data.respuesta);
      return data.respuesta;
    } catch (error: any) {
      Swal.fire(
        "Error",
        error?.response?.data?.mensaje || "No se pudo cambiar el plan",
        "error",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    response,

    crearSesion,
    pagarConTarjetaGuardada,
    pagarConNuevaTarjeta,
    pagarPorTransferencia,

    cancelarPlan,
    cambiarPlan,
  };
};
