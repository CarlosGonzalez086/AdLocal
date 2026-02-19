import { Box, Typography, IconButton, Tooltip, Button } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { useState } from "react";
import { beneficiosApi } from "../../services/beneficios.api";
import Swal from "sweetalert2";

interface Prop {
  codigoReferido: string;
  totalUsoCodigo: number;
  setAplicoBeneficio: React.Dispatch<React.SetStateAction<boolean>>;
  usoTotalReferidos: string;
}

const CodigoReferido = ({
  codigoReferido,
  totalUsoCodigo,
  setAplicoBeneficio,
  usoTotalReferidos,
}: Prop) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codigoReferido);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSubmitClaimReward = async () => {
    try {
      Swal.fire({
        title: "Aplicando beneficio...",
        text: "Un momento por favor",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => Swal.showLoading(),
      });

      const response = await beneficiosApi.reclamarBeneficio();

      if (response.data.codigo === "200") {
        await Swal.fire({
          icon: "success",
          title: "¡Beneficio aplicado! 🎉",
          text: response.data.mensaje,
          confirmButtonText: "Perfecto",
          confirmButtonColor: "#34C759",
        });
        setAplicoBeneficio(true);
      }
    } catch (error: any) {
      Swal.fire({
        icon: "error",
        title: "No se pudo aplicar el beneficio",
        text: error.message || "Ocurrió un error inesperado",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#FF3B30",
      });
      setAplicoBeneficio(false);
    }
  };

  const objetivo = 10;
  const progreso = Math.min((totalUsoCodigo / objetivo) * 100, 100);
  const alcanzado = totalUsoCodigo >= objetivo;

  const cardSx = {
    borderRadius: 4,
    bgcolor: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(0,0,0,0.06)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      {/* Card código */}
      <Box sx={{ ...cardSx, flex: 1, px: { xs: 2.5, sm: 3 }, py: 2.5 }}>
        <Typography fontSize="0.72rem" fontWeight={700} color="text.disabled" letterSpacing="0.06em" textTransform="uppercase" mb={1}>
          Tu código de referido
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="space-between" gap={2}>
          <Typography
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.8rem" },
              fontWeight: 800,
              letterSpacing: 3,
              color: "#1c1c1e",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              fontFamily: "monospace",
            }}
          >
            {codigoReferido}
          </Typography>

          <Tooltip title={copied ? "¡Copiado!" : "Copiar código"}>
            <IconButton
              onClick={handleCopy}
              sx={{
                width: 42,
                height: 42,
                borderRadius: 999,
                flexShrink: 0,
                bgcolor: copied ? "rgba(52,199,89,0.12)" : "rgba(0,0,0,0.05)",
                border: "1px solid",
                borderColor: copied ? "rgba(52,199,89,0.25)" : "rgba(0,0,0,0.08)",
                transition: "all 0.22s ease",
                "&:hover": {
                  bgcolor: copied ? "rgba(52,199,89,0.20)" : "rgba(0,0,0,0.09)",
                  transform: "scale(1.06)",
                },
              }}
            >
              {copied
                ? <CheckRoundedIcon sx={{ fontSize: 18, color: "#34C759" }} />
                : <ContentCopyRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              }
            </IconButton>
          </Tooltip>
        </Box>

        <Box
          sx={{
            mt: 1.5,
            px: 1.5,
            py: 0.6,
            borderRadius: 999,
            bgcolor: "rgba(0,0,0,0.05)",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
          }}
        >
          <Typography fontSize="0.75rem" fontWeight={600} color="text.secondary">
            Usado {totalUsoCodigo} {totalUsoCodigo === 1 ? "vez" : "veces"}
          </Typography>
        </Box>
      </Box>

      {/* Card progreso */}
      <Box
        sx={{
          ...cardSx,
          flex: 1,
          px: { xs: 2.5, sm: 3 },
          py: 2.5,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        <Typography fontSize="0.72rem" fontWeight={700} color="text.disabled" letterSpacing="0.06em" textTransform="uppercase">
          Progreso de referidos
        </Typography>

        <Typography fontSize="0.82rem" color="text.secondary" lineHeight={1.6}>
          Llega a <strong style={{ color: "#1c1c1e" }}>{objetivo} referidos</strong> y obtén{" "}
          <strong style={{ color: alcanzado ? "#34C759" : "#007AFF" }}>1 mes gratis</strong>{" "}
          de tu plan actual
        </Typography>

        {/* Barra */}
        <Box>
          <Box
            sx={{
              width: "100%",
              height: 8,
              borderRadius: 999,
              bgcolor: "rgba(0,0,0,0.07)",
              overflow: "hidden",
              mb: 0.8,
            }}
          >
            <Box
              sx={{
                width: `${progreso}%`,
                height: "100%",
                borderRadius: 999,
                transition: "width 0.5s cubic-bezier(.4,0,.2,1)",
                background: alcanzado
                  ? "linear-gradient(90deg, #34C759, #30D158)"
                  : "linear-gradient(90deg, #007AFF, #5AC8FA)",
                boxShadow: alcanzado
                  ? "0 2px 8px rgba(52,199,89,0.4)"
                  : "0 2px 8px rgba(0,122,255,0.3)",
              }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography fontSize="0.75rem" fontWeight={700} color={alcanzado ? "success.main" : "text.secondary"}>
              {totalUsoCodigo} / {objetivo} usos
            </Typography>
            <Typography fontSize="0.72rem" color="text.disabled" fontWeight={500}>
              {alcanzado ? "✅ Meta alcanzada" : `${objetivo - totalUsoCodigo} restantes`}
            </Typography>
          </Box>
        </Box>

        {/* Botón reclamar */}
        {alcanzado && usoTotalReferidos === "false" && (
          <Button
            onClick={handleSubmitClaimReward}
            startIcon={<EmojiEventsRoundedIcon sx={{ fontSize: 18 }} />}
            fullWidth
            sx={{
              mt: 0.5,
              py: 1.3,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.875rem",
              background: "linear-gradient(135deg, #34C759, #28A745)",
              color: "#fff",
              boxShadow: "0 6px 18px rgba(52,199,89,0.35)",
              transition: "all 0.25s ease",
              "&:hover": {
                boxShadow: "0 10px 24px rgba(52,199,89,0.48)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            Reclamar mes gratis
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CodigoReferido;