import {
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Tooltip,
} from "@mui/material";

import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

import Swal from "sweetalert2";

import { beneficiosApi } from "../../services/beneficios.api";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

interface Props {
  codigoReferido: string;
  totalUsoCodigo: number;
  setAplicoBeneficio: Dispatch<SetStateAction<boolean>>;
  usoTotalReferidos: string;
}

interface ApiError {
  response?: {
    data?: {
      mensaje?: string;
    };
  };

  message?: string;
}

/* ============================================
   CONSTANTES
============================================ */

const OBJETIVO_REFERIDOS = 10;

const COPY_FEEDBACK_DURATION = 1800;

/* ============================================
   HELPERS
============================================ */

const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiError;

  return (
    apiError.response?.data?.mensaje ??
    apiError.message ??
    "Ocurrió un error inesperado al aplicar el beneficio."
  );
};

const copyText = async (text: string): Promise<void> => {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);

    return;
  }

  const textArea = document.createElement("textarea");

  textArea.value = text;

  textArea.setAttribute("readonly", "");

  textArea.style.position = "fixed";

  textArea.style.opacity = "0";

  textArea.style.pointerEvents = "none";

  document.body.appendChild(textArea);

  textArea.select();

  textArea.setSelectionRange(0, textArea.value.length);

  const copied = document.execCommand("copy");

  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error("No fue posible copiar el código.");
  }
};

/* ============================================
   COMPONENT
============================================ */

const CodigoReferido = ({
  codigoReferido,
  totalUsoCodigo,
  setAplicoBeneficio,
  usoTotalReferidos,
}: Props) => {
  const [copied, setCopied] = useState(false);

  const [claimingReward, setClaimingReward] = useState(false);

  const copyTimeoutRef = useRef<number | null>(null);

  /* ============================================
     PROGRESO
  ============================================ */

  const totalUsos = Math.max(Number(totalUsoCodigo) || 0, 0);

  const progreso = Math.min(
    Math.max((totalUsos / OBJETIVO_REFERIDOS) * 100, 0),
    100,
  );

  const alcanzado = totalUsos >= OBJETIVO_REFERIDOS;

  const usosRestantes = Math.max(OBJETIVO_REFERIDOS - totalUsos, 0);

  const beneficioYaAplicado =
    String(usoTotalReferidos).trim().toLowerCase() === "true";

  const puedeReclamar = alcanzado && !beneficioYaAplicado;

  /* ============================================
     CLEANUP
  ============================================ */

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  /* ============================================
     COPY
  ============================================ */

  const handleCopy = async () => {
    if (!codigoReferido.trim()) {
      return;
    }

    try {
      await copyText(codigoReferido);

      setCopied(true);

      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = window.setTimeout(() => {
        setCopied(false);

        copyTimeoutRef.current = null;
      }, COPY_FEEDBACK_DURATION);
    } catch (error) {
      console.error("Error al copiar el código:", error);

      await Swal.fire({
        icon: "error",

        title: "No se pudo copiar",

        text: "Copia el código manualmente e inténtalo nuevamente.",

        confirmButtonText: "Entendido",

        confirmButtonColor: "#007AFF",
      });
    }
  };

  /* ============================================
     RECLAMAR BENEFICIO
  ============================================ */

  const handleSubmitClaimReward = async () => {
    if (claimingReward || !puedeReclamar) {
      return;
    }

    try {
      setClaimingReward(true);

      setAplicoBeneficio(false);

      Swal.fire({
        title: "Aplicando beneficio",

        text: "Estamos procesando tu mes gratuito.",

        allowOutsideClick: false,

        allowEscapeKey: false,

        showConfirmButton: false,

        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await beneficiosApi.reclamarBeneficio();

      if (response.data.codigo !== "200") {
        throw new Error(
          response.data.mensaje || "No fue posible aplicar el beneficio.",
        );
      }

      await Swal.fire({
        icon: "success",

        title: "Beneficio aplicado",

        text:
          response.data.mensaje ||
          "El mes gratuito fue agregado correctamente.",

        confirmButtonText: "Continuar",

        confirmButtonColor: "#34C759",
      });

      setAplicoBeneficio(true);
    } catch (error: unknown) {
      console.error("Error al reclamar el beneficio:", error);

      await Swal.fire({
        icon: "error",

        title: "No se pudo aplicar el beneficio",

        text: getErrorMessage(error),

        confirmButtonText: "Entendido",

        confirmButtonColor: "#FF3B30",
      });

      setAplicoBeneficio(false);
    } finally {
      setClaimingReward(false);
    }
  };

  /* ============================================
     RENDER
  ============================================ */

  return (
    <div
      className="referralProgramContainer"
      aria-label="Programa de referidos"
    >
      <div className="row g-4">
        {/* ====================================
            CÓDIGO REFERIDO
        ==================================== */}

        <div className="col-12 col-lg-5">
          <div className="referralCard h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div className="referralCardHeaderIcon flex-shrink-0">
                <MaterialSymbol icon="share" size="medium" />
              </div>

              <h2 className="referralCardTitle fz-h2 fw-bold mb-0">
                Tu código de referido
              </h2>
            </div>

            {/* CODE */}

            <div className="referralCodeRow d-flex align-items-center gap-2">
              <span
                className="referralCode fz-h3 fw-bold flex-grow-1"
                title={codigoReferido}
              >
                {codigoReferido}
              </span>

              <Tooltip
                title={copied ? "Código copiado" : "Copiar código"}
                placement="top"
                arrow
              >
                <IconButton
                  type="button"
                  aria-label={
                    copied ? "Código copiado" : "Copiar código de referido"
                  }
                  className={`referralCopyButton ${
                    copied ? "referralCopyButtonSuccess" : ""
                  }`}
                  onClick={() => void handleCopy()}
                >
                  <MaterialSymbol
                    icon={copied ? "check" : "content_copy"}
                    size="small"
                  />
                </IconButton>
              </Tooltip>
            </div>

            {/* USOS */}

            <div className="referralUsageBadge d-inline-flex align-items-center gap-2 mt-3">
              <MaterialSymbol icon="group" size="small" />

              <span className="referralUsageText fz-h5 fw-semibold">
                Usado {totalUsos} {totalUsos === 1 ? "vez" : "veces"}
              </span>
            </div>
          </div>
        </div>

        {/* ====================================
            PROGRESO
        ==================================== */}

        <div className="col-12 col-lg-7">
          <div className="referralCard h-100">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div
                className={`referralCardHeaderIcon flex-shrink-0 ${
                  alcanzado ? "referralAchievedHeaderIcon" : ""
                }`}
              >
                <MaterialSymbol
                  icon={alcanzado ? "workspace_premium" : "monitoring"}
                  size="medium"
                  filled={alcanzado}
                />
              </div>

              <h2 className="referralCardTitle fz-h2 fw-bold mb-0">
                Progreso de referidos
              </h2>
            </div>

            {/* DESCRIPTION */}

            <p className="referralRewardDescription fz-h4 fw-regular mb-4">
              Llega a{" "}
              <strong className="referralEmphasis fw-bold">
                {OBJETIVO_REFERIDOS} referidos
              </strong>{" "}
              y obtén{" "}
              <strong
                className={`referralRewardEmphasis fw-bold ${
                  alcanzado ? "referralRewardAchieved" : ""
                }`}
              >
                1 mes gratis
              </strong>{" "}
              de tu plan actual.
            </p>

            {/* PROGRESS */}

            <div className="referralProgressSection">
              <LinearProgress
                variant="determinate"
                value={progreso}
                className={`referralProgress ${
                  alcanzado ? "referralProgressAchieved" : ""
                }`}
                aria-label={`Progreso de referidos: ${Math.round(progreso)}%`}
              />

              <div className="d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-2 mt-2">
                <span
                  className={`referralProgressCount fz-h5 fw-semibold ${
                    alcanzado ? "referralProgressCountAchieved" : ""
                  }`}
                >
                  {totalUsos} / {OBJETIVO_REFERIDOS} usos
                </span>

                <div
                  className={`referralProgressStatus d-flex align-items-center gap-1 ${
                    alcanzado ? "referralProgressStatusAchieved" : ""
                  }`}
                >
                  <MaterialSymbol
                    icon={alcanzado ? "check_circle" : "schedule"}
                    size="small"
                    filled={alcanzado}
                  />

                  <span className="referralProgressStatusText fz-h5 fw-medium">
                    {alcanzado
                      ? "Meta alcanzada"
                      : `${usosRestantes} ${
                          usosRestantes === 1 ? "restante" : "restantes"
                        }`}
                  </span>
                </div>
              </div>
            </div>

            {/* CLAIM */}

            {puedeReclamar && (
              <Button
                type="button"
                variant="contained"
                fullWidth
                disabled={claimingReward}
                className="referralClaimButton fz-h4 fw-semibold mt-4"
                onClick={() => void handleSubmitClaimReward()}
                startIcon={
                  claimingReward ? (
                    <CircularProgress
                      size={18}
                      thickness={5}
                      className="referralButtonProgress"
                    />
                  ) : (
                    <MaterialSymbol
                      icon="workspace_premium"
                      size="small"
                      filled
                    />
                  )
                }
              >
                {claimingReward
                  ? "Aplicando beneficio..."
                  : "Reclamar mes gratis"}
              </Button>
            )}

            {/* REDEEMED */}

            {alcanzado && beneficioYaAplicado && (
              <div className="referralRedeemedMessage d-flex align-items-start gap-3 mt-4">
                <div className="referralRedeemedIcon flex-shrink-0">
                  <MaterialSymbol icon="verified" size="small" filled />
                </div>

                <div>
                  <span className="referralRedeemedTitle fz-h4 fw-semibold d-block mb-1">
                    Beneficio aplicado
                  </span>

                  <p className="referralRedeemedDescription fz-h5 fw-regular mb-0">
                    El mes gratuito ya fue agregado a tu cuenta.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodigoReferido;
