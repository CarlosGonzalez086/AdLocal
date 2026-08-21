export const TipoProductoServicio = {
  Producto: 1,
  Servicio: 2,
} as const;

export type TipoProductoServicio = typeof TipoProductoServicio[keyof typeof TipoProductoServicio];

export const ModalidadProductoServicio = {
  Compra: 1,
  Reservacion: 2,
  Cotizacion: 3,
} as const;

export type ModalidadProductoServicio = typeof ModalidadProductoServicio[keyof typeof ModalidadProductoServicio];

export interface ProductoServicioDto {
  id?: number;

  uuid?: string;

  nombre: string;

  descripcion: string;

  tipo: TipoProductoServicio;

  modalidad: ModalidadProductoServicio;

  precio: number | null;

  precioDesde: number | null;

  manejaStock: boolean;

  stock: number | null;

  disponible: boolean;

  permiteDomicilio: boolean;

  permiteRecoger: boolean;

  duracionMinutos: number | null;

  imagenBase64?: string;

  activo: boolean;

  visible: boolean;

  codigoInterno?: string | null;

  idComercio: number;
}
