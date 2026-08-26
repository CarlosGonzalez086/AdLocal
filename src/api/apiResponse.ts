export interface ApiResponse<T> {
  codigo: string;
  mensaje: string;
  respuesta: T;
}
export interface PaginatedResponse<T> {
  totalItems: number;
  totalPages: number;
  page: number;
  pageSize: number;
  items: T[];
}
