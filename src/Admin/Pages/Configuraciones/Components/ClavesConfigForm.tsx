import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Stack,
  Divider,
  InputAdornment,
  LinearProgress,
  Box,
} from "@mui/material";
import { useConfiguracionSistema } from "../../../../hooks/useConfiguracionSistema";
import { ConfigFormHeader } from "./ConfigFormHeader";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

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
    <div className="card-adlocal">
      <ConfigFormHeader
        icon={<MaterialSymbol icon="key" size="medium" filled />}
        title="Configuración de claves"
        subtitle="Claves del sistema"
      />

      <Divider />

      {loading && <LinearProgress />}

      <Box className="config-form-body">
        <Box className="config-form-content">
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
                    <MaterialSymbol icon="lock" size="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              onClick={onSubmit}
              disabled={isDisabled}
              className="btn-adlocal btn-adlocal--solid config-form-submit fz-h4 fw-semibold"
            >
              Guardar configuración
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};
