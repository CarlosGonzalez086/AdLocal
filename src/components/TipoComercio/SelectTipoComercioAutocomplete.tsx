import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";
import { useTiposComercio } from "../../hooks/useTiposComercio";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export const SelectTipoComercioAutocomplete = ({ value, onChange }: Props) => {
  const { tiposSelect, loadingSelect, listarParaSelect } = useTiposComercio();

  useEffect(() => {
    listarParaSelect();
  }, []);

  const selected = tiposSelect.find((t) => t.id === value) ?? null;

  return (
    <Autocomplete
      fullWidth
      options={tiposSelect}
      value={selected}
      loading={loadingSelect}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      getOptionLabel={(opt) => opt.nombre}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.id : 0);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Tipo de Comercio" margin="normal" />
      )}
    />
  );
};
