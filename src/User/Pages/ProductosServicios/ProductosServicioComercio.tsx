import { useParams } from "react-router-dom";
import { useProductosServicios } from "../../../hooks/useProductosServicios";
import { useEffect, useState } from "react";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import {
  Chip,
  IconButton,
  Tooltip,
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
import { ModalidadProductoServicio, TipoProductoServicio, type ProductoServicioDto } from "../../../types/User/productosServicios";
import type { JwtClaims } from "../../../types/claims";
import { jwtDecode } from "jwt-decode";

export function ProductosServicioComercio() {
  const { id } = useParams();
  const dataJwt = localStorage.getItem("token");
  const claims: JwtClaims | null = dataJwt
    ? jwtDecode<JwtClaims>(dataJwt)
    : null;

  const initialForm: ProductoServicioDto = {
    id: undefined,
    uuid: undefined,

    nombre: "",
    descripcion: "",

    tipo: TipoProductoServicio.Producto,
    modalidad: ModalidadProductoServicio.Compra,

    precio: null,
    precioDesde: null,

    manejaStock: false,
    stock: null,

    disponible: true,

    permiteDomicilio: true,
    permiteRecoger: true,

    duracionMinutos: null,

    activo: true,
    visible: true,

    codigoInterno: null,

    imagenBase64: "",

    idComercio: 0,
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
  }, [page, rows, orderBy, search, id, listar]);

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
        <span className="fw-semibold fz-body-sm">
          ${p.precio}
        </span>
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
            bgcolor: p.activo ? "rgba(42, 157, 111, 0.12)" : "rgba(142, 147, 155, 0.12)",
            color: p.activo ? "#2A9D6F" : "#8E939B",
          }}
        />
      ),
    },
  ];

  return (
    <div className="w-100">
      <div className="mb-3">
        <ButtonBack route="/app/productos-servicios/comercios" />
      </div>

      <div className="card-adlocal p-3 mb-4">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-md-center">
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
          <button
            type="button"
            className="btn-adlocal btn-adlocal-primary text-nowrap d-inline-flex align-items-center gap-1"
            disabled={limiteAlcanzado}
            onClick={() => {
              setProducto(initialForm);
              setOpen(true);
            }}
          >
            <AddRoundedIcon style={{ fontSize: 18 }} />
            <span>Nuevo</span>
          </button>
        </div>

        {claims?.maxProductos && (
          <div className="mt-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="fz-caption fw-semibold text-muted">
                Productos registrados
              </span>
              <span
                className={`badge-adlocal ${limiteAlcanzado ? "badge-adlocal-danger" : "badge-adlocal-success"} fz-caption fw-bold`}
              >
                {total} / {max}
              </span>
            </div>

            <LinearProgress
              variant="determinate"
              value={porcentaje}
              color={limiteAlcanzado ? "error" : "primary"}
              style={{ height: 6, borderRadius: 999 }}
            />

            <p className="fz-caption text-muted mt-2 mb-0">
              {limiteAlcanzado
                ? "Llegaste al límite de productos de tu plan"
                : `Puedes registrar ${restantes} producto${restantes !== 1 ? "s" : ""} más`}
            </p>
          </div>
        )}
      </div>

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
          <div className="d-flex flex-row gap-1 p-1">
            <Tooltip title="Editar" arrow disableTouchListener>
              <IconButton
                size="small"
                onClick={() => {
                  setProducto({
                    id: p.id,
                    uuid: p.uuid,
                    idComercio: p.idComercio ?? Number(id),
                    imagenBase64: p.imagenBase64,
                    precio: p.precio,
                    precioDesde: p.precioDesde,
                    nombre: p.nombre,
                    stock: p.stock,
                    descripcion: p.descripcion,
                    activo: p.activo,
                    visible: p.visible,
                    tipo: p.tipo,
                    modalidad: p.modalidad,
                    manejaStock: p.manejaStock,
                    disponible: p.disponible,
                    permiteDomicilio: p.permiteDomicilio,
                    permiteRecoger: p.permiteRecoger,
                    duracionMinutos: p.duracionMinutos,
                    codigoInterno: p.codigoInterno,
                  });
                  setOpen(true);
                }}
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  bgcolor: "rgba(0,0,0,0.05)",
                  border: "1px solid rgba(0,0,0,0.07)",
                  "&:hover": {
                    bgcolor: "rgba(0, 137, 137, 0.10)",
                    color: "#008989",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                <EditRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar" arrow disableTouchListener>
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
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  bgcolor: "rgba(216, 64, 40, 0.08)",
                  border: "1px solid rgba(216, 64, 40, 0.20)",
                  color: "#D84028",
                  "&:hover": { bgcolor: "rgba(216, 64, 40, 0.16)" },
                  transition: "all 0.2s ease",
                }}
              >
                <DeleteOutlineRoundedIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title={p.activo ? "Desactivar" : "Activar"} arrow disableTouchListener>
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
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  bgcolor: p.activo
                    ? "rgba(42, 157, 111, 0.12)"
                    : "rgba(0,0,0,0.05)",
                  border: `1px solid ${p.activo ? "rgba(42, 157, 111, 0.25)" : "rgba(0,0,0,0.07)"}`,
                  color: p.activo ? "#2A9D6F" : "#8E939B",
                  "&:hover": {
                    bgcolor: p.activo
                      ? "rgba(42, 157, 111, 0.22)"
                      : "rgba(0,0,0,0.09)",
                  },
                  transition: "all 0.2s ease",
                }}
              >
                {p.activo ? (
                  <ToggleOnRoundedIcon sx={{ fontSize: 20 }} />
                ) : (
                  <ToggleOffRoundedIcon sx={{ fontSize: 20 }} />
                )}
              </IconButton>
            </Tooltip>
          </div>
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
    </div>
  );
}
