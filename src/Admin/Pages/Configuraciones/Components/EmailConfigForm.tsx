import {
  Button,
  InputAdornment,
  LinearProgress,
  TextField,
  IconButton,
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

  const [showKey, setShowKey] = useState(false);

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
    <div className="card-adlocal h-100 d-flex flex-column">
      <ConfigFormHeader
        icon={<MaterialSymbol icon="mail" size="medium" filled />}
        title="Servidor de Correo (SMTP)"
        subtitle="Configuración para envío de notificaciones y correos del sistema"
        badgeColor="terracotta"
        action={
          <span className="badge-adlocal badge-adlocal--secondary">
            <MaterialSymbol icon="forward_to_inbox" size="small" />
            SMTP Relay
          </span>
        }
      />

      {loading && <LinearProgress />}

      <div className="card-adlocal-body flex-grow-1 d-flex flex-column justify-content-between">
        <div className="d-flex flex-column gap-3">
          {/* INFORMACIÓN */}
          <div className="config-info-box config-info-box--secondary">
            <div
              className="config-icon-badge config-icon-badge--terracotta"
              style={{ width: 36, height: 36 }}
            >
              <MaterialSymbol icon="mark_email_read" size="small" />
            </div>
            <div>
              <h3 className="fz-h4 fw-semibold mb-1" style={{ color: "#1C1C1E" }}>
                Mensajería Transaccional
              </h3>
              <p className="fz-body text-secondary mb-0">
                Utilizado para envío de códigos de verificación, restablecimiento de accesos y notificaciones de pedidos.
              </p>
            </div>
          </div>

          {/* CAMPOS EMPAREJADOS RESPONSIVOS */}
          <div className="row g-3">
            <div className="col-12 col-sm-8">
              <TextField
                label="Servidor SMTP (Host)"
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

            <div className="col-12 col-sm-4">
              <TextField
                label="Puerto SMTP"
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

            <div className="col-12 col-sm-6">
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

            <div className="col-12 col-sm-6">
              <TextField
                label="Clave SMTP / Token"
                type={showKey ? "text" : "password"}
                value={form.key}
                onChange={handleChange("key")}
                fullWidth
                disabled={loading}
                variant="filled"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <MaterialSymbol icon="lock" size="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setShowKey((prev) => !prev)}
                          edge="end"
                          tabIndex={-1}
                        >
                          <MaterialSymbol
                            icon={showKey ? "visibility_off" : "visibility"}
                            size="small"
                          />
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>

            <div className="col-12 col-sm-6">
              <TextField
                label="Correo remitente (From)"
                type="email"
                value={form.from}
                onChange={handleChange("from")}
                fullWidth
                disabled={loading}
                variant="filled"
                placeholder="notificaciones@adlocal.com"
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

            <div className="col-12 col-sm-6">
              <TextField
                label="Nombre remitente"
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
        </div>

        <div className="pt-3 mt-3 border-top">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={isDisabled}
            className="btn-adlocal btn-adlocal--solid w-100"
          >
            <MaterialSymbol icon="save" size="small" />
            <span className="ms-2">Guardar correo</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
