import { Box, MenuItem, Select, Typography } from "@mui/material";

interface Props {
  comercios: { id: number; nombre: string }[];
  value: number;
  onChange: (id: number) => void;
}

export default function ComercioSelector({
  comercios,
  value,
  onChange,
}: Props) {
  if (comercios.length <= 0) return null;

  return (
    <Box
      sx={{
        mb: 3,
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(14px)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        maxWidth: 420,
        mx: { xs: "auto", sm: 0 },
      }}
    >
      <Typography fontWeight={600} fontSize={13} mb={1} color="text.secondary">
        Comercio activo
      </Typography>

      <Select
        fullWidth
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        size="small"
        sx={{
          borderRadius: 3,
          backgroundColor: "#f9fafb",
          fontSize: 14,
        }}
      >
        {comercios.map((c) => (
          <MenuItem key={c.id} value={c.id}>
            {c.nombre}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}
