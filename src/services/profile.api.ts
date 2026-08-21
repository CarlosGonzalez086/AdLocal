import type { ApiResponse } from "../api/apiResponse";
import { httpAdmin } from "../api/httpAdmin";
import type {
  ChangePasswordDto,
  Profile,
  ProfileUpdateDto,
} from "../types/Admin/profile.types";

export const profileApi = {
  getProfile: () => httpAdmin.get<ApiResponse<Profile>>("/Admin"),
  updateProfile: (data: ProfileUpdateDto) => httpAdmin.put("/Admin", data),
  changePassword: (data: ChangePasswordDto) =>
    httpAdmin.put("/Admin/cambiar-password", data),
};
