import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  LinearProgress,
  Box,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from '@mui/icons-material/Key';

import { useConfiguracionSistema } from "../../../../hooks/useConfiguracionSistema";

interface ClavesConfigFormState {
  ip2locationKey: string;
}

export const ClavesConfigForm = () => {
  const { cargar, guardarClaves, configuraciones, loading } =
    useConfiguracionSistema();

  const [form, setForm] = useState<ClavesConfigFormState>({
    ip2locationKey: "",
  });

  useEffect(() => {
    cargar();
  }, []);

  useEffect(() => {
    if (!Array.isArray(configuraciones)) return;

    const getValue = (key: string) =>
      configuraciones.find((x) => x.key === key)?.val ?? "";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      ip2locationKey: getValue("IP2LOCATION_KEY"),
    });
  }, [configuraciones]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    guardarClaves(form);
  };

  const isDisabled = loading || !form.ip2locationKey;

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: "1px solid rgba(0,0,0,0.08)",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <KeyIcon color="primary" />
          <Box>
            <Typography fontWeight={600} fontSize={18}>
              Configuración de claves
            </Typography>
            <Typography fontSize={13} color="text.secondary">
              Claves del sistema
            </Typography>
          </Box>
        </Stack>
      </Box>

      <Divider />

      {loading && <LinearProgress />}

      <CardContent>
        <Box sx={{ maxWidth: 520, mx: "auto" }}>
          <Stack spacing={2.5}>
            <TextField
              label="Ip2location Key"
              name="ip2locationKey"
              value={form.ip2locationKey}
              onChange={onChange}
              fullWidth
              disabled={loading}
              variant="filled"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              size="large"
              onClick={onSubmit}
              disabled={isDisabled}
              sx={{
                mt: 1,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                py: 1.3,
              }}
            >
              Guardar configuración
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};
