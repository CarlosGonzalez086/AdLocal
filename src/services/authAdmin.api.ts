import type { ApiResponse } from "../api/apiResponse";
import { httpAdmin } from "../api/httpAdmin";
import { httpAdminPublico } from "../api/httpAdminPublico";
import type {
  AdminCreateDto,
  EmailAdminDto,
  LoginAdminDto,
} from "../types/Admin/AdminAuth";
import type { NewPasswordDto } from "../types/auth";

export const authAdmin = {
  crearAdmin(data: AdminCreateDto) {
    return httpAdminPublico.post<ApiResponse<null>>("/Admin/crear", data);
  },
  loginAdmin(data: LoginAdminDto) {
    return httpAdminPublico.post<ApiResponse<null>>("/Admin/login", data);
  },
  forgetPassword: (data: EmailAdminDto) =>
    httpAdminPublico.post<ApiResponse<null>>("/Admin/forget-password", data),
  newPassword: (data: NewPasswordDto) =>
    httpAdminPublico.post<ApiResponse<null>>("/Admin/new-password", data),
  checkToken: (token: string) =>
    httpAdminPublico.post<ApiResponse<null>>("/Admin/check-token", null, {
      params: { token },
    }),
  obtenerAdmin() {
    return httpAdmin.get<ApiResponse<null>>("/Admin");
  },

  actualizarAdmin(data: Partial<AdminCreateDto>) {
    return httpAdmin.put<ApiResponse<null>>("/Admin", data);
  },
};
