import { TextField, InputAdornment, IconButton } from "@mui/material";
import MaterialSymbol from "./UI/MaterialSymbol/MaterialSymbol";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
}

export const SearchInput = ({
  value,
  placeholder = "Buscar...",
  onChange,
  fullWidth = true,
}: SearchInputProps) => {
  return (
    <TextField
      size="small"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      fullWidth={fullWidth}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          backgroundColor: "#FFFFFF",
          height: "42px",
          fontSize: "14px",
          "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.12)",
          },
          "&:hover fieldset": {
            borderColor: "#007AFF",
          },
        },
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <MaterialSymbol
                icon="search"
                size="small"
                style={{ color: "#8E8E93" }}
              />
            </InputAdornment>
          ),
          endAdornment: value ? (
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => onChange("")}
                aria-label="Limpiar búsqueda"
                sx={{ p: 0.5 }}
              >
                <MaterialSymbol
                  icon="close"
                  size="small"
                  style={{ color: "#8E8E93" }}
                />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        },
      }}
    />
  );
};
