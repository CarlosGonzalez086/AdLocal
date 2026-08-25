export interface ConfiguracionPagoComercioDto {
  uuid?: string;
  idComercio?: number;

  aceptaEfectivo: boolean;
  aceptaTransferencia: boolean;

  instruccionesTransferencia: string | null;
  costoEnvio: number;
  compraMinimaEnvioGratis: number | null;

  activo: boolean;

  fechaCreacion?: string;
  fechaActualizacion?: string | null;
}

export interface CuentaBancariaComercioCreateDto {
  banco: string;
  beneficiario: string;

  numeroCuenta: string | null;
  clabe: string | null;
  numeroTarjeta: string | null;

  principal: boolean;
}

export interface CuentaBancariaComercioUpdateDto {
  banco: string;
  beneficiario: string;

  numeroCuenta: string | null;
  clabe: string | null;
  numeroTarjeta: string | null;

  principal: boolean;
  activo: boolean;
}

export interface CuentaBancariaComercioDto {
  uuid: string;

  idComercio: number;

  banco: string;
  beneficiario: string;

  numeroCuenta: string | null;
  clabe: string | null;
  numeroTarjeta: string | null;

  principal: boolean;
  activo: boolean;

  fechaCreacion: string;
  fechaActualizacion: string | null;
}
