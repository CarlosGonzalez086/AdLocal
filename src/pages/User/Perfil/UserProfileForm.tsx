import { TextField, Button, Box, Stack, CircularProgress } from "@mui/material";
import type { ProfileUser, ProfileUserUpdateDto } from "../../../services/userProfileApi";
import { useState } from "react";
import { AvatarUpload } from "../../../components/AvatarUpload";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";

interface Props {
  profile: ProfileUser;
  onSave: (data: ProfileUserUpdateDto) => void;
  onUploadPhoto: (file: File) => void;
  loading?: boolean;
  onFocus?: () => void;
}

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    bgcolor: "#fff",
    "& fieldset": { borderColor: "#E0E0E0" },
    "&:hover fieldset": { borderColor: "#BDBDBD" },
    "&.Mui-focused fieldset": { borderColor: "#007AFF" },
  },
  "& .MuiInputLabel-root.Mui-focused": { color: "#007AFF" },
};

export const UserProfileForm = ({
  profile,
  onSave,
  onUploadPhoto,
  loading,
  onFocus,
}: Props) => {
  const [form, setForm] = useState<ProfileUserUpdateDto>({
    nombre: profile.nombre,
    email: profile.email,
    comercioId: profile.comercioId || 0,
  });

  return (
    <Stack spacing={2} mt={1}>
      {/* Avatar */}
      <Box display="flex" justifyContent="center">
        <AvatarUpload profile={profile} onUploadPhoto={onUploadPhoto} />
      </Box>

      {/* Nombre */}
      <TextField
        label="Nombre"
        fullWidth
        value={form.nombre}
        onFocus={onFocus}
        onChange={(e) => setForm({ ...form, nombre: e.target.value })}
        sx={fieldSx}
      />

      {/* Email */}
      <TextField
        label="Correo electrónico"
        fullWidth
        value={form.email}
        onFocus={onFocus}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        sx={fieldSx}
      />

      {/* Botón */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          onClick={() => onSave(form)}
          disabled={loading}
          startIcon={
            loading
              ? <CircularProgress size={16} thickness={4} sx={{ color: "#fff" }} />
              : <SaveRoundedIcon sx={{ fontSize: 17 }} />
          }
          sx={{
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 700,
            fontSize: "0.875rem",
            px: 3,
            py: 1.1,
            background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
            transition: "all 0.25s ease",
            "&:hover": {
              boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
              transform: "translateY(-1px)",
            },
            "&:active": { transform: "scale(0.98)" },
          }}
        >
          {loading ? "Guardando…" : "Guardar cambios"}
        </Button>
      </Box>
    </Stack>
  );
};