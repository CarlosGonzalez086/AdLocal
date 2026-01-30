import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import { useState } from "react";

interface Prop {
  codigoReferido: string;
}

const CodigoReferido = ({ codigoReferido }: Prop) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codigoReferido);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 420,
        mb: 3,
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
      {/* Texto */}
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
      </Box>

      {/* Botón copiar */}
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
  );
};

export default CodigoReferido;
