import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Stack, Skeleton } from "@mui/material";
import type { CrearTarjetaDto, TarjetaDto } from "../../../services/tarjetaApi";
import { useTarjetas } from "../../../hooks/useTarjetas";
import { CardTarjeta } from "../../../components/Tarjeta/CardTarjeta";
import { TarjetaModal } from "../../../components/Tarjeta/TarjetaModal";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CreditCardRoundedIcon from "@mui/icons-material/CreditCardRounded";

const cardSx = {
  borderRadius: 4,
  bgcolor: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
};

export const TarjetasPage: React.FC = () => {
  const { tarjetas, listar, crear, setDefault, eliminar, loading } =
    useTarjetas();
  const [creando, setCreando] = useState(false);
  const [editando, setEditando] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] =
    useState<TarjetaDto | null>(null);

  useEffect(() => {
    listar();
  }, []);

  const handleSave = async (data: CrearTarjetaDto) => {
    await crear(data);
    setCreando(false);
    setEditando(false);
    setTarjetaSeleccionada(null);
  };

  /* ─── LOADING ─── */
  if (loading) {
    return (
      <Box>
        <Skeleton
          variant="rounded"
          height={88}
          sx={{ borderRadius: 4, mb: 2.5 }}
        />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2,1fr)",
              lg: "repeat(3,1fr)",
            },
            gap: 2,
          }}
        >
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rounded"
              height={180}
              sx={{ borderRadius: 4 }}
            />
          ))}
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box>
        {/* HEADER */}
        <Box sx={{ ...cardSx, p: { xs: 2.5, sm: 3 }, mb: 2.5 }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            spacing={2}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 3,
                  bgcolor: "rgba(0,122,255,0.10)",
                  border: "1px solid rgba(0,122,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CreditCardRoundedIcon
                  sx={{ fontSize: 22, color: "#007AFF" }}
                />
              </Box>
              <Box>
                <Typography
                  fontWeight={800}
                  fontSize="1.05rem"
                  color="text.primary"
                  letterSpacing="-0.2px"
                >
                  Mis tarjetas
                </Typography>
                <Typography fontSize="0.75rem" color="text.disabled">
                  Administra tus métodos de pago
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => setCreando(true)}
              sx={{
                ml: { sm: "auto" },
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.875rem",
                px: 3,
                py: 1.2,
                background: "linear-gradient(135deg, #007AFF, #005FCC)",
                boxShadow: "0 6px 18px rgba(0,122,255,0.30)",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 10px 24px rgba(0,122,255,0.42)",
                  transform: "translateY(-1px)",
                },
                "&:active": { transform: "scale(0.98)" },
              }}
            >
              Agregar tarjeta
            </Button>
          </Stack>
        </Box>

        {/* EMPTY STATE */}
        {tarjetas.length === 0 ? (
          <Box
            sx={{
              ...cardSx,
              py: 7,
              px: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1.5,
              border: "1.5px dashed rgba(0,0,0,0.10)",
              boxShadow: "none",
            }}
          >
            <Typography fontSize="2.5rem" lineHeight={1}>
              💳
            </Typography>
            <Typography fontWeight={700} fontSize="1rem" color="text.primary">
              No tienes tarjetas registradas
            </Typography>
            <Typography fontSize="0.82rem" color="text.disabled" maxWidth={280}>
              Agrega una tarjeta para comenzar a realizar pagos fácilmente
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
              onClick={() => setCreando(true)}
              sx={{
                mt: 1,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 700,
                px: 3,
                py: 1.2,
                background: "linear-gradient(135deg, #007AFF, #005FCC)",
                boxShadow: "0 6px 18px rgba(0,122,255,0.28)",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 10px 24px rgba(0,122,255,0.40)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              Agregar tarjeta
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {tarjetas.map((t) => (
              <CardTarjeta
                key={t.id}
                tarjeta={t}
                onSetDefault={setDefault}
                onEliminar={eliminar}
                onEdit={() => {
                  setTarjetaSeleccionada(t);
                  setEditando(true);
                }}
              />
            ))}
          </Box>
        )}
      </Box>

      <TarjetaModal
        open={creando}
        onClose={() => setCreando(false)}
        onSave={handleSave}
        loading={loading}
      />

      <TarjetaModal
        open={editando}
        tarjeta={tarjetaSeleccionada}
        onClose={() => {
          setEditando(false);
          setTarjetaSeleccionada(null);
        }}
        onSave={handleSave}
        loading={loading}
      />
    </>
  );
};
