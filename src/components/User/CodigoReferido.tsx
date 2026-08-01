import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import Swal from "sweetalert2";

import { beneficiosApi } from "../../services/beneficios.api";
import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

import styles from "../../styles/CodigoReferido.module.css";

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

const OBJETIVO_REFERIDOS = 10;
const COPY_FEEDBACK_DURATION = 1800;

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

const CodigoReferido = ({
  codigoReferido,
  totalUsoCodigo,
  setAplicoBeneficio,
  usoTotalReferidos,
}: Props) => {
  const [copied, setCopied] = useState(false);

  const [claimingReward, setClaimingReward] = useState(false);

  const copyTimeoutRef = useRef<number | null>(null);

  const totalUsos = Math.max(Number(totalUsoCodigo) || 0, 0);

  const progreso = useMemo(() => {
    return Math.min(Math.max((totalUsos / OBJETIVO_REFERIDOS) * 100, 0), 100);
  }, [totalUsos]);

  const alcanzado = totalUsos >= OBJETIVO_REFERIDOS;

  const usosRestantes = Math.max(OBJETIVO_REFERIDOS - totalUsos, 0);

  const beneficioYaAplicado =
    String(usoTotalReferidos).trim().toLowerCase() === "true";

  const puedeReclamar = alcanzado && !beneficioYaAplicado;

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

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

  return (
    <Box
      component="section"
      className={styles.container}
      aria-label="Programa de referidos"
    >
      <Paper elevation={0} className={styles.card}>
        <Box className={styles.cardHeader}>
          <Box className={styles.cardHeaderIcon}>
            <MaterialSymbol icon="share" size="medium" />
          </Box>

          <Typography component="h2" className={styles.cardTitle}>
            Tu código de referido
          </Typography>
        </Box>

        <Box className={styles.codeRow}>
          <Typography
            component="span"
            className={styles.referralCode}
            title={codigoReferido}
          >
            {codigoReferido}
          </Typography>

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
              className={[
                styles.copyButton,
                copied ? styles.copyButtonSuccess : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => void handleCopy()}
            >
              <MaterialSymbol
                icon={copied ? "check" : "content_copy"}
                size="small"
              />
            </IconButton>
          </Tooltip>
        </Box>

        <Box className={styles.usageBadge}>
          <MaterialSymbol icon="group" size="small" />

          <Typography component="span" className={styles.usageText}>
            Usado {totalUsos} {totalUsos === 1 ? "vez" : "veces"}
          </Typography>
        </Box>
      </Paper>

      <Paper elevation={0} className={styles.card}>
        <Box className={styles.cardHeader}>
          <Box
            className={[
              styles.cardHeaderIcon,
              alcanzado ? styles.achievedHeaderIcon : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <MaterialSymbol
              icon={alcanzado ? "workspace_premium" : "monitoring"}
              size="medium"
              filled={alcanzado}
            />
          </Box>

          <Typography component="h2" className={styles.cardTitle}>
            Progreso de referidos
          </Typography>
        </Box>

        <Typography component="p" className={styles.rewardDescription}>
          Llega a{" "}
          <Box component="strong" className={styles.emphasis}>
            {OBJETIVO_REFERIDOS} referidos
          </Box>{" "}
          y obtén{" "}
          <Box
            component="strong"
            className={[
              styles.rewardEmphasis,
              alcanzado ? styles.rewardAchieved : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            1 mes gratis
          </Box>{" "}
          de tu plan actual.
        </Typography>

        <Box className={styles.progressSection}>
          <LinearProgress
            variant="determinate"
            value={progreso}
            className={[
              styles.progress,
              alcanzado ? styles.progressAchieved : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-label={`Progreso de referidos: ${Math.round(progreso)}%`}
          />

          <Box className={styles.progressInformation}>
            <Typography
              component="span"
              className={[
                styles.progressCount,
                alcanzado ? styles.progressCountAchieved : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {totalUsos} / {OBJETIVO_REFERIDOS} usos
            </Typography>

            <Box
              className={[
                styles.progressStatus,
                alcanzado ? styles.progressStatusAchieved : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <MaterialSymbol
                icon={alcanzado ? "check_circle" : "schedule"}
                size="small"
                filled={alcanzado}
              />

              <Typography
                component="span"
                className={styles.progressStatusText}
              >
                {alcanzado
                  ? "Meta alcanzada"
                  : `${usosRestantes} ${
                      usosRestantes === 1 ? "restante" : "restantes"
                    }`}
              </Typography>
            </Box>
          </Box>
        </Box>

        {puedeReclamar && (
          <Button
            type="button"
            variant="contained"
            fullWidth
            disabled={claimingReward}
            className={styles.claimButton}
            onClick={() => void handleSubmitClaimReward()}
            startIcon={
              claimingReward ? (
                <CircularProgress
                  size={18}
                  thickness={5}
                  className={styles.buttonProgress}
                />
              ) : (
                <MaterialSymbol icon="workspace_premium" size="small" filled />
              )
            }
          >
            {claimingReward ? "Aplicando beneficio..." : "Reclamar mes gratis"}
          </Button>
        )}

        {alcanzado && beneficioYaAplicado && (
          <Box className={styles.redeemedMessage}>
            <Box className={styles.redeemedIcon}>
              <MaterialSymbol icon="verified" size="small" filled />
            </Box>

            <Box>
              <Typography component="span" className={styles.redeemedTitle}>
                Beneficio aplicado
              </Typography>

              <Typography component="p" className={styles.redeemedDescription}>
                El mes gratuito ya fue agregado a tu cuenta.
              </Typography>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default CodigoReferido;
