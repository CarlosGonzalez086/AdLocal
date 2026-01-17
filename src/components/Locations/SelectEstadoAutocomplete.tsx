import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";
import { useLocations } from "../../hooks/useLocations";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export const SelectEstadoAutocomplete = ({
  value,
  onChange,
}: Props) => {
  const { states, loading, getAllStates } = useLocations();

  useEffect(() => {
    getAllStates();
  }, []);

  const selected = states.find((s) => s.id === value) ?? null;

  return (
    <Autocomplete
      fullWidth
      options={states}
      value={selected}
      loading={loading}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      getOptionLabel={(opt) => opt.name}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.id : 0);
      }}
      renderInput={(params) => (
        <TextField {...params} label="Estado" margin="normal" />
      )}
    />
  );
};
