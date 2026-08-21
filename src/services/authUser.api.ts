import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
import { httpUsuarioPublico } from "../api/httpUsuarioPublico";
import type { NewPasswordDto } from "../types/auth";
import type {
  EmailUserDto,
  LoginUserDto,
  UserCreateDto,
  UserDto,
} from "../types/User/UserAuth";

export const authUser = {
  crearUser(data: UserCreateDto) {
    return httpUsuarioPublico.post<ApiResponse<null>>("/Usuario/crear", data);
  },
  loginUser(data: LoginUserDto) {
    return httpUsuarioPublico.post<ApiResponse<null>>("/Usuario/login", data);
  },
  forgetPassword: (data: EmailUserDto) =>
    httpUsuarioPublico.post<ApiResponse<null>>(
      "/Usuario/forget-password",
      data,
    ),
  newPassword: (data: NewPasswordDto) =>
    httpUsuarioPublico.post<ApiResponse<null>>("/Usuario/new-password", data),
  checkToken: (token: string) =>
    httpUsuarioPublico.post<ApiResponse<null>>("/Usuario/check-token", null, {
      params: { token },
    }),
  obtenerUser() {
    return httpUsuario.get<ApiResponse<null>>("/Usuario");
  },

  actualizarUser(data: Partial<UserDto>) {
    return httpUsuario.put<ApiResponse<null>>("/Usuario", data);
  },
};
