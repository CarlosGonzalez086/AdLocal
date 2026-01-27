import {
  IconButton,
  Button,
  Box,
  Paper,
  Tooltip,
  Chip,
  Stack,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import { useEffect, useState } from "react";
import type { ProductoServicioDto } from "../../../services/productosServiciosApi";
import { useProductosServicios } from "../../../hooks/useProductosServicios";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import { SearchInput } from "../../../components/SearchInput";
import { OrderSelect } from "../../../components/OrderSelect";
import { ProductoServicioModal } from "../../../components/ProductosServicios/ProductoServicioModal";
import type { JwtClaims } from "../../../services/auth.api";
import { jwtDecode } from "jwt-decode";

export const ProductosServiciosPage = () => {
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
    listar({ page, rows, orderBy, search, idComercio: 0 });
  }, [page, rows, orderBy, search]);

  const columns: TableColumn<ProductoServicioDto>[] = [
    {
      key: "nombre",
      label: "Nombre",
    },
    {
      key: "descripcion",
      label: "Descripción",
    },
    {
      key: "precio",
      label: "Precio",
      render: (p) => (
        <Typography fontWeight={500}>${p.precio.toLocaleString()}</Typography>
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
            borderRadius: 1.5,
            fontWeight: 500,
            bgcolor: p.activo ? "#E9F7EF" : "#F2F2F7",
            color: p.activo ? "#1E7F4F" : "#666",
          }}
        />
      ),
    },
  ];

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          p: 2.5,
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)",
        }}
      >
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
            disabled={Number(claims?.maxProductos) == total}
            startIcon={<AddIcon />}
            onClick={() => {
              setProducto(initialForm);
              setOpen(true);
            }}
            sx={{
              ml: "auto",
              px: 3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
              background:
                Number(claims?.maxProductos) == total
                  ? "linear-gradient(135deg, #rgb(190, 202, 214)0%, #9ba0a5 100%)"
                  : "linear-gradient(135deg, #007AFF 0%, #005FCC 100%)",
              boxShadow: "0 6px 16px rgba(0,122,255,0.3)",
            }}
          >
            Nuevo
          </Button>
        </Stack>
        {claims?.maxProductos && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.75,
                py: 0.75,
                borderRadius: 999,
                background: "rgba(0,122,255,0.08)",
              }}
            >
              {Number(claims.maxProductos) - total == 0 ? (
                <>
                  <Typography fontSize={13} color="text.secondary">
                    Llegaste al límite de productos o servicios disponibles en
                    tu plan
                  </Typography>
                </>
              ) : (
                <>
                  {" "}
                  <Typography fontSize={13} color="text.secondary">
                    Aún puedes registrar {Number(claims.maxProductos) - total}{" "}
                    productos más
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        )}
      </Paper>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: "1px solid rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
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
            <Stack direction="row" spacing={0.5} className="p-1">
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: "#F2F2F7",
                    "&:hover": { bgcolor: "#E5E5EA" },
                  }}
                  onClick={() => {
                    setProducto(p);
                    setOpen(true);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Eliminar">
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: "#FDECEA",
                    color: "#D93025",
                    "&:hover": { bgcolor: "#FAD2CF" },
                  }}
                  onClick={() =>
                    eliminar(Number(p.id), {
                      page,
                      rows,
                      orderBy,
                      search,
                      idComercio: 0,
                    })
                  }
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>

              <Tooltip title={p.activo ? "Desactivar" : "Activar"}>
                <IconButton
                  size="small"
                  sx={{
                    bgcolor: p.activo ? "#E9F7EF" : "#F2F2F7",
                    color: p.activo ? "#1E7F4F" : "#666",
                  }}
                  onClick={() =>
                    desactivar(Number(p.id),p.activo, {
                      page,
                      rows,
                      orderBy,
                      search,
                      idComercio: 0,
                    })
                  }
                >
                  {p.activo ? (
                    <ToggleOnIcon fontSize="small" />
                  ) : (
                    <ToggleOffIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        />
      </Paper>

      <ProductoServicioModal
        key={`edit-${producto?.id ?? "new"}`}
        open={open}
        onClose={() => {
          setOpen(false);
          setProducto(initialForm);
        }}
        onSave={(p) =>
          guardar(p, { page, rows, orderBy, search, idComercio: 0 })
        }
        producto={producto}
        loading={loading}
      />
    </Box>
  );
};
