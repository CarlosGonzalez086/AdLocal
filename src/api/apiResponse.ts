export interface ApiResponse<T> {
  codigo: string;
  mensaje: string;
  respuesta: T;
}
export interface PaginatedResponse<T> {
  totalRecords: number;
  page: number;
  pageSize: number;
  items: T[];
}