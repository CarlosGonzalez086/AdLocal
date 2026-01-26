import { Stack, Typography, Box } from "@mui/material";

type MetodoPago = "guardada" | "nueva" | "transferencia" | "";

interface Props {
  onSelect: (metodo: MetodoPago) => void;
}

export const MetodoPagoStep = ({ onSelect }: Props) => {
  const opciones = [
    { label: "Tarjeta guardada", value: "guardada" },
    { label: "Nueva tarjeta", value: "nueva" },
    { label: "Transferencia bancaria", value: "transferencia" },
  ];

  return (
    <Stack spacing={2}>
      {opciones.map((o) => (
        <Box
          key={o.value}
          onClick={() => onSelect(o.value as MetodoPago)}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "#fff",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.12)" },
          }}
        >
          <Typography fontWeight={600}>{o.label}</Typography>
        </Box>
      ))}
      <Typography variant="body2" color="text.secondary">
        Selecciona cómo deseas pagar tu suscripción.
      </Typography>
    </Stack>
  );
};
