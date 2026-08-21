import {
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";

import {
  ModalidadProductoServicio,
  TipoProductoServicio,
  type ProductoServicioDto,
} from "../../types/User/productosServicios";

import { GenericModal } from "../GenericModal";

import MaterialSymbol from "../UI/MaterialSymbol/MaterialSymbol";

interface Props {
  open: boolean;

  onClose: () => void;

  onSave: (data: ProductoServicioDto) => Promise<void>;

  producto: ProductoServicioDto;

  soloVer?: boolean;

  loading?: boolean;
}

const MAX_DESCRIPTION_LENGTH = 500;

const crearProductoVacio = (): ProductoServicioDto => ({
  id: undefined,

  uuid: undefined,

  nombre: "",

  descripcion: "",

  tipo: TipoProductoServicio.Producto,

  modalidad: ModalidadProductoServicio.Compra,

  precio: null,

  precioDesde: null,

  manejaStock: false,

  stock: null,

  disponible: true,

  permiteDomicilio: true,

  permiteRecoger: true,

  duracionMinutos: null,

  imagenBase64: "",

  activo: true,

  visible: true,

  codigoInterno: null,

  idComercio: 0,
});

export const ProductoServicioModal = ({
  open,
  onClose,
  onSave,
  producto,
  soloVer = false,
  loading = false,
}: Props) => {
  const [form, setForm] = useState<ProductoServicioDto>(crearProductoVacio());

  const [preview, setPreview] = useState<string | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductoServicioDto, string>>
  >({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      id: producto.id,

      uuid: producto.uuid,

      nombre: producto.nombre ?? "",

      descripcion: producto.descripcion ?? "",

      tipo: producto.tipo ?? TipoProductoServicio.Producto,

      modalidad: producto.modalidad ?? ModalidadProductoServicio.Compra,

      precio: producto.precio ?? null,

      precioDesde: producto.precioDesde ?? null,

      manejaStock: producto.manejaStock ?? false,

      stock: producto.stock ?? null,

      disponible: producto.disponible ?? true,

      permiteDomicilio: producto.permiteDomicilio ?? true,

      permiteRecoger: producto.permiteRecoger ?? true,

      duracionMinutos: producto.duracionMinutos ?? null,

      activo: producto.activo ?? true,

      visible: producto.visible ?? true,

      codigoInterno: producto.codigoInterno ?? null,

      imagenBase64: producto.imagenBase64 ?? "",

      idComercio: producto.idComercio ?? 0,
    });

    setPreview(producto.imagenBase64 ?? null);

    setErrors({});
  }, [producto, open]);

  const esProducto = form.tipo === TipoProductoServicio.Producto;

  const esServicio = form.tipo === TipoProductoServicio.Servicio;

  const esCompra = form.modalidad === ModalidadProductoServicio.Compra;

  const esReservacion =
    form.modalidad === ModalidadProductoServicio.Reservacion;

  const esCotizacion = form.modalidad === ModalidadProductoServicio.Cotizacion;

  const validar = (): boolean => {
    const nuevosErrores: typeof errors = {};

    if (!form.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio";
    }

    if (esCompra || esReservacion) {
      if (form.precio === null || form.precio === undefined) {
        nuevosErrores.precio = "El precio es obligatorio";
      } else if (Number(form.precio) < 0) {
        nuevosErrores.precio = "El precio debe ser mayor o igual a 0";
      }
    }

    if (
      esCotizacion &&
      form.precioDesde !== null &&
      Number(form.precioDesde) < 0
    ) {
      nuevosErrores.precioDesde = "El precio debe ser mayor o igual a 0";
    }

    if (esProducto && form.manejaStock) {
      if (form.stock === null || form.stock === undefined) {
        nuevosErrores.stock = "Debes indicar el stock";
      } else if (Number(form.stock) < 0) {
        nuevosErrores.stock = "El stock no puede ser negativo";
      }
    }

    if (esReservacion) {
      if (!form.duracionMinutos || form.duracionMinutos <= 0) {
        nuevosErrores.duracionMinutos =
          "Debes indicar la duración del servicio";
      }
    }

    setErrors(nuevosErrores);

    return Object.keys(nuevosErrores).length === 0;
  };

  const handleTipoChange = (tipo: TipoProductoServicio) => {
    if (tipo === TipoProductoServicio.Producto) {
      setForm((current) => ({
        ...current,

        tipo,

        modalidad: ModalidadProductoServicio.Compra,

        precioDesde: null,

        duracionMinutos: null,
      }));

      return;
    }

    setForm((current) => ({
      ...current,

      tipo,

      manejaStock: false,

      stock: null,

      permiteDomicilio: false,

      permiteRecoger: false,
    }));
  };

  const handleModalidadChange = (modalidad: ModalidadProductoServicio) => {
    setForm((current) => {
      if (modalidad === ModalidadProductoServicio.Compra) {
        return {
          ...current,

          modalidad,

          precioDesde: null,

          duracionMinutos: null,
        };
      }

      if (modalidad === ModalidadProductoServicio.Reservacion) {
        return {
          ...current,

          tipo: TipoProductoServicio.Servicio,

          modalidad,

          precioDesde: null,

          manejaStock: false,

          stock: null,

          permiteDomicilio: false,

          permiteRecoger: false,
        };
      }

      return {
        ...current,

        tipo: TipoProductoServicio.Servicio,

        modalidad,

        precio: null,

        manejaStock: false,

        stock: null,

        duracionMinutos: null,

        permiteDomicilio: false,

        permiteRecoger: false,
      };
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (soloVer) {
      return;
    }

    if (!validar()) {
      return;
    }

    await onSave({
      ...form,

      nombre: form.nombre.trim(),

      descripcion: form.descripcion.trim(),

      codigoInterno: form.codigoInterno?.trim() || null,
    });

    onClose();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;

      setPreview(base64);

      setForm((current) => ({
        ...current,
        imagenBase64: base64,
      }));
    };

    reader.readAsDataURL(file);
  };

  const title = soloVer
    ? "Detalle"
    : form.id
      ? "Editar producto o servicio"
      : "Nuevo producto o servicio";

  const subtitle = soloVer
    ? "Información registrada."
    : form.id
      ? "Modifica la información del producto o servicio."
      : "Completa la información para agregarlo a tu comercio.";

  return (
    <GenericModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={soloVer ? "visibility" : form.id ? "edit" : "inventory_2"}
      maxWidth="md"
      loading={loading}
      onSubmit={soloVer ? undefined : handleSubmit}
      secondaryLabel={soloVer ? "Cerrar" : "Cancelar"}
      primaryAction={
        soloVer
          ? undefined
          : {
              label: form.id ? "Guardar cambios" : "Guardar",

              loadingLabel: "Guardando...",

              icon: "save",

              type: "submit",
            }
      }
    >
      <div className="productoServicioModalContent mt-4">
        {/* =========================
            IMAGEN
        ========================== */}

        <div className="productoServicioModalImageSection">
          <div className="productoServicioModalImagePreview">
            {preview ? (
              <img
                src={preview}
                alt={form.nombre ? `Imagen de ${form.nombre}` : "Vista previa"}
                className="productoServicioModalImage"
              />
            ) : (
              <div className="productoServicioModalImagePlaceholder">
                <MaterialSymbol
                  icon={esServicio ? "design_services" : "inventory_2"}
                  size="large"
                />
              </div>
            )}
          </div>

          {!soloVer && (
            <label className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm fz-h5 fw-medium productoServicioModalUpload">
              <div className="d-flex align-items-center justify-content-center gap-2">
                <MaterialSymbol icon="add_photo_alternate" size="small" />

                <span>{form.id ? "Cambiar imagen" : "Subir imagen"}</span>
              </div>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                hidden
                onChange={handleImageChange}
              />
            </label>
          )}
        </div>

        <div className="productoServicioModalDivider" />

        <div className="productoServicioModalFields">
          {/* =========================
              TIPO
          ========================== */}

          <div className="productoServicioModalRow">
            <TextField
              select
              label="Tipo"
              value={form.tipo}
              disabled={soloVer}
              fullWidth
              onChange={(event) =>
                handleTipoChange(
                  Number(event.target.value) as TipoProductoServicio,
                )
              }
            >
              <MenuItem value={TipoProductoServicio.Producto}>
                Producto
              </MenuItem>

              <MenuItem value={TipoProductoServicio.Servicio}>
                Servicio
              </MenuItem>
            </TextField>

            <TextField
              select
              label="Modalidad"
              value={form.modalidad}
              disabled={soloVer}
              fullWidth
              onChange={(event) =>
                handleModalidadChange(
                  Number(event.target.value) as ModalidadProductoServicio,
                )
              }
            >
              <MenuItem value={ModalidadProductoServicio.Compra}>
                Compra directa
              </MenuItem>

              <MenuItem value={ModalidadProductoServicio.Reservacion}>
                Reservación / cita
              </MenuItem>

              <MenuItem value={ModalidadProductoServicio.Cotizacion}>
                Cotización
              </MenuItem>
            </TextField>
          </div>

          {/* =========================
              INFORMACIÓN
          ========================== */}

          <TextField
            label={esServicio ? "Nombre del servicio" : "Nombre del producto"}
            value={form.nombre}
            error={Boolean(errors.nombre)}
            helperText={errors.nombre}
            disabled={soloVer}
            fullWidth
            slotProps={{
              htmlInput: {
                maxLength: 150,
              },
            }}
            onChange={(event) =>
              setForm((current) => ({
                ...current,

                nombre: event.target.value,
              }))
            }
          />

          <TextField
            label="Descripción"
            value={form.descripcion}
            multiline
            minRows={3}
            disabled={soloVer}
            fullWidth
            slotProps={{
              htmlInput: {
                maxLength: MAX_DESCRIPTION_LENGTH,
              },
            }}
            helperText={
              <span
                className={`productoServicioModalCharacterCounter fz-h6 fw-medium ${
                  form.descripcion.length > 450
                    ? "productoServicioModalCharacterCounterWarning"
                    : ""
                }`}
              >
                {form.descripcion.length} / {MAX_DESCRIPTION_LENGTH}
              </span>
            }
            onChange={(event) => {
              if (event.target.value.length > MAX_DESCRIPTION_LENGTH) {
                return;
              }

              setForm((current) => ({
                ...current,

                descripcion: event.target.value,
              }));
            }}
          />

          {/* =========================
              COMPRA
          ========================== */}

          {esCompra && (
            <>
              <TextField
                label="Precio"
                type="number"
                value={form.precio ?? ""}
                error={Boolean(errors.precio)}
                helperText={errors.precio}
                disabled={soloVer}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01",
                  },

                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="fz-h4 fw-semibold productoServicioModalCurrency">
                          $
                        </span>
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={(event) => {
                  const value = event.target.value;

                  setForm((current) => ({
                    ...current,

                    precio: value === "" ? null : Number(value),
                  }));
                }}
              />

              {esProducto && (
                <>
                  <div className="productoServicioModalOptions">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.manejaStock}
                          disabled={soloVer}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,

                              manejaStock: event.target.checked,

                              stock: event.target.checked
                                ? (current.stock ?? 0)
                                : null,
                            }))
                          }
                        />
                      }
                      label="Manejar inventario"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.disponible}
                          disabled={soloVer}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,

                              disponible: event.target.checked,
                            }))
                          }
                        />
                      }
                      label="Disponible"
                    />
                  </div>

                  {form.manejaStock && (
                    <TextField
                      label="Stock disponible"
                      type="number"
                      value={form.stock ?? ""}
                      error={Boolean(errors.stock)}
                      helperText={errors.stock}
                      disabled={soloVer}
                      fullWidth
                      slotProps={{
                        htmlInput: {
                          min: 0,
                          step: 1,
                        },
                      }}
                      onChange={(event) => {
                        const value = event.target.value;

                        setForm((current) => ({
                          ...current,

                          stock: value === "" ? null : Number(value),
                        }));
                      }}
                    />
                  )}

                  <div className="productoServicioModalDeliveryOptions">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.permiteRecoger}
                          disabled={soloVer}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,

                              permiteRecoger: event.target.checked,
                            }))
                          }
                        />
                      }
                      label="Permitir recoger en tienda"
                    />

                    <FormControlLabel
                      control={
                        <Switch
                          checked={form.permiteDomicilio}
                          disabled={soloVer}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,

                              permiteDomicilio: event.target.checked,
                            }))
                          }
                        />
                      }
                      label="Permitir entrega a domicilio"
                    />
                  </div>
                </>
              )}
            </>
          )}

          {/* =========================
              RESERVACIÓN
          ========================== */}

          {esReservacion && (
            <div className="productoServicioModalRow">
              <TextField
                label="Precio"
                type="number"
                value={form.precio ?? ""}
                error={Boolean(errors.precio)}
                helperText={errors.precio}
                disabled={soloVer}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01",
                  },

                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <span className="fz-h4 fw-semibold productoServicioModalCurrency">
                          $
                        </span>
                      </InputAdornment>
                    ),
                  },
                }}
                onChange={(event) => {
                  const value = event.target.value;

                  setForm((current) => ({
                    ...current,

                    precio: value === "" ? null : Number(value),
                  }));
                }}
              />

              <TextField
                label="Duración"
                type="number"
                value={form.duracionMinutos ?? ""}
                error={Boolean(errors.duracionMinutos)}
                helperText={errors.duracionMinutos}
                disabled={soloVer}
                fullWidth
                slotProps={{
                  htmlInput: {
                    min: 1,
                    step: 5,
                  },

                  input: {
                    endAdornment: (
                      <InputAdornment position="end">min</InputAdornment>
                    ),
                  },
                }}
                onChange={(event) => {
                  const value = event.target.value;

                  setForm((current) => ({
                    ...current,

                    duracionMinutos: value === "" ? null : Number(value),
                  }));
                }}
              />
            </div>
          )}

          {/* =========================
              COTIZACIÓN
          ========================== */}

          {esCotizacion && (
            <TextField
              label="Precio desde (opcional)"
              type="number"
              value={form.precioDesde ?? ""}
              error={Boolean(errors.precioDesde)}
              helperText={
                errors.precioDesde ??
                "Puedes dejarlo vacío si el precio depende del trabajo."
              }
              disabled={soloVer}
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 0,
                  step: "0.01",
                },

                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <span className="fz-h4 fw-semibold productoServicioModalCurrency">
                        $
                      </span>
                    </InputAdornment>
                  ),
                },
              }}
              onChange={(event) => {
                const value = event.target.value;

                setForm((current) => ({
                  ...current,

                  precioDesde: value === "" ? null : Number(value),
                }));
              }}
            />
          )}

          {/* =========================
              CÓDIGO INTERNO
          ========================== */}

          <TextField
            label="Código interno (opcional)"
            value={form.codigoInterno ?? ""}
            disabled={soloVer}
            fullWidth
            slotProps={{
              htmlInput: {
                maxLength: 100,
              },
            }}
            onChange={(event) =>
              setForm((current) => ({
                ...current,

                codigoInterno: event.target.value,
              }))
            }
          />

          {/* =========================
              ESTADOS
          ========================== */}

          <div className="productoServicioModalStatusOptions">
            <FormControlLabel
              control={
                <Switch
                  checked={form.activo}
                  disabled={soloVer}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,

                      activo: event.target.checked,
                    }))
                  }
                />
              }
              label="Activo"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={form.visible}
                  disabled={soloVer}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,

                      visible: event.target.checked,
                    }))
                  }
                />
              }
              label="Visible públicamente"
            />

            {esServicio && (
              <FormControlLabel
                control={
                  <Switch
                    checked={form.disponible}
                    disabled={soloVer}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,

                        disponible: event.target.checked,
                      }))
                    }
                  />
                }
                label="Disponible"
              />
            )}
          </div>
        </div>
      </div>
    </GenericModal>
  );
};
