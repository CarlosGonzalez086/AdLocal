import React, { useEffect, useState } from "react";
import { Box, Button, LinearProgress, Typography } from "@mui/material";
import type { CrearTarjetaDto, TarjetaDto } from "../../../services/tarjetaApi";
import { useTarjetas } from "../../../hooks/useTarjetas";
import { CardTarjeta } from "../../../components/Tarjeta/CardTarjeta";
import { TarjetaModal } from "../../../components/Tarjeta/TarjetaModal";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

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

  if (loading) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Cargando tarjetas...
        </Typography>
        <LinearProgress />
      </Box>
    );
  }

  if (tarjetas.length === 0) {
    return (
      <Elements stripe={stripePromise}>
        <Box>
          <Typography variant="h6" mb={2}>
            No tienes tarjetas registradas
          </Typography>

          <Button variant="contained" onClick={() => setCreando(true)}>
            Agregar tarjeta
          </Button>
        </Box>

        <TarjetaModal
          open={creando}
          onClose={() => setCreando(false)}
          onSave={handleSave}
          loading={loading}
        />
      </Elements>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5">Mis tarjetas</Typography>

          <Button variant="contained" onClick={() => setCreando(true)}>
            Agregar tarjeta
          </Button>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns="repeat(auto-fill, 320px)"
          justifyContent="end"         
          gap={3}
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
