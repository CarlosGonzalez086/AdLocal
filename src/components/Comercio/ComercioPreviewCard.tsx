import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { JwtClaims } from "../../services/auth.api";
import type { ComercioDto } from "../../services/comercioApi";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import {
  LocationOnRounded,
  PhoneRounded,
  EmailRounded,
  AccessTimeRounded,
  PaletteRounded,
  EditRounded,
  DeleteOutlineRounded,
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
    <Card
      elevation={0}
      sx={{
        borderRadius: 5,
        overflow: "hidden",
        bgcolor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 20px 48px rgba(0,0,0,0.09)",
      }}
    >
      <Box
        sx={{
          background: `linear-gradient(135deg, ${comercio.colorPrimario}, ${comercio.colorSecundario})`,
          py: { xs: 5, sm: 6 },
          px: 3,
          textAlign: "center",
          position: "relative",
        }}
      >
        <Avatar
          src={comercio.logoBase64}
          variant="rounded"
          sx={{
            width: { xs: 96, sm: 114 },
            height: { xs: 96, sm: 114 },
            mx: "auto",
            mb: 2,
            borderRadius: 4,
            border: "3px solid rgba(255,255,255,0.85)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.22)",
          }}
        />

        <Typography
          sx={{
            fontSize: { xs: "1.4rem", sm: "1.7rem" },
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.5px",
          }}
        >
          {comercio.nombre}
        </Typography>

        {comercio.descripcion && (
          <Typography
            sx={{
              mt: 1.2,
              maxWidth: 480,
              mx: "auto",
              fontSize: "0.875rem",
              color: "rgba(255,255,255,0.82)",
              lineHeight: 1.6,
            }}
          >
            {comercio.descripcion}
          </Typography>
        )}
      </Box>

      <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
        <SectionCard>
          <Stack spacing={1.8}>
            {comercio.direccion && (
              <InfoRow
                icon={
                  <LocationOnRounded sx={{ color: "#007AFF", fontSize: 20 }} />
                }
                text={`${comercio.direccion}, ${comercio.municipioNombre}, ${comercio.estadoNombre}`}
              />
            )}
            {comercio.telefono && (
              <InfoRow
                icon={<PhoneRounded sx={{ color: "#34C759", fontSize: 20 }} />}
                text={comercio.telefono}
              />
            )}
            {comercio.email && (
              <InfoRow
                icon={<EmailRounded sx={{ color: "#FF3B30", fontSize: 20 }} />}
                text={comercio.email}
              />
            )}
          </Stack>
        </SectionCard>

        <>
          <Divider sx={{ my: 3, opacity: 0.5 }} />
          <SectionCard>
            <SectionTitle
              icon={<PaletteRounded sx={{ color: "#FF9500", fontSize: 18 }} />}
              text="Colores de marca"
            />
            <Stack direction="row" spacing={1.5}>
              <ColorChip label="Primario" color={comercio.colorPrimario} />
              <ColorChip label="Secundario" color={comercio.colorSecundario} />
            </Stack>
          </SectionCard>
        </>

        {(imagenes.length > 0 || comercio.horarios.length > 0) && (
          <>
            <Divider sx={{ my: 3, opacity: 0.5 }} />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: 3,
              }}
            >
              {/* GALERÍA */}
              {imagenes.length > 0 && (
                <Box>
                  <SectionTitle text="🖼️ Galería" />
                  <Stack spacing={1.5}>
                    {imagenes.slice(0, claims?.maxFotos).map((img, i) => (
                      <Box
                        key={i}
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          height: 140,
                          border: "1px solid rgba(0,0,0,0.06)",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                          transition:
                            "transform 0.25s ease, box-shadow 0.25s ease",
                          "&:hover": {
                            transform: "scale(1.02)",
                            boxShadow: "0 10px 28px rgba(0,0,0,0.14)",
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
                      </Box>
                    ))}
                  </Stack>
                </Box>
              )}
              {comercio.horarios.length > 0 && (
                <Box>
                  <SectionTitle
                    icon={
                      <AccessTimeRounded
                        sx={{ color: "#5856D6", fontSize: 18 }}
                      />
                    }
                    text="Horarios"
                  />
                  <Stack spacing={1}>
                    {comercio.horarios
                      .sort((a, b) => a.dia - b.dia)
                      .map((h) => (
                        <Box
                          key={h.dia}
                          sx={{
                            px: 2,
                            py: 1.2,
                            borderRadius: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: h.abierto
                              ? "rgba(255,255,255,0.95)"
                              : "rgba(0,0,0,0.03)",
                            border: "1px solid",
                            borderColor: h.abierto
                              ? "rgba(0,0,0,0.06)"
                              : "rgba(0,0,0,0.04)",
                          }}
                        >
                          <Typography fontWeight={600} fontSize="0.875rem">
                            {DIAS_SEMANA_MAP[h.dia]}
                          </Typography>
                          {h.abierto ? (
                            <Typography
                              fontSize="0.8rem"
                              color="text.secondary"
                              fontWeight={500}
                            >
                              {h.horaApertura} – {h.horaCierre}
                            </Typography>
                          ) : (
                            <Chip
                              label="Cerrado"
                              size="small"
                              sx={{
                                height: 22,
                                fontSize: "0.7rem",
                                fontWeight: 700,
                                bgcolor: "rgba(255,59,48,0.10)",
                                color: "#FF3B30",
                                borderRadius: 999,
                              }}
                            />
                          )}
                        </Box>
                      ))}
                  </Stack>
                </Box>
              )}
            </Box>
          </>
        )}

        {comercio.lat && comercio.lng && (
          <>
            <Divider sx={{ my: 3, opacity: 0.5 }} />
            <Box
              sx={{
                height: { xs: 240, sm: 300 },
                borderRadius: 4,
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
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

        <Divider sx={{ my: 3, opacity: 0.5 }} />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant="contained"
            onClick={() => setEditando(true)}
            startIcon={<EditRounded sx={{ fontSize: 18 }} />}
            sx={{
              flex: 1,
              py: 1.4,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.9rem",
              background: "linear-gradient(135deg, #007AFF, #0051FF)",
              boxShadow: "0 8px 22px rgba(0,122,255,0.30)",
              transition: "all 0.25s ease",
              "&:hover": {
                boxShadow: "0 12px 28px rgba(0,122,255,0.42)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            Editar
          </Button>

          {claims?.rol !== "Colaborador" && (
            <Button
              variant="outlined"
              color="error"
              onClick={eliminar}
              startIcon={<DeleteOutlineRounded sx={{ fontSize: 18 }} />}
              sx={{
                flex: 1,
                py: 1.4,
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.9rem",
                borderColor: "rgba(255,59,48,0.35)",
                "&:hover": {
                  bgcolor: "rgba(255,59,48,0.06)",
                  borderColor: "#FF3B30",
                },
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


const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <Box
    sx={{
      p: { xs: 2, sm: 2.5 },
      borderRadius: 4,
      bgcolor: "rgba(255,255,255,0.95)",
      border: "1px solid rgba(0,0,0,0.06)",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    }}
  >
    {children}
  </Box>
);

const InfoRow = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <Box display="flex" gap={1.5} alignItems="center">
    {icon}
    <Typography fontSize="0.875rem" color="text.secondary" fontWeight={500}>
      {text}
    </Typography>
  </Box>
);

const SectionTitle = ({
  icon,
  text,
}: {
  icon?: React.ReactNode;
  text: string;
}) => (
  <Box display="flex" alignItems="center" gap={0.8} mb={1.5}>
    {icon}
    <Typography fontWeight={700} fontSize="0.9rem" color="text.primary">
      {text}
    </Typography>
  </Box>
);

const ColorChip = ({ label, color }: { label: string; color: string }) => (
  <Chip
    label={label}
    size="small"
    sx={{
      bgcolor: color,
      color: "#fff",
      px: 1.5,
      fontWeight: 700,
      fontSize: "0.75rem",
      borderRadius: 999,
      boxShadow: `0 4px 12px ${color}55`,
    }}
  />
);
