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
    <Card sx={{ ...cardStyle, borderRadius: 4, overflow: "hidden" }}>
      <Box
        sx={{
          background: "linear-gradient(160deg, #f0f4ff, #e6f0ff)",
          py: 5,
          textAlign: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <Avatar
          src={comercio.logoBase64}
          variant="rounded"
          sx={{
            width: 140,
            height: 140,
            mx: "auto",
            mb: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: 3,
          }}
        />
        <Typography variant="h5" fontWeight={700} color="#333">
          {comercio.nombre}
        </Typography>
        {comercio.descripcion && (
          <Typography
            variant="body2"
            color="text.secondary"
            mt={1}
            px={{ xs: 2, md: 10 }}
          >
            {comercio.descripcion}
          </Typography>
        )}
      </Box>

      <CardContent>
        <Stack spacing={1.5} mb={3}>
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

        {claims?.planTipo != "FREE" ? (
          <>
            {" "}
            <Divider sx={{ my: 3 }} />
            <SectionTitle
              icon={<Palette sx={{ color: "#FF9500" }} />}
              text="Colores del comercio"
            />
            <Stack direction="row" spacing={2} mb={3}>
              <Chip
                label="Primario"
                sx={{
                  backgroundColor: comercio.colorPrimario,
                  color: "#fff",
                  px: 2,
                  fontWeight: 600,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              />
              <Chip
                label="Secundario"
                sx={{
                  backgroundColor: comercio.colorSecundario,
                  color: "#fff",
                  px: 2,
                  fontWeight: 600,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                }}
              />
            </Stack>
          </>
        ) : (
          <></>
        )}
        <Divider sx={{ my: 3 }} />
        <div className="w-100">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12">
              {imagenes.length > 0 && (
                <>
                  <SectionTitle text="Galería" />
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    {imagenes.slice(0, claims?.maxFotos).map((img, i) => (
                      <Paper
                        key={i}
                        elevation={3}
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          width: "100%",
                          height: 130,
                          cursor: "pointer",
                          transition: "transform 0.3s",
                          "&:hover": { transform: "scale(1.05)" },
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
                </>
              )}
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12">
              {Number(comercio.horarios.length) > 0 && (
                <>
                  <SectionTitle
                    icon={<AccessTime sx={{ color: "#5856D6" }} />}
                    text="Horarios"
                  />
                  <Stack spacing={1}>
                    {comercio.horarios
                      .sort((a, b) => a.dia - b.dia)
                      .map((h) => (
                        <Paper
                          key={h.dia}
                          sx={{
                            p: 1.5,
                            borderRadius: 3,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "#f9faff",
                            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                          }}
                        >
                          <Typography fontWeight={600}>
                            {DIAS_SEMANA_MAP[h.dia]}
                          </Typography>
                          {h.abierto ? (
                            <Typography variant="body2" color="#555">
                              {h.horaApertura} – {h.horaCierre}
                            </Typography>
                          ) : (
                            <Chip label="Cerrado" size="small" color="error" />
                          )}
                        </Paper>
                      ))}
                  </Stack>
                </>
              )}
            </div>
          </div>
        </div>

        {comercio.lat !== 19.4326 && comercio.lng !== -99.1332 && (
          <>
            <Divider sx={{ my: 3 }} />
            <Box sx={{ height: 300, borderRadius: 3, overflow: "hidden" }}>
              <MapContainer
                center={[Number(comercio.lat), Number(comercio.lng)]}
                zoom={16}
                style={{ height: "100%", width: "100%" }}
                dragging={false}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker
                  position={[Number(comercio.lat), Number(comercio?.lng)]}
                />
              </MapContainer>
            </Box>
          </>
        )}

        <Divider sx={{ my: 3 }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Button
            variant="contained"
            onClick={() => setEditando(true)}
            sx={{
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              boxShadow: "0 6px 12px rgba(0,122,255,0.3)",
              "&:hover": { boxShadow: "0 8px 18px rgba(0,122,255,0.35)" },
            }}
          >
            Editar
          </Button>
          {claims?.rol === "Colaborador" ? (
            <></>
          ) : (
            <>
              {" "}
              <Button
                variant="outlined"
                color="error"
                onClick={eliminar}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                }}
              >
                Eliminar
              </Button>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

const InfoRow = ({ icon, text }: any) => (
  <Box display="flex" gap={1.5} alignItems="center">
    {icon}
    <Typography variant="body2" color="#555">
      {text}
    </Typography>
  </Box>
);

const SectionTitle = ({ icon, text }: any) => (
  <Box display="flex" alignItems="center" gap={1} mb={1}>
    {icon && <Box>{icon}</Box>}
    <Typography fontWeight={600} fontSize={16} color="#333">
      {text}
    </Typography>
  </Box>
);

const cardStyle = {
  borderRadius: 4,
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
  backgroundColor: "#fff",
};
