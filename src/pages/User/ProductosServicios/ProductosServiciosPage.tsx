import { IconButton, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
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

export const ProductosServiciosPage = () => {
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
  const [view, setView] = useState(false);
  const [producto, setProducto] = useState<ProductoServicioDto>(initialForm);

  useEffect(() => {
    listar({ page, rows, orderBy, search });
  }, [page, rows, orderBy, search]);

  const columns: TableColumn<ProductoServicioDto>[] = [
    { key: "nombre", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    {
      key: "precio",
      label: "Precio",
      render: (p) => `$${p.precio}`,
    },
    {
      key: "activo",
      label: "Estado",
      render: (p) => (p.activo ? "Activo" : "Inactivo"),
    },
  ];

  return (
    <div>
      <div className="row align-items-center mb-3">
        <div className="col-12 col-md-7 mb-2 mb-md-0">
          <SearchInput
            value={search}
            placeholder="Buscar producto o servicio..."
            onChange={(value) => {
              setSearch(value);
              setPage(0);
            }}
          />
        </div>

        <div className="col-12 col-md-3 mb-2 mb-md-0">
          <OrderSelect
            value={orderBy}
            onChange={(value) => {
              setOrderBy(value);
              setPage(0);
            }}
          />
        </div>

        <div className="col-12 col-md-2 d-flex justify-content-md-end">
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setProducto(initialForm);
              setOpen(true);
            }}
            fullWidth
            className="w-100 w-md-auto"
          >
            Nuevo
          </Button>
        </div>
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
          <>
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                console.log(p);

                setProducto(p);
                setView(true);
              }}
            >
              <VisibilityIcon />
            </IconButton>

            <IconButton
              color="info"
              size="small"
              onClick={() => {
                setProducto(p);
                setOpen(true);
              }}
            >
              <EditIcon />
            </IconButton>

            <IconButton
              color="error"
              size="small"
              onClick={() =>
                eliminar(Number(p.id), { page, rows, orderBy, search })
              }
            >
              <DeleteIcon />
            </IconButton>

            <IconButton
              color={p.activo ? "success" : "default"}
              size="small"
              onClick={() =>
                desactivar(Number(p.id), { page, rows, orderBy, search })
              }
            >
              {p.activo ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </IconButton>
          </>
        )}
      />

      <ProductoServicioModal
        key={`edit-${producto?.id ?? "new"}`}
        open={open}
        onClose={() => {
          setOpen(false);
          setProducto(initialForm);
        }}
        onSave={(p) => guardar(p, { page, rows, orderBy, search })}
        producto={producto}
        loading={loading}
      />

      <ProductoServicioModal
        key={`view-${producto?.id ?? "view"}`}
        open={view}
        onClose={() => {
          setView(false);
          setProducto(initialForm);
        }}
        onSave={async () => {}}
        producto={producto}
        soloVer
      />
    </div>
  );
};
