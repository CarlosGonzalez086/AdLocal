import { Box, Button, Stack, Tooltip } from "@mui/material";
import { useEffect, useState } from "react";
import { useProductosServicios } from "../../../hooks/useProductosServicios";
import {
  GenericTable,
  type TableColumn,
} from "../../../components/layouts/GenericTable";
import { SearchInput } from "../../../components/SearchInput";
import { OrderSelect } from "../../../components/OrderSelect";
import { ProductoServicioModal } from "../../../components/ProductosServicios/ProductoServicioModal";
import MaterialSymbol from "../../../components/UI/MaterialSymbol/MaterialSymbol";
import {
  ModalidadProductoServicio,
  TipoProductoServicio,
  type ProductoServicioDto,
} from "../../../types/User/productosServicios";
import AddIcon from "@mui/icons-material/Add";

export const ProductosServiciosPage = () => {
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
    listar({
      page,
      rows,
      orderBy,
      search,
      idComercio: 0,
    });
  }, [page, rows, orderBy, search]);

  const columns: TableColumn<ProductoServicioDto>[] = [
    {
      key: "nombre",
      label: "Nombre",
    },

    {
      key: "tipo",
      label: "Tipo",

      render: (p) => (
        <span className="productoServicioType fz-h5 fw-semibold">
          {p.tipo === TipoProductoServicio.Producto ? "Producto" : "Servicio"}
        </span>
      ),
    },

    {
      key: "modalidad",
      label: "Modalidad",

      render: (p) => {
        const labels: Record<ModalidadProductoServicio, string> = {
          [ModalidadProductoServicio.Compra]: "Compra",
          [ModalidadProductoServicio.Reservacion]: "Reservación",
          [ModalidadProductoServicio.Cotizacion]: "Cotización",
        };

        return (
          <span className="productoServicioModality fz-h5 fw-semibold">
            {labels[p.modalidad] ?? "—"}
          </span>
        );
      },
    },

    {
      key: "precio",
      label: "Precio",

      render: (p) => {
        if (p.modalidad === ModalidadProductoServicio.Cotizacion) {
          if (p.precioDesde === null || p.precioDesde === undefined) {
            return (
              <span className="productoServicioPriceQuote fz-h5 fw-semibold">
                A cotizar
              </span>
            );
          }

          return (
            <span className="fz-h4 fw-semibold">
              Desde $
              {Number(p.precioDesde).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          );
        }

        if (p.precio === null || p.precio === undefined) {
          return <span>—</span>;
        }

        return (
          <span className="fz-h4 fw-semibold">
            $
            {Number(p.precio).toLocaleString("es-MX", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        );
      },
    },

    {
      key: "disponible",
      label: "Disponibilidad",

      render: (p) => (
        <span
          className={`productoServicioStatus fz-h5 fw-semibold ${
            p.disponible
              ? "productoServicioStatusActive"
              : "productoServicioStatusInactive"
          }`}
        >
          {p.disponible ? "Disponible" : "No disponible"}
        </span>
      ),
    },

    {
      key: "activo",
      label: "Estado",

      render: (p) => (
        <span
          className={`productoServicioStatus fz-h5 fw-semibold ${
            p.activo
              ? "productoServicioStatusActive"
              : "productoServicioStatusInactive"
          }`}
        >
          {p.activo ? "Activo" : "Inactivo"}
        </span>
      ),
    },
  ];

  const abrirNuevoProducto = () => {
    setProducto(initialForm);
    setOpen(true);
  };

  const editarProducto = (productoSeleccionado: ProductoServicioDto) => {
    setProducto(productoSeleccionado);

    setOpen(true);
  };

  const cerrarModal = () => {
    setOpen(false);

    setProducto(initialForm);
  };

  return (
    <Box>
      <div className="filters-paper">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ md: "center" }}
        >
          <SearchInput
            value={search}
            placeholder="Buscar plan…"
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
            startIcon={<AddIcon />}
            className="btn-adlocal btn-adlocal--solid fz-h4 fw-semibold"
            onClick={abrirNuevoProducto}
          >
            Nuevo
          </Button>
        </Stack>
      </div>
      <div className="mt-4">
        <GenericTable<ProductoServicioDto>
          columns={columns}
          data={productos}
          loading={loading}
          emptyText="No hay productos o servicios registrados"
          page={page}
          rowsPerPage={rows}
          total={total}
          onPageChange={setPage}
          onRowsPerPageChange={(value) => {
            setRows(value);
            setPage(0);
          }}
          actions={(p) => (
            <div className="productoServicioTableActions">
              <Tooltip title="Editar" arrow>
                <Button
                  type="button"
                  className="btn-adlocal btn-adlocal--ghost btn-adlocal--sm productoServicioIconAction"
                  aria-label={`Editar ${p.nombre}`}
                  onClick={() => editarProducto(p)}
                >
                  <MaterialSymbol icon="edit" size="small" />
                </Button>
              </Tooltip>

              <Tooltip title="Eliminar" arrow>
                <Button
                  type="button"
                  className="btn-adlocal btn-adlocal--danger btn-adlocal--sm productoServicioIconAction"
                  aria-label={`Eliminar ${p.nombre}`}
                  onClick={() =>
                    eliminar(Number(p.id), 0, {
                      page,
                      rows,
                      orderBy,
                      search,
                      idComercio: 0,
                    })
                  }
                >
                  <MaterialSymbol icon="delete" size="small" />
                </Button>
              </Tooltip>

              <Tooltip title={p.activo ? "Desactivar" : "Activar"} arrow>
                <Button
                  type="button"
                  className={`btn-adlocal btn-adlocal--sm productoServicioIconAction ${
                    p.activo
                      ? "productoServicioToggleActive"
                      : "btn-adlocal--ghost"
                  }`}
                  aria-label={
                    p.activo ? `Desactivar ${p.nombre}` : `Activar ${p.nombre}`
                  }
                  onClick={() =>
                    desactivar(Number(p.id), 0, p.activo, {
                      page,
                      rows,
                      orderBy,
                      search,
                      idComercio: 0,
                    })
                  }
                >
                  <MaterialSymbol
                    icon={p.activo ? "toggle_on" : "toggle_off"}
                    size="medium"
                    filled={p.activo}
                  />
                </Button>
              </Tooltip>
            </div>
          )}
        />
      </div>
      {open && (
        <ProductoServicioModal
          key={`edit-${producto?.id ?? "new"}`}
          open={open}
          onClose={cerrarModal}
          onSave={(p) =>
            guardar(p, {
              page,
              rows,
              orderBy,
              search,
              idComercio: 0,
            })
          }
          producto={producto}
          loading={loading}
        />
      )}
    </Box>
  );
};
