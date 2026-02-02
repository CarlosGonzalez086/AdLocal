import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import type { CrearTarjetaDto, TarjetaDto } from "../../../services/tarjetaApi";
import { useTarjetas } from "../../../hooks/useTarjetas";
import { CardTarjeta } from "../../../components/Tarjeta/CardTarjeta";
import { TarjetaModal } from "../../../components/Tarjeta/TarjetaModal";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import AddIcon from "@mui/icons-material/Add";

const stripePromise = loadStripe("pk_live_51Sgu6YL1vXo9u5cKR6Cv9MttUY8OJa3q4Ut1RKMQ5QsJMHyqZcpW9SLPWuJi8F6UFSKCvYuhm56h1tX5jOmqA2ww00BrOotLg4");

export const TarjetasPage: React.FC = () => {
  const { tarjetas, listar, crear, setDefault, eliminar, loading } =
    useTarjetas();
  console.log(stripePromise);

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

  /* 🔹 Loading */
  if (loading) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Cargando tarjetas…
        </Typography>
        <LinearProgress sx={{ borderRadius: 1 }} />
      </Box>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <Box>
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: 3,
            border: "1px solid rgba(0,0,0,0.08)",
            background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
          }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ sm: "center" }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={600}>
                Mis tarjetas
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administra tus métodos de pago
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreando(true)}
              sx={{
                ml: "auto",
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                background: "linear-gradient(135deg, #007AFF 0%, #005FCC 100%)",
                boxShadow: "0 6px 16px rgba(0,122,255,0.3)",
                "&:hover": {
                  boxShadow: "0 8px 20px rgba(0,122,255,0.4)",
                },
              }}
            >
              Agregar tarjeta
            </Button>
          </Stack>
        </Paper>

        {tarjetas.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              border: "1px dashed rgba(0,0,0,0.15)",
            }}
          >
            <Typography variant="h6" mb={1}>
              No tienes tarjetas registradas
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Agrega una tarjeta para comenzar a realizar pagos
            </Typography>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreando(true)}
              sx={{
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Agregar tarjeta
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
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
    </Elements>
  );
};
