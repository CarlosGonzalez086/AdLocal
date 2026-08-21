import type { ApiResponse } from "../api/apiResponse";
import { httpUsuario } from "../api/httpUsuario";
import type {
  ChangeUserPasswordDto,
  ProfileUser,
  ProfileUserUpdateDto,
} from "../types/User/UserAuth";

export const profileUserApi = {
  getProfile: () => httpUsuario.get<ApiResponse<ProfileUser>>("/Auth"),

  updateProfile: (data: ProfileUserUpdateDto) =>
    httpUsuario.put<ApiResponse<ProfileUser>>("/Auth", data),

  changePassword: (data: ChangeUserPasswordDto) =>
    httpUsuario.put<ApiResponse<null>>("/Auth/cambiar-password", data),

  uploadPhoto: (base64Data: { base64: string }) =>
    httpUsuario.post<ApiResponse<{ url: string }>>(
      "/Auth/upload-photo",
      base64Data,
    ),
};
