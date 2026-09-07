import { Button, TextField } from "@mui/material";
import type { ChangeEvent, FC, Dispatch, SetStateAction } from "react";
import { SelectEstadoAutocomplete } from "../../../../components/Locations/SelectEstadoAutocomplete";
import { SelectMunicipioAutocomplete } from "../../../../components/Locations/SelectMunicipioAutocomplete";
import { SelectTipoComercioAutocomplete } from "../../../../components/TipoComercio/SelectTipoComercioAutocomplete";
import MaterialSymbol from "../../../../components/UI/MaterialSymbol/MaterialSymbol";
import type { ComercioDto } from "../../../../types/User/comercio";
import { SectionHeader } from "../../Home/Components/SectionHeader";

export type EditableTextField =
  | "nombre"
  | "direccion"
  | "telefono"
  | "email"
  | "descripcion"
  | "colorPrimario"
  | "colorSecundario";

interface ComercioTabGeneralProps {
  form: ComercioDto;
  setForm: Dispatch<SetStateAction<ComercioDto>>;
  editable: boolean;
  preview: string | null;
  handleImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleChange: (
    field: EditableTextField,
  ) => (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ComercioTabGeneral: FC<ComercioTabGeneralProps> = ({
  form,
  setForm,
  editable,
  preview,
  handleImageChange,
  handleChange,
}) => {
  return (
    <>
      <section className="commerceSectionCard">
        <SectionHeader
          icon="storefront"
          title="Información general"
          description="Configura los datos principales que podrán consultar los usuarios."
        />

        {/* LOGO */}
        <div className="d-flex flex-column flex-sm-row align-items-center gap-3 mb-4">
          <div className="commerceLogoPreview">
            {preview ? (
              <img
                src={preview}
                alt={`Logotipo de ${form.nombre || "comercio"}`}
                className="commerceLogoImage"
              />
            ) : (
              <MaterialSymbol icon="storefront" size="large" />
            )}
          </div>

          {editable && (
            <Button
              component="label"
              variant="outlined"
              size="small"
              className="commerceUploadLogoButton fz-h4 fw-semibold"
              startIcon={<MaterialSymbol icon="upload" size="small" />}
            >
              {preview ? "Cambiar logo" : "Subir logo"}
              <input
                hidden
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
          )}
        </div>

        {/* CAMPOS */}
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <TextField
              label="Nombre"
              value={form.nombre ?? ""}
              onChange={handleChange("nombre")}
              fullWidth
              required
              disabled={!editable}
            />
          </div>

          <div className="col-12 col-md-6">
            <TextField
              label="Dirección"
              value={form.direccion ?? ""}
              onChange={handleChange("direccion")}
              fullWidth
              disabled={!editable}
            />
          </div>

          <div className="col-12 col-md-6">
            <TextField
              label="Teléfono"
              value={form.telefono ?? ""}
              onChange={handleChange("telefono")}
              fullWidth
              disabled={!editable}
              slotProps={{
                htmlInput: {
                  inputMode: "numeric",
                  maxLength: 10,
                },
              }}
            />
          </div>

          <div className="col-12 col-md-6">
            <TextField
              type="email"
              label="Correo electrónico"
              value={form.email ?? ""}
              onChange={handleChange("email")}
              fullWidth
              disabled={!editable}
            />
          </div>

          <div className="col-12">
            <TextField
              label="Descripción"
              value={form.descripcion ?? ""}
              onChange={handleChange("descripcion")}
              fullWidth
              multiline
              rows={4}
              disabled={!editable}
            />
          </div>
        </div>
      </section>

      {/* CLASIFICACIÓN */}
      <section className="commerceSectionCard mt-4">
        <SectionHeader
          icon="location_city"
          title="Clasificación y región"
          description="Selecciona el estado, municipio y tipo de comercio."
        />

        <div
          className={!editable ? "commerceReadOnlySection" : undefined}
          aria-disabled={!editable}
        >
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <SelectEstadoAutocomplete
                value={form.estadoId}
                onChange={(estadoId) => {
                  if (!editable) return;
                  setForm((prev) => ({
                    ...prev,
                    estadoId,
                    municipioId: 0,
                  }));
                }}
              />
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <SelectMunicipioAutocomplete
                estadoId={form.estadoId}
                value={form.municipioId}
                onChange={(municipioId) => {
                  if (!editable) return;
                  setForm((prev) => ({
                    ...prev,
                    municipioId,
                  }));
                }}
              />
            </div>

            <div className="col-12 col-lg-4">
              <SelectTipoComercioAutocomplete
                value={form.tipoComercioId}
                onChange={(tipoComercioId) => {
                  if (!editable) return;
                  setForm((prev) => ({
                    ...prev,
                    tipoComercioId,
                  }));
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* COLORES */}
      <section className="commerceSectionCard mt-4">
        <SectionHeader
          icon="palette"
          title="Colores de marca"
          description="Personaliza la apariencia pública del comercio."
        />

        <div className="row g-3">
          <div className="col-12 col-md-6">
            <TextField
              type="color"
              label="Color primario"
              value={form.colorPrimario || "#008989"}
              onChange={handleChange("colorPrimario")}
              fullWidth
              disabled={!editable}
              className="commerceColorField"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </div>

          <div className="col-12 col-md-6">
            <TextField
              type="color"
              label="Color secundario"
              value={form.colorSecundario || "#E7692C"}
              onChange={handleChange("colorSecundario")}
              fullWidth
              disabled={!editable}
              className="commerceColorField"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default ComercioTabGeneral;
