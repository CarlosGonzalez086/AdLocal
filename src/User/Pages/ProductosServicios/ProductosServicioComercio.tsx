import { useParams } from "react-router-dom";
import { useProductosServicios } from "../../../hooks/useProductosServicios";
import { useEffect, useState } from "react";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  LinearProgress,
} from "@mui/material";
import { SearchInput } from "../../../components/SearchInput";
import { OrderSelect } from "../../../components/OrderSelect";
import { ProductoServicioModal } from "../../../components/ProductosServicios/ProductoServicioModal";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ToggleOnRoundedIcon from "@mui/icons-material/ToggleOnRounded";
import ToggleOffRoundedIcon from "@mui/icons-material/ToggleOffRounded";
import ButtonBack from "../../../components/ButtonBack";

const cardSx = {
  borderRadius: 4,
  bgcolor: "rgba(255,255,255,0.92)",
  backdropFilter: "blur(14px)",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
};

export function ProductosServicioComercio() {
  const { id } = useParams();
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;

  const initialForm: ProductoServicioDto = {
    nombre: "",
    descripcion: "",
    precio: 0,
    activo: true,
    stock: 0,
    imagenBase64: "",
    idComercio: id ? Number(id) : 0,
  };

  const { productos, total, loading, listar, guardar, eliminar, desactivar } =
    useProductosServicios();

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10);
  const [orderBy, setOrderBy] = useState("recent");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [producto, setProducto] = useState<ProductoServicioDto>(initialForm);

  useEffect(() => {
    listar({ page, rows, orderBy, search, idComercio: Number(id) });
  }, [page, rows, orderBy, search, id]);

  const max = Number(claims?.maxProductos);
  const restantes = max - total;
  const limiteAlcanzado = restantes <= 0;
  const porcentaje = max > 0 ? Math.min((total / max) * 100, 100) : 0;

  const columns: TableColumn<ProductoServicioDto>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    {
      key: "precio",
      label: "Precio",
      render: (p) => (
        <Typography fontWeight={600} fontSize="0.875rem">
          ${p.precio.toLocaleString()}
        </Typography>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (p) => (
        <Chip
          label={p.activo ? "Activo" : "Inactivo"}
          size="small"
          sx={{
            height: 22,
            borderRadius: 999,
            fontSize: "0.72rem",
            fontWeight: 700,
            bgcolor: p.activo ? "rgba(52,199,89,0.10)" : "rgba(0,0,0,0.06)",
            color: p.activo ? "#34C759" : "#8e8e93",
          }}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box mb={2}>
        <ButtonBack route="/app/productos-servicios/comercios" />
      </Box>

      <Box sx={{ ...cardSx, p: { xs: 2.5, sm: 3 }, mb: 2.5 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
        >
          <SearchInput
            value={search}
            placeholder="Buscar producto o servicio…"
            onChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
          />
          <OrderSelect
            value={orderBy}
            onChange={(value) => {
              setOrderBy(value);
              setPage(0);
            }}
          />
          <Button
            variant="contained"
            disabled={limiteAlcanzado}
            startIcon={<AddRoundedIcon sx={{ fontSize: 18 }} />}
            onClick={() => {
              setProducto(initialForm);
              setOpen(true);
            }}
            sx={{
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.875rem",
              px: 3,
              py: 1.2,
              background: "linear-gradient(135deg, #1c1c1e, #3a3a3c)",
              boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
              whiteSpace: "nowrap",
              transition: "all 0.25s ease",
              "&:hover": {
                boxShadow: "0 10px 24px rgba(0,0,0,0.24)",
                transform: "translateY(-1px)",
              },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            Nuevo
          </Button>
        </Stack>

        {claims?.maxProductos && (
          <Box mt={2.5}>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Typography
                fontSize="0.78rem"
                fontWeight={600}
                color="text.secondary"
              >
                Productos registrados
              </Typography>
              <Box
                sx={{
                  px: 1.2,
                  py: 0.2,
                  borderRadius: 999,
                  bgcolor: limiteAlcanzado
                    ? "rgba(255,59,48,0.10)"
                    : "rgba(52,199,89,0.10)",
                  border: `1px solid ${limiteAlcanzado ? "rgba(255,59,48,0.20)" : "rgba(52,199,89,0.20)"}`,
                }}
              >
                <Typography
                  fontSize="0.7rem"
                  fontWeight={700}
                  color={limiteAlcanzado ? "error.main" : "success.main"}
                >
                  {total} / {max}
                </Typography>
              </Box>
            </Stack>

            <LinearProgress
              variant="determinate"
              value={porcentaje}
              sx={{
                height: 6,
                borderRadius: 999,
                bgcolor: "rgba(0,0,0,0.06)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 999,
                  bgcolor: limiteAlcanzado ? "error.main" : "#007AFF",
                },
              }}
            />

            <Typography fontSize="0.72rem" color="text.disabled" mt={0.8}>
              {limiteAlcanzado
                ? "Llegaste al límite de productos de tu plan"
                : `Puedes registrar ${restantes} producto${restantes !== 1 ? "s" : ""} más`}
            </Typography>
          </Box>
        )}
      </Box>

      <GenericTable<ProductoServicioDto>
        columns={columns}
        data={productos}
        loading={loading}
        emptyText="No hay productos o servicios registrados"
        page={page}
        rowsPerPage={rows}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={(r) => {
          setRows(r);
          setPage(0);
        }}
        actions={(p) => (
          <Stack direction="row" spacing={0.5} sx={{ p: 0.5 }}>
            <Tooltip title="Editar" arrow>
              <IconButton
                size="small"
                onClick={() => {
                  setProducto({
                    id: p.id,
                    idComercio: producto.idComercio,
                    imagenBase64: p.imagenBase64,
                    precio: p.precio,
                    nombre: p.nombre,
                    stock: p.stock,
                    descripcion: p.descripcion,
                    activo: p.activo,
                  });
                  setOpen(true);
                }}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  bgcolor: "rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  "&:hover": {
                    bgcolor: "rgba(0,122,255,0.10)",
                    color: "#007AFF",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <EditRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar" arrow>
              <IconButton
                size="small"
                onClick={() =>
                  eliminar(Number(p.id), Number(id), {
                    page,
                    rows,
                    orderBy,
                    search,
                    idComercio: Number(id),
                  })
                }
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  bgcolor: "rgba(255,59,48,0.08)",
                  border: "1px solid rgba(255,59,48,0.15)",
                  color: "#FF3B30",
                  "&:hover": { bgcolor: "rgba(255,59,48,0.16)" },
                  transition: "all 0.2s ease",
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={p.activo ? "Desactivar" : "Activar"} arrow>
              <IconButton
                size="small"
                onClick={() =>
                  desactivar(Number(p.id), Number(id), Boolean(p.activo), {
                    page,
                    rows,
                    orderBy,
                    search,
                    idComercio: Number(id),
                  })
                }
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 999,
                  bgcolor: p.activo
                    ? "rgba(52,199,89,0.10)"
                    : "rgba(0,0,0,0.05)",
                  border: `1px solid ${p.activo ? "rgba(52,199,89,0.20)" : "rgba(0,0,0,0.07)"}`,
                  color: p.activo ? "#34C759" : "#8e8e93",
                  "&:hover": {
                    bgcolor: p.activo
                      ? "rgba(52,199,89,0.20)"
                      : "rgba(0,0,0,0.09)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {p.activo ? (
                  <ToggleOnRoundedIcon sx={{ fontSize: 18 }} />
                ) : (
                  <ToggleOffRoundedIcon sx={{ fontSize: 18 }} />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        )}
      />

      <ProductoServicioModal
        key={`edit-${producto?.id ?? "new"}`}
        open={open}
        onClose={() => {
          setOpen(false);
          setProducto(initialForm);
        }}
        onSave={(p) =>
          guardar(p, { page, rows, orderBy, search, idComercio: Number(id) })
        }
        producto={producto}
        loading={loading}
      />
    </Box>
  );
}
