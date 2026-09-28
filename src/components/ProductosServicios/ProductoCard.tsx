import type { ProductoServicioDto } from "../../types/User/productosServicios";

interface Props {
  producto: ProductoServicioDto;
}

export default function ProductoCard({ producto }: Props) {
  return (
    <div className="card-adlocal card-adlocal-interactive w-100 d-flex flex-column flex-sm-row align-items-start align-items-sm-center overflow-hidden">
      {producto.imagenBase64 && (
        <img
          src={producto.imagenBase64}
          alt={producto.nombre}
          className="object-fit-cover flex-shrink-0"
          style={{ width: "120px", height: "120px" }}
        />
      )}

      <div className="card-adlocal-body flex-grow-1 p-3">
        <h4 className="fz-h5 fw-bold mb-1 text-dark">
          {producto.nombre}
        </h4>

        {producto.descripcion && (
          <p className="fz-body-sm text-muted mb-2 text-truncate-2">
            {producto.descripcion}
          </p>
        )}

        {producto.precio != null && (
          <span className="fz-h6 fw-bold text-primary d-block">
            ${producto.precio.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
