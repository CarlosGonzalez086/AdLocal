import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useState } from "react";

interface Prop {
  codigoReferido: string;
  totalUsoCodigo: number;
}

const CodigoReferido = ({ codigoReferido, totalUsoCodigo }: Prop) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codigoReferido);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const objetivo = 15;
  const progreso = Math.min((totalUsoCodigo / objetivo) * 100, 100);
  const alcanzado = totalUsoCodigo >= objetivo;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
          borderRadius: 4,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.8))",
          backdropFilter: "blur(14px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            fontSize={12}
            fontWeight={600}
            color="text.secondary"
            mb={0.5}
          >
            Tu código de referido
          </Typography>

          <Typography
            fontSize={{ xs: 20, sm: 24 }}
            fontWeight={800}
            letterSpacing={1.5}
            sx={{
              color: "#111",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {codigoReferido}
          </Typography>

          <Typography
            fontSize={12}
            fontWeight={600}
            color="text.secondary"
            mt={0.5}
          >
            Usado {totalUsoCodigo} {totalUsoCodigo === 1 ? "vez" : "veces"}
          </Typography>
        </Box>

        <Tooltip title={copied ? "Copiado" : "Copiar"}>
          <IconButton
            onClick={handleCopy}
            sx={{
              width: 44,
              height: 44,
              borderRadius: "14px",
              backgroundColor: copied
                ? "rgba(52,199,89,0.15)"
                : "rgba(0,0,0,0.06)",
              transition: "all .25s ease",
              flexShrink: 0,
              "&:hover": {
                backgroundColor: copied
                  ? "rgba(52,199,89,0.25)"
                  : "rgba(0,0,0,0.12)",
                transform: "scale(1.05)",
              },
            }}
          >
            {copied ? (
              <CheckRoundedIcon sx={{ color: "#34C759" }} />
            ) : (
              <ContentCopyRoundedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      <Box
        sx={{
          flex: 1,
          px: { xs: 2, sm: 3 },
          py: 2,
          borderRadius: 4,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0.75))",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        {/* Texto */}
        <Typography
          fontSize={13}
          fontWeight={600}
          color="text.secondary"
          mb={1}
          lineHeight={1.4}
        >
          Si llegas a <b>{objetivo}</b> conocidos tuyos, podrás obtener{" "}
          <b>1 mes gratis</b> del plan básico o de tu plan actual contratado
        </Typography>

        {/* Barra progreso estilo iOS */}
        <Box
          sx={{
            width: "100%",
            height: 8,
            borderRadius: 999,
            backgroundColor: "rgba(0,0,0,0.08)",
            overflow: "hidden",
            mb: 1.2,
          }}
        >
          <Box
            sx={{
              width: `${progreso}%`,
              height: "100%",
              borderRadius: 999,
              transition: "width .4s ease",
              background: alcanzado
                ? "linear-gradient(90deg, #34C759, #30D158)"
                : "linear-gradient(90deg, #0A84FF, #5AC8FA)",
            }}
          />
        </Box>

        {/* Contador */}
        <Typography fontSize={12} fontWeight={700} color="text.secondary">
          {totalUsoCodigo} / {objetivo} usos
        </Typography>

        {/* Botón reclamar */}
        {alcanzado && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Box
              component="button"
              onClick={() => console.log("Reclamar mes gratis")}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
                background: "linear-gradient(180deg, #34C759, #28A745)",
                boxShadow: "0 8px 20px rgba(52,199,89,0.35)",
                transition: "all .25s ease",
                "&:hover": {
                  transform: "scale(1.04)",
                },
                "&:active": {
                  transform: "scale(0.96)",
                },
              }}
            >
              🎉 Reclamar mes gratis
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CodigoReferido;
