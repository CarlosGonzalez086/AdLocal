import { Avatar, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import type { UsuarioDto } from "../../../../types/Admin/usuarios";
import { GenericModal } from "../../../../components/GenericModal";

interface Props {
  open: boolean;
  onClose: () => void;
  usuario: UsuarioDto;
  soloVer?: boolean;
}

export const UserModal = ({ open, onClose, usuario, soloVer }: Props) => {
  const initialForm = useMemo(
    () => ({
      id: usuario.id ?? 0,
      uuid: usuario.uuid ?? "",

      nombre: usuario.nombre ?? "",
      email: usuario.email ?? "",
      telefono: usuario.telefono ?? null,
      fotoUrl: usuario.fotoUrl ?? null,

      rol: usuario.rol ?? "",
      activo: usuario.activo ?? true,
      emailVerificado: usuario.emailVerificado ?? false,

      codigo: usuario.codigo ?? null,
      codigoReferido: usuario.codigoReferido ?? null,

      comercioId: usuario.comercioId ?? null,

      stripeCustomerId: usuario.stripeCustomerId ?? null,
      token: usuario.token ?? null,

      redeemMonthFree: usuario.redeemMonthFree ?? false,
      redeemRewards: usuario.redeemRewards ?? false,

      fechaCreacion: usuario.fechaCreacion ?? "",
      fechaActualizacion: usuario.fechaActualizacion ?? null,
      ultimoAcceso: usuario.ultimoAcceso ?? null,

      comercios: usuario.comercios ?? [],
      direcciones: usuario.direcciones ?? [],
      suscripciones: usuario.suscripciones ?? [],
    }),
    [usuario],
  );

  const [form, setForm] = useState<UsuarioDto>(initialForm);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm(initialForm);
    }
  }, [initialForm, open]);

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      icon="person"
      title={soloVer ? "Información del usuario" : "Editar usuario"}
      subtitle="Datos de la cuenta y su suscripción actual."
      maxWidth="sm"
      secondaryLabel="Cerrar"
    >
      <div className="card-adlocal mt-3">
        <div className="row g-3">
          <div className="col-12">
            <div className="d-flex align-items-center gap-3">
              <Avatar src={form.fotoUrl ?? undefined} className="avatar">
                {!form.fotoUrl && form.nombre?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography className="fz-h3 fw-bold">{form.nombre}</Typography>
            </div>
          </div>

          <div className="col-12">
            <TextField
              label="Correo electrónico"
              value={form.email}
              disabled
              fullWidth
            />
          </div>

          {form.telefono && (
            <div className="col-12">
              <TextField
                label="Teléfono"
                value={form.telefono}
                disabled
                fullWidth
              />
            </div>
          )}

          {form.rol && (
            <div className="col-12">
              <TextField label="Rol" value={form.rol} disabled fullWidth />
            </div>
          )}

          {form.fechaCreacion && (
            <div className="col-12">
              <TextField
                label="Fecha de creación"
                value={new Date(form.fechaCreacion).toLocaleDateString("es-MX")}
                disabled
                fullWidth
              />
            </div>
          )}

          <div className="col-12">
            <TextField
              label="Estado"
              value={form.activo ? "Activo" : "Inactivo"}
              disabled
              fullWidth
            />
          </div>

          <div className="col-12">
            <TextField
              label="Correo verificado"
              value={form.emailVerificado ? "Verificado" : "Pendiente"}
              disabled
              fullWidth
            />
          </div>

          {form.ultimoAcceso && (
            <div className="col-12">
              <TextField
                label="Último acceso"
                value={new Date(form.ultimoAcceso).toLocaleString("es-MX")}
                disabled
                fullWidth
              />
            </div>
          )}
        </div>
      </div>
    </GenericModal>
  );
};
