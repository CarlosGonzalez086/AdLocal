import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import type { JwtClaims } from "../../services/auth.api";
import type { ComercioDto } from "../../services/comercioApi";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import {
  LocationOn,
  Phone,
  Email,
  AccessTime,
  Palette,
} from "@mui/icons-material";
import { DIAS_SEMANA_MAP } from "../../utils/constantes";

interface Props {
  comercio: ComercioDto;
  claims: JwtClaims;
  imagenes: string[];
  eliminar: () => void;
  setEditando: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ComercioPreviewCard({
  comercio,
  claims,
  imagenes,
  eliminar,
  setEditando,
}: Props) {
  return (
    <Card sx={cardStyle}>
      {/* HERO SECTION */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${comercio.colorPrimario}22, ${comercio.colorSecundario}22)`,
          py: 6,
          px: 3,
          textAlign: "center",
        }}
      >
        <Avatar
          src={comercio.logoBase64}
          variant="rounded"
          sx={{
            width: 120,
            height: 120,
            mx: "auto",
            mb: 2,
            borderRadius: "24px",
            boxShadow: "0 15px 40px rgba(0,0,0,.15)",
          }}
        />

        <Typography fontSize="1.6rem" fontWeight={800}>
          {comercio.nombre}
        </Typography>

        {comercio.descripcion && (
          <Typography
            variant="body2"
            sx={{
              mt: 1.5,
              maxWidth: 500,
              mx: "auto",
              color: "text.secondary",
              lineHeight: 1.6,
            }}
          >
            {comercio.descripcion}
          </Typography>
        )}
      </Box>

      <CardContent sx={{ p: 4 }}>
        {/* INFORMACIÓN */}
        <Stack spacing={2} mb={4}>
          {comercio.direccion && (
            <InfoRow
              icon={<LocationOn sx={{ color: "#007AFF" }} />}
              text={`${comercio.direccion}, ${comercio.municipioNombre}, ${comercio.estadoNombre}`}
            />
          )}
          {comercio.telefono && (
            <InfoRow
              icon={<Phone sx={{ color: "#34C759" }} />}
              text={comercio.telefono}
            />
          )}
          {comercio.email && (
            <InfoRow
              icon={<Email sx={{ color: "#FF3B30" }} />}
              text={comercio.email}
            />
          )}
        </Stack>

        {/* COLORES */}
        {claims?.planTipo !== "FREE" && (
          <>
            <Divider sx={{ my: 4 }} />

            <SectionTitle
              icon={<Palette sx={{ color: "#FF9500" }} />}
              text="Colores del comercio"
            />

            <Stack direction="row" spacing={2} mb={4}>
              <ColorChip
                label="Primario"
                color={comercio.colorPrimario}
              />
              <ColorChip
                label="Secundario"
                color={comercio.colorSecundario}
              />
            </Stack>
          </>
        )}

        <Divider sx={{ my: 4 }} />

        {/* GALERÍA + HORARIOS GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 4,
          }}
        >
          {/* GALERÍA */}
          {imagenes.length > 0 && (
            <Box>
              <SectionTitle text="Galería" />
              <Box display="flex" flexWrap="wrap" gap={2}>
                {imagenes.slice(0, claims?.maxFotos).map((img, i) => (
                  <Paper
                    key={i}
                    sx={{
                      borderRadius: "20px",
                      overflow: "hidden",
                      width: "100%",
                      height: 140,
                      cursor: "pointer",
                      transition: "all .35s ease",
                      boxShadow: "0 10px 25px rgba(0,0,0,.08)",
                      "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: "0 20px 40px rgba(0,0,0,.15)",
                      },
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {/* HORARIOS */}
          {comercio.horarios.length > 0 && (
            <Box>
              <SectionTitle
                icon={<AccessTime sx={{ color: "#5856D6" }} />}
                text="Horarios"
              />

              <Stack spacing={1.5}>
                {comercio.horarios
                  .sort((a, b) => a.dia - b.dia)
                  .map((h) => (
                    <Paper
                      key={h.dia}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: "18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background:
                          "linear-gradient(180deg, rgba(248,249,255,.9), rgba(255,255,255,.95))",
                        border: "1px solid rgba(0,0,0,.05)",
                      }}
                    >
                      <Typography fontWeight={600}>
                        {DIAS_SEMANA_MAP[h.dia]}
                      </Typography>

                      {h.abierto ? (
                        <Typography variant="body2">
                          {h.horaApertura} – {h.horaCierre}
                        </Typography>
                      ) : (
                        <Chip
                          label="Cerrado"
                          size="small"
                          sx={{
                            background: "rgba(255,59,48,.12)",
                            color: "#FF3B30",
                            fontWeight: 600,
                            borderRadius: "999px",
                          }}
                        />
                      )}
                    </Paper>
                  ))}
              </Stack>
            </Box>
          )}
        </Box>

        {/* MAPA */}
        {comercio.lat && comercio.lng && (
          <>
            <Divider sx={{ my: 4 }} />
            <Box
              sx={{
                height: 320,
                borderRadius: "24px",
                overflow: "hidden",
                boxShadow: "0 20px 45px rgba(0,0,0,.1)",
              }}
            >
              <MapContainer
                center={[Number(comercio.lat), Number(comercio.lng)]}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
                dragging={false}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[Number(comercio.lat), Number(comercio.lng)]}
                />
              </MapContainer>
            </Box>
          </>
        )}

        <Divider sx={{ my: 4 }} />

        {/* BOTONES */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            onClick={() => setEditando(true)}
            sx={{
              flex: 1,
              py: 1.4,
              borderRadius: "18px",
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.95rem",
              background:
                "linear-gradient(135deg, #007AFF, #0051FF)",
              boxShadow: "0 12px 30px rgba(0,122,255,.35)",
              "&:hover": {
                boxShadow: "0 18px 40px rgba(0,122,255,.45)",
              },
            }}
          >
            Editar
          </Button>

          {claims?.rol !== "Colaborador" && (
            <Button
              variant="outlined"
              color="error"
              onClick={eliminar}
              sx={{
                flex: 1,
                py: 1.4,
                borderRadius: "18px",
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              Eliminar
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

/* ================== COMPONENTES AUXILIARES ================== */

const InfoRow = ({ icon, text }: any) => (
  <Box display="flex" gap={2} alignItems="center">
    {icon}
    <Typography variant="body2" color="text.secondary">
      {text}
    </Typography>
  </Box>
);

const SectionTitle = ({ icon, text }: any) => (
  <Box display="flex" alignItems="center" gap={1} mb={2}>
    {icon}
    <Typography fontWeight={700} fontSize="1rem">
      {text}
    </Typography>
  </Box>
);

const ColorChip = ({ label, color }: any) => (
  <Chip
    label={label}
    sx={{
      backgroundColor: color,
      color: "#fff",
      px: 2,
      fontWeight: 600,
      borderRadius: "999px",
      boxShadow: "0 6px 15px rgba(0,0,0,.2)",
    }}
  />
);

const cardStyle = {
  borderRadius: "28px",
  overflow: "hidden",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.9))",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 25px 60px rgba(0,0,0,0.08)",
};
