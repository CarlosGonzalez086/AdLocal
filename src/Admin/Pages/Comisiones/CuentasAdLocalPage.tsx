import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { httpAdmin } from "../../../api/httpAdmin";
import type { ApiResponse } from "../../../api/apiResponse";
import type { CuentaAdLocal } from "../../../types/User/pagoComisiones";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";

const inicial = {
  banco: "",
  beneficiario: "",
  numeroCuenta: "",
  clabe: "",
  numeroTarjeta: "",
  instrucciones: "",
  principal: true,
};
export const CuentasAdLocalPage = () => {
  const [cuentas, setCuentas] = useState<CuentaAdLocal[]>([]);
  const [form, setForm] = useState(inicial);
  const [uuid, setUuid] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cargar = async () => {
    const { data } = await httpAdmin.get<ApiResponse<CuentaAdLocal[]>>(
      "/CuentasBancariasAdLocal",
    );
    setCuentas(data.respuesta ?? []);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void cargar();
  }, []);
  const guardar = async () => {
    setError(null);
    try {
      if (uuid) await httpAdmin.put(`/CuentasBancariasAdLocal/${uuid}`, form);
      else await httpAdmin.post("/CuentasBancariasAdLocal", form);
      setForm(inicial);
      setUuid(null);
      await cargar();
    } catch (e: any) {
      setError(
        e?.response?.data?.mensaje || "No fue posible guardar la cuenta.",
      );
    }
  };
  const editar = (c: CuentaAdLocal) => {
    setUuid(c.uuid);
    setForm({
      banco: c.banco,
      beneficiario: c.beneficiario,
      numeroCuenta: c.numeroCuenta ?? "",
      clabe: c.clabe ?? "",
      numeroTarjeta: c.numeroTarjeta ?? "",
      instrucciones: c.instrucciones ?? "",
      principal: c.principal,
    });
  };
  return (
    <div>
      <div className="filters-paper">
        <h1 className="fz-h2 fw-semibold mb-1">Cuentas bancarias de ADLocal</h1>
        <p className="fz-h4 mb-0">
          Configura las cuentas donde los comercios pagarán sus comisiones.
        </p>
      </div>
      {error && (
        <Alert severity="error" className="mt-3">
          {error}
        </Alert>
      )}
      <div className="row g-4 mt-1">
        <div className="col-12 col-lg-5">
          <div className="commission-payment-card p-4">
            <h2 className="fz-h3 fw-semibold">
              {uuid ? "Editar cuenta" : "Nueva cuenta"}
            </h2>
            <div className="row g-3 mt-1">
              <div className="col-12">
                <TextField
                  fullWidth
                  label="Banco"
                  value={form.banco}
                  onChange={(e) => setForm({ ...form, banco: e.target.value })}
                />
              </div>
              <div className="col-12">
                <TextField
                  fullWidth
                  label="Beneficiario"
                  value={form.beneficiario}
                  onChange={(e) =>
                    setForm({ ...form, beneficiario: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <TextField
                  fullWidth
                  label="Número de cuenta"
                  value={form.numeroCuenta}
                  onChange={(e) =>
                    setForm({ ...form, numeroCuenta: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <TextField
                  fullWidth
                  label="CLABE"
                  value={form.clabe}
                  onChange={(e) => setForm({ ...form, clabe: e.target.value })}
                />
              </div>
              <div className="col-12">
                <TextField
                  fullWidth
                  label="Número de tarjeta"
                  value={form.numeroTarjeta}
                  onChange={(e) =>
                    setForm({ ...form, numeroTarjeta: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Instrucciones"
                  value={form.instrucciones}
                  onChange={(e) =>
                    setForm({ ...form, instrucciones: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={form.principal}
                      onChange={(e) =>
                        setForm({ ...form, principal: e.target.checked })
                      }
                    />
                  }
                  label="Cuenta principal"
                />
              </div>
              <div className="col-12">
                <Button
                  fullWidth
                  className="btn-adlocal btn-adlocal--solid"
                  disabled={!form.banco.trim() || !form.beneficiario.trim()}
                  onClick={() => void guardar()}
                >
                  <MaterialSymbol icon="save" size="small" />
                  <span className="ms-2">Guardar cuenta</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-7">
          <div className="d-flex flex-column gap-3">
            {cuentas.map((c) => (
              <div key={c.uuid} className="commission-payment-card p-4">
                <div className="d-flex justify-content-between gap-3">
                  <div>
                    <h2 className="fz-h3 fw-semibold mb-1">{c.banco}</h2>
                    <span className="d-block">{c.beneficiario}</span>
                    {c.clabe && (
                      <span className="d-block">CLABE: {c.clabe}</span>
                    )}
                    {c.numeroCuenta && (
                      <span className="d-block">Cuenta: {c.numeroCuenta}</span>
                    )}
                    <span className="d-block mt-2">
                      {c.principal ? "Principal" : "Secundaria"} ·{" "}                      
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <Button
                      className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm"
                      onClick={() => editar(c)}
                    >
                      Editar
                    </Button>
                    {/* <Button
                      className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm"
                      onClick={async () => {
                        await httpAdmin.put(
                          `/CuentasBancariasAdLocal/${c.uuid}/estado`,
                        );
                        await cargar();
                      }}
                    >
                      {c. ? "Desactivar" : "Activar"}
                    </Button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
