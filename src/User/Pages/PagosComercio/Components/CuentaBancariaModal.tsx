import { FormControlLabel, Switch, TextField } from "@mui/material";

import { useEffect, useState, type FormEvent } from "react";
import type {
  CuentaBancariaComercioCreateDto,
  CuentaBancariaComercioDto,
  CuentaBancariaComercioUpdateDto,
} from "../../../../types/User/pagosComercio";
import { GenericModal } from "../../../../components/GenericModal";

interface Props {
  open: boolean;

  cuenta: CuentaBancariaComercioDto | null;

  loading?: boolean;

  onClose: () => void;

  onCrear: (dto: CuentaBancariaComercioCreateDto) => Promise<boolean>;

  onActualizar: (
    uuid: string,
    dto: CuentaBancariaComercioUpdateDto,
  ) => Promise<boolean>;
}

interface FormState {
  banco: string;

  beneficiario: string;

  numeroCuenta: string;

  clabe: string;

  numeroTarjeta: string;

  principal: boolean;

  activo: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  banco: "",

  beneficiario: "",

  numeroCuenta: "",

  clabe: "",

  numeroTarjeta: "",

  principal: false,

  activo: true,
};

export const CuentaBancariaModal = ({
  open,
  cuenta,
  loading = false,

  onClose,

  onCrear,
  onActualizar,
}: Props) => {
  const [form, setForm] = useState<FormState>(initialForm);

  const [errors, setErrors] = useState<FormErrors>({});

  const editando = Boolean(cuenta);

  useEffect(() => {
    if (!open) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setErrors({});

    if (!cuenta) {
      setForm(initialForm);

      return;
    }

    setForm({
      banco: cuenta.banco ?? "",

      beneficiario: cuenta.beneficiario ?? "",

      numeroCuenta: cuenta.numeroCuenta ?? "",

      clabe: cuenta.clabe ?? "",

      numeroTarjeta: cuenta.numeroTarjeta ?? "",

      principal: cuenta.principal,

      activo: cuenta.activo,
    });
  }, [open, cuenta]);

  const validar = () => {
    const nuevosErrores: FormErrors = {};

    if (!form.banco.trim()) {
      nuevosErrores.banco = "El banco es obligatorio";
    }

    if (!form.beneficiario.trim()) {
      nuevosErrores.beneficiario = "El beneficiario es obligatorio";
    }

    if (
      !form.numeroCuenta.trim() &&
      !form.clabe.trim() &&
      !form.numeroTarjeta.trim()
    ) {
      nuevosErrores.clabe = "Ingresa una CLABE, número de cuenta o tarjeta";
    }

    if (form.clabe.trim() && form.clabe.trim().length !== 18) {
      nuevosErrores.clabe = "La CLABE debe contener 18 dígitos";
    }

    setErrors(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validar()) {
      return;
    }

    let success = false;

    if (cuenta) {
      success = await onActualizar(cuenta.uuid, {
        banco: form.banco.trim(),

        beneficiario: form.beneficiario.trim(),

        numeroCuenta: form.numeroCuenta.trim() || null,

        clabe: form.clabe.trim() || null,

        numeroTarjeta: form.numeroTarjeta.trim() || null,

        principal: form.principal,

        activo: form.activo,
      });
    } else {
      success = await onCrear({
        banco: form.banco.trim(),

        beneficiario: form.beneficiario.trim(),

        numeroCuenta: form.numeroCuenta.trim() || null,

        clabe: form.clabe.trim() || null,

        numeroTarjeta: form.numeroTarjeta.trim() || null,

        principal: form.principal,
      });
    }

    if (success) {
      onClose();
    }
  };

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={editando ? "Editar cuenta bancaria" : "Nueva cuenta bancaria"}
      subtitle={
        editando
          ? "Modifica los datos de la cuenta para transferencias."
          : "Agrega una cuenta donde tus clientes podrán realizar transferencias."
      }
      icon={editando ? "edit" : "account_balance"}
      maxWidth="sm"
      loading={loading}
      onSubmit={handleSubmit}
      primaryAction={{
        label: editando ? "Guardar cambios" : "Agregar cuenta",

        loadingLabel: "Guardando...",

        icon: "save",

        type: "submit",
      }}
    >
      <div className="mt-4">
        <div className="row g-3">
          <div className="col-12">
            <TextField
              label="Banco"
              placeholder="Ej. BBVA"
              value={form.banco}
              fullWidth
              error={Boolean(errors.banco)}
              helperText={errors.banco}
              slotProps={{
                htmlInput: {
                  maxLength: 100,
                },
              }}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  banco: event.target.value,
                }))
              }
            />
          </div>

          <div className="col-12">
            <TextField
              label="Beneficiario"
              placeholder="Nombre del titular de la cuenta"
              value={form.beneficiario}
              fullWidth
              error={Boolean(errors.beneficiario)}
              helperText={errors.beneficiario}
              slotProps={{
                htmlInput: {
                  maxLength: 150,
                },
              }}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  beneficiario: event.target.value,
                }))
              }
            />
          </div>

          <div className="col-12">
            <TextField
              label="CLABE"
              placeholder="18 dígitos"
              value={form.clabe}
              fullWidth
              error={Boolean(errors.clabe)}
              helperText={errors.clabe}
              slotProps={{
                htmlInput: {
                  maxLength: 18,
                  inputMode: "numeric",
                },
              }}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  clabe: event.target.value.replace(/\D/g, ""),
                }))
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <TextField
              label="Número de cuenta"
              value={form.numeroCuenta}
              fullWidth
              slotProps={{
                htmlInput: {
                  maxLength: 20,
                  inputMode: "numeric",
                },
              }}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  numeroCuenta: event.target.value.replace(/\D/g, ""),
                }))
              }
            />
          </div>

          <div className="col-12 col-md-6">
            <TextField
              label="Número de tarjeta"
              value={form.numeroTarjeta}
              fullWidth
              slotProps={{
                htmlInput: {
                  maxLength: 19,
                  inputMode: "numeric",
                },
              }}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,

                  numeroTarjeta: event.target.value.replace(/\D/g, ""),
                }))
              }
            />
          </div>

          <div className="col-12">
            <div className="cuentaBancariaModalOptions d-flex align-items-center flex-wrap gap-3 p-3">
              <FormControlLabel
                className="m-0"
                control={
                  <Switch
                    checked={form.principal}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        principal: event.target.checked,
                      }))
                    }
                  />
                }
                label="Usar como cuenta principal"
              />

              {editando && (
                <FormControlLabel
                  className="m-0"
                  control={
                    <Switch
                      checked={form.activo}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,

                          activo: event.target.checked,
                        }))
                      }
                    />
                  }
                  label="Cuenta activa"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </GenericModal>
  );
};
