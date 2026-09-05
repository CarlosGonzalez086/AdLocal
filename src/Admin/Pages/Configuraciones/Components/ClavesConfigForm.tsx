import { useEffect, useState } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  LinearProgress,
  IconButton,
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

  const [showKey, setShowKey] = useState(false);

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

  const isDisabled = loading || !form.ip2locationKey.trim();

  return (
    <div className="card-adlocal h-100 d-flex flex-column">
      <ConfigFormHeader
        icon={<MaterialSymbol icon="key" size="medium" filled />}
        title="Claves del Sistema y APIs"
        subtitle="Credenciales de servicios de geolocalización y mapas"
        badgeColor="amber"
        action={
          <span
            className="badge-adlocal"
            style={{
              backgroundColor: "rgba(245, 158, 11, 0.12)",
              color: "#b45309",
              border: "1px solid rgba(245, 158, 11, 0.25)",
            }}
          >
            <MaterialSymbol icon="travel_explore" size="small" />
            Geolocalización
          </span>
        }
      />

      {loading && <LinearProgress />}

      <div className="card-adlocal-body flex-grow-1 d-flex flex-column justify-content-between">
        <div className="d-flex flex-column gap-3">
          {/* INFORMACIÓN */}
          <div className="config-info-box config-info-box--amber">
            <div
              className="config-icon-badge config-icon-badge--amber"
              style={{ width: 36, height: 36 }}
            >
              <MaterialSymbol icon="location_searching" size="small" />
            </div>
            <div>
              <h3 className="fz-h4 fw-semibold mb-1" style={{ color: "#1C1C1E" }}>
                Detección de Ubicación por IP
              </h3>
              <p className="fz-body text-secondary mb-0">
                IP2Location detecta automáticamente la ciudad y región del visitante para sugerir comercios y servicios cercanos en tiempo real.
              </p>
            </div>
          </div>

          {/* CAMPO DE API KEY */}
          <div>
            <TextField
              label="Token de API IP2Location"
              name="ip2locationKey"
              type={showKey ? "text" : "password"}
              value={form.ip2locationKey}
              onChange={onChange}
              fullWidth
              disabled={loading}
              variant="filled"
              placeholder="Ej: ABC123XYZ..."
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <MaterialSymbol icon="pin_drop" size="small" />
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

          {/* ASISTENCIA EXTERNA */}
          <div
            className="d-flex flex-wrap align-items-center justify-content-between gap-2 p-3 rounded-3"
            style={{
              backgroundColor: "#faf8f5",
              border: "1px solid var(--border)",
            }}
          >
            <div className="d-flex align-items-center gap-2">
              <MaterialSymbol icon="info" size="small" />
              <span
                className="fz-body text-secondary"
                style={{ fontSize: "13px" }}
              >
                ¿Necesitas un token nuevo? Consulta el portal de IP2Location.
              </span>
            </div>
            <a
              href="https://www.ip2location.io"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm d-inline-flex align-items-center gap-1 text-decoration-none"
            >
              <span>Ir al sitio</span>
              <MaterialSymbol icon="open_in_new" size="small" />
            </a>
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
            <span className="ms-2">Guardar configuración</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
