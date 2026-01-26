import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useLocations } from "../../hooks/useLocations";

interface Props {
  estadoId: number;
  value: number;
  onChange: (value: number) => void;
}

export const SelectMunicipioAutocomplete = ({
  estadoId,
  value,
  onChange,
}: Props) => {
  const { municipalities, loading, getMunicipalitiesByState } = useLocations();

  useEffect(() => {
    getMunicipalitiesByState(estadoId);
  }, [estadoId]);

  const selected = municipalities.find((m) => m.id === value) ?? null;
  return (
    <Autocomplete
      fullWidth
      disabled={estadoId == 0}
      loading={loading}
      options={municipalities}
      value={selected}
      isOptionEqualToValue={(opt, val) => opt.id === val.id}
      getOptionLabel={(opt) => opt.name}
      onChange={(_, newValue) => {
        onChange(newValue ? newValue.id : 0);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Municipio"
          margin="normal"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};
