import {
  Button,
  Divider,
  InputAdornment,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useConfiguracionSistema } from "../../../../hooks/useConfiguracionSistema";
import { ConfigFormHeader } from "./ConfigFormHeader";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";

interface EmailConfigFormState {
  host: string;
  port: string;
  user: string;
  key: string;
  from: string;
  fromNombre: string;
}

export const EmailConfigForm = () => {
  const { cargar, guardarEmail, configuraciones, loading } =
    useConfiguracionSistema();

  const [form, setForm] = useState<EmailConfigFormState>({
    host: "smtp-relay.brevo.com",
    port: "587",
    user: "",
    key: "",
    from: "jcarlosgonzalez086@gmail.com",
    fromNombre: "",
  });

  useEffect(() => {
    void cargar();
  }, [cargar]);

  useEffect(() => {
    if (!Array.isArray(configuraciones)) {
      return;
    }

    const getValue = (key: string) =>
      configuraciones.find((x) => x.key === key)?.val ?? "";

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      host: getValue("EMAIL_HOST") || "smtp-relay.brevo.com",

      port: getValue("EMAIL_PORT") || "587",

      user: getValue("EMAIL_USER") || "",

      key: getValue("EMAIL_KEY") || "",

      from: getValue("EMAIL_FROM") || "jcarlosgonzalez086@gmail.com",

      fromNombre: getValue("EMAIL_FROM_NOMBRE") || "",
    });
  }, [configuraciones]);

  const handleChange =
    (field: keyof EmailConfigFormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const port = Number(form.port);

  const isDisabled =
    loading ||
    !form.host.trim() ||
    !form.port ||
    Number.isNaN(port) ||
    port <= 0 ||
    port > 65535 ||
    !form.from.trim();

  const onSubmit = async () => {
    if (isDisabled) {
      return;
    }

    await guardarEmail({
      host: form.host.trim(),
      port,
      user: form.user.trim(),
      key: form.key,
      from: form.from.trim(),
      fromNombre: form.fromNombre.trim(),
    });
  };

  return (
    <div className="card-adlocal">
      <ConfigFormHeader
        icon={<MaterialSymbol icon="mail" size="medium" filled />}
        title="Correo electrónico"
        subtitle="Configura el servidor SMTP utilizado por ADLocal"
      />

      <Divider />

      {loading && <LinearProgress />}

      <div className="p-3 p-lg-4">
        <div className="d-flex flex-column gap-3">
          <div className="row g-3">
            <div className="col-12 col-md-8 col-lg-12">
              <TextField
                label="Servidor SMTP"
                value={form.host}
                onChange={handleChange("host")}
                fullWidth
                disabled={loading}
                variant="filled"
                placeholder="smtp-relay.brevo.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="dns" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12 col-md-4 col-lg-12">
              <TextField
                label="Puerto"
                type="number"
                value={form.port}
                onChange={handleChange("port")}
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
                  htmlInput: {
                    min: 1,
                    max: 65535,
                  },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="lan" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12">
              <TextField
                label="Usuario SMTP"
                value={form.user}
                onChange={handleChange("user")}
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="person" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12">
              <TextField
                label="Clave SMTP"
                type="password"
                value={form.key}
                onChange={handleChange("key")}
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="key" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12">
              <TextField
                label="Correo remitente"
                type="email"
                value={form.from}
                onChange={handleChange("from")}
                fullWidth
                disabled={loading}
                variant="filled"
                placeholder="jcarlosgonzalez086@gmail.com"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="alternate_email" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12">
              <TextField
                label="Nombre del remitente"
                value={form.fromNombre}
                onChange={handleChange("fromNombre")}
                fullWidth
                disabled={loading}
                variant="filled"
                placeholder="ADLocal"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="badge" size="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          </div>

          <Divider />

          <div className="d-flex align-items-start gap-2">
            <MaterialSymbol icon="info" size="small" />

            <span className="fz-h5 fw-regular">
              Esta configuración será utilizada para correos de verificación,
              recuperación de contraseña y notificaciones del sistema.
            </span>
          </div>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={isDisabled}
            className="btn-adlocal btn-adlocal--solid config-form-submit fz-h4 fw-semibold w-100"
          >
            <MaterialSymbol icon="save" size="small" />

            <span className="ms-2">Guardar correo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
