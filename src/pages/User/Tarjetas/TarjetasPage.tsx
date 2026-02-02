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

import AddIcon from "@mui/icons-material/Add";

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
    <>
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
      {creando && (
        <>
          {" "}
          <TarjetaModal
            open={creando}
            onClose={() => setCreando(false)}
            onSave={handleSave}
            loading={loading}
          />
        </>
      )}
      {editando && (
        <>
          {" "}
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
      )}
    </>
  );
};
